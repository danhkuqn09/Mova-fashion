<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Cart;
use App\Models\ProductVariant;
use App\Models\Voucher;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class OrderController extends Controller
{
    /**
     * Lấy danh sách đơn hàng của user
     */
    public function index(Request $request)
    {
        try {
            $user = Auth::user();
            $status = $request->input('status'); // filter theo trạng thái

            $query = Order::with(['items.productVariant.product', 'items.productVariant.color', 'voucher'])
                ->where('user_id', $user->id);

            // Lọc theo trạng thái nếu có
            if ($status) {
                $query->where('status', $status);
            }

            $orders = $query->orderBy('created_at', 'desc')->paginate(10);

            return response()->json([
                'success' => true,
                'message' => 'Lấy danh sách đơn hàng thành công',
                'data' => $orders
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Lỗi khi lấy danh sách đơn hàng',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Tạo đơn hàng mới từ giỏ hàng
     */
    public function store(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'name' => 'required|string|max:255',
                'email' => 'required|email|max:255',
                'phone' => 'required|string|max:20',
                'address' => 'required|string|max:500',
                'payment_method' => 'required|string|in:COD,momo,payos',
                'voucher_code' => 'nullable|string|exists:vouchers,code',
                'note' => 'nullable|string|max:1000',
                'cart_item_ids' => 'nullable|array', // ← Thêm field này
                'cart_item_ids.*' => 'integer|exists:carts,id', // Validate từng ID
            ], [
                'name.required' => 'Vui lòng nhập họ tên',
                'email.required' => 'Vui lòng nhập email',
                'email.email' => 'Email không hợp lệ',
                'phone.required' => 'Vui lòng nhập số điện thoại',
                'address.required' => 'Vui lòng nhập địa chỉ',
                'payment_method.required' => 'Vui lòng chọn phương thức thanh toán',
                'payment_method.in' => 'Phương thức thanh toán không hợp lệ',
                'voucher_code.exists' => 'Mã voucher không tồn tại',
                'cart_item_ids.array' => 'Danh sách sản phẩm không hợp lệ',
                'cart_item_ids.*.exists' => 'Sản phẩm không tồn tại trong giỏ hàng',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation error',
                    'errors' => $validator->errors()
                ], 422);
            }

            $user = Auth::user();

            // Lấy giỏ hàng
            $cartQuery = Cart::with('productVariant.product')
                ->where('user_id', $user->id);

            // ← NẾU CÓ cart_item_ids → Chỉ lấy những items được chọn
            if ($request->has('cart_item_ids') && !empty($request->cart_item_ids)) {
                $cartQuery->whereIn('id', $request->cart_item_ids);
            }
            // ← NẾU KHÔNG CÓ → Lấy toàn bộ giỏ hàng (giống cũ)

            $cartItems = $cartQuery->get();

            if ($cartItems->isEmpty()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Không có sản phẩm nào được chọn'
                ], 400);
            }

            DB::beginTransaction();

            try {
                // Tính tổng tiền
                $originalTotal = 0;
                $orderItemsData = [];

                foreach ($cartItems as $cartItem) {
                    $variant = $cartItem->productVariant;
                    $product = $variant->product;

                    // Kiểm tra tồn kho
                    if ($variant->quantity < $cartItem->quantity) {
                        DB::rollBack();
                        return response()->json([
                            'success' => false,
                            'message' => "Sản phẩm '{$product->name}' không đủ số lượng trong kho",
                            'data' => [
                                'product' => $product->name,
                                'requested' => $cartItem->quantity,
                                'available' => $variant->quantity
                            ]
                        ], 400);
                    }

                    // Tính giá hiển thị cho variant
                    $displayPrice = $variant->sale_price 
                        ?? $variant->price 
                        ?? $product->sale_price 
                        ?? $product->price;
                        
                    $subtotal = $displayPrice * $cartItem->quantity;
                    $originalTotal += $subtotal;

                    $orderItemsData[] = [
                        'product_variant_id' => $variant->id,
                        'quantity' => $cartItem->quantity,
                        'price' => $displayPrice,
                    ];
                }

                // Xử lý voucher nếu có
                $discountAmount = 0;
                $voucherId = null;

                if ($request->voucher_code) {
                    $voucher = Voucher::where('code', strtoupper($request->voucher_code))->first();

                    if (!$voucher) {
                        DB::rollBack();
                        return response()->json([
                            'success' => false,
                            'message' => 'Mã voucher không tồn tại'
                        ], 400);
                    }

                    if (!$voucher->canApply($originalTotal)) {
                        DB::rollBack();
                        $reason = 'Không thể áp dụng voucher';

                        if (!$voucher->isValid()) {
                            $reason = 'Mã voucher không còn hiệu lực';
                        } elseif ($originalTotal < $voucher->min_total) {
                            $reason = "Đơn hàng chưa đạt giá trị tối thiểu " . number_format($voucher->min_total) . "đ";
                        }

                        return response()->json([
                            'success' => false,
                            'message' => $reason
                        ], 400);
                    }

                    $discountAmount = $voucher->calculateDiscount($originalTotal);
                    $voucherId = $voucher->id;
                }

                $finalTotal = $originalTotal - $discountAmount;

                // Tạo đơn hàng
                $order = Order::create([
                    'user_id' => $user->id,
                    'voucher_id' => $voucherId,
                    'name' => $request->name,
                    'email' => $request->email,
                    'phone' => $request->phone,
                    'address' => $request->address,
                    'status' => 'pending',
                    'payment_status' => 'unpaid', // Mặc định chưa thanh toán
                    'original_total' => $originalTotal,
                    'discount_amount' => $discountAmount,
                    'final_total' => $finalTotal,
                    'payment_method' => $request->payment_method,
                    'note' => $request->note,
                ]);

                // Tạo order items và cập nhật tồn kho
                foreach ($orderItemsData as $itemData) {
                    $order->items()->create($itemData);

                    // Giảm số lượng tồn kho
                    $variant = ProductVariant::find($itemData['product_variant_id']);
                    $variant->quantity -= $itemData['quantity'];
                    $variant->save();
                }

                // Tăng used_count của voucher
                if ($voucherId) {
                    $voucher = Voucher::find($voucherId);
                    $voucher->incrementUsedCount();
                }

                // ← XÓA CHỈ NHỮNG ITEMS ĐÃ CHECKOUT
                if ($request->has('cart_item_ids') && !empty($request->cart_item_ids)) {
                    // Xóa theo IDs đã chọn
                    Cart::whereIn('id', $request->cart_item_ids)
                        ->where('user_id', $user->id)
                        ->delete();
                } else {
                    // Xóa toàn bộ giỏ hàng (giống cũ)
                    Cart::where('user_id', $user->id)->delete();
                }

                DB::commit();

                // Load lại order với relationships
                $order->load(['items.productVariant.product', 'items.productVariant.color', 'voucher']);

                // Xử lý thanh toán 
                if ($request->payment_method === 'momo') {
                    $momoResponse = $this->createMomoPayment($order);

                    if (isset($momoResponse['payUrl'])) {
                        return response()->json([
                            'success' => true,
                            'message' => 'Đặt hàng thành công. Vui lòng thanh toán.',
                            'data' => [
                                'order' => $order,
                                'payment_url' => $momoResponse['payUrl'],
                                'payment_method' => 'momo',
                                'qr_code_url' => $momoResponse['qrCodeUrl'] ?? null
                            ]
                        ], 201);
                    } else {
                        DB::rollBack();
                        return response()->json([
                            'success' => false,
                            'message' => 'Không thể tạo thanh toán Momo',
                            'error' => $momoResponse['message'] ?? 'Unknown error'
                        ], 500);
                    }
                }

                if ($request->payment_method === 'payos') {
                    $payosResponse = $this->createPayOSPayment($order);

                    if (isset($payosResponse['checkoutUrl'])) {
                        return response()->json([
                            'success' => true,
                            'message' => 'Đặt hàng thành công. Vui lòng thanh toán.',
                            'data' => [
                                'order' => $order,
                                'payment_url' => $payosResponse['checkoutUrl'],
                                'payment_method' => 'payos',
                                'qr_code_url' => $payosResponse['qrCode'] ?? null
                            ]
                        ], 201);
                    } else {
                        DB::rollBack();
                        return response()->json([
                            'success' => false,
                            'message' => 'Không thể tạo thanh toán PayOS',
                            'error' => $payosResponse['message'] ?? 'Unknown error'
                        ], 500);
                    }
                }

                // Thanh toán COD
                return response()->json([
                    'success' => true,
                    'message' => 'Đặt hàng thành công',
                    'data' => [
                        'order' => $order,
                        'payment_method' => 'COD'
                    ]
                ], 201);
            } catch (\Exception $e) {
                DB::rollBack();
                throw $e;
            }
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Lỗi khi tạo đơn hàng',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Mua ngay - Không qua giỏ hàng
     */
    public function buyNow(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'product_variant_id' => 'required|exists:product_variants,id',
                'quantity' => 'required|integer|min:1',
                'name' => 'required|string|max:255',
                'email' => 'required|email|max:255',
                'phone' => 'required|string|max:20',
                'address' => 'required|string|max:500',
                'payment_method' => 'required|string|in:COD,momo,payos',
                'voucher_code' => 'nullable|string|exists:vouchers,code',
                'note' => 'nullable|string|max:1000',
            ], [
                'product_variant_id.required' => 'Vui lòng chọn sản phẩm',
                'product_variant_id.exists' => 'Sản phẩm không tồn tại',
                'quantity.required' => 'Vui lòng nhập số lượng',
                'quantity.min' => 'Số lượng phải lớn hơn 0',
                'name.required' => 'Vui lòng nhập họ tên',
                'email.required' => 'Vui lòng nhập email',
                'email.email' => 'Email không hợp lệ',
                'phone.required' => 'Vui lòng nhập số điện thoại',
                'address.required' => 'Vui lòng nhập địa chỉ',
                'payment_method.required' => 'Vui lòng chọn phương thức thanh toán',
                'payment_method.in' => 'Phương thức thanh toán không hợp lệ',
                'voucher_code.exists' => 'Mã voucher không tồn tại',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation error',
                    'errors' => $validator->errors()
                ], 422);
            }

            $user = Auth::user();
            $variant = ProductVariant::with('product')->findOrFail($request->product_variant_id);

            // Kiểm tra tồn kho
            if ($variant->quantity < $request->quantity) {
                return response()->json([
                    'success' => false,
                    'message' => 'Sản phẩm không đủ số lượng trong kho',
                    'data' => [
                        'available_quantity' => $variant->quantity,
                        'requested_quantity' => $request->quantity
                    ]
                ], 400);
            }

            DB::beginTransaction();

            try {
                // Tính giá hiển thị cho variant
                $displayPrice = $variant->sale_price 
                    ?? $variant->price 
                    ?? $variant->product->sale_price 
                    ?? $variant->product->price;

                $originalTotal = $displayPrice * $request->quantity;

                // Xử lý voucher nếu có
                $discountAmount = 0;
                $voucherId = null;

                if ($request->voucher_code) {
                    $voucher = Voucher::where('code', strtoupper($request->voucher_code))->first();

                    if (!$voucher) {
                        DB::rollBack();
                        return response()->json([
                            'success' => false,
                            'message' => 'Mã voucher không tồn tại'
                        ], 400);
                    }

                    if (!$voucher->canApply($originalTotal)) {
                        DB::rollBack();
                        $reason = 'Không thể áp dụng voucher';

                        if (!$voucher->isValid()) {
                            $reason = 'Mã voucher không còn hiệu lực';
                        } elseif ($originalTotal < $voucher->min_total) {
                            $reason = "Đơn hàng chưa đạt giá trị tối thiểu " . number_format($voucher->min_total) . "đ";
                        }

                        return response()->json([
                            'success' => false,
                            'message' => $reason
                        ], 400);
                    }

                    $discountAmount = $voucher->calculateDiscount($originalTotal);
                    $voucherId = $voucher->id;
                }

                $finalTotal = $originalTotal - $discountAmount;

                // Tạo đơn hàng
                $order = Order::create([
                    'user_id' => $user->id,
                    'voucher_id' => $voucherId,
                    'name' => $request->name,
                    'email' => $request->email,
                    'phone' => $request->phone,
                    'address' => $request->address,
                    'status' => 'pending',
                    'payment_status' => 'unpaid',
                    'original_total' => $originalTotal,
                    'discount_amount' => $discountAmount,
                    'final_total' => $finalTotal,
                    'payment_method' => $request->payment_method,
                    'note' => $request->note,
                ]);

                // Tạo order item
                $order->items()->create([
                    'product_variant_id' => $variant->id,
                    'quantity' => $request->quantity,
                    'price' => $displayPrice,
                ]);

                // Giảm số lượng tồn kho
                $variant->quantity -= $request->quantity;
                $variant->save();

                // Tăng used_count của voucher
                if ($voucherId) {
                    $voucher = Voucher::find($voucherId);
                    $voucher->incrementUsedCount();
                }

                DB::commit();

                // Load lại order với relationships
                $order->load(['items.productVariant.product', 'items.productVariant.color', 'voucher']);

                // Xử lý thanh toán
                if ($request->payment_method === 'momo') {
                    $momoResponse = $this->createMomoPayment($order);

                    if (isset($momoResponse['payUrl'])) {
                        return response()->json([
                            'success' => true,
                            'message' => 'Đặt hàng thành công. Vui lòng thanh toán.',
                            'data' => [
                                'order' => $order,
                                'payment_url' => $momoResponse['payUrl'],
                                'payment_method' => 'momo',
                                'qr_code_url' => $momoResponse['qrCodeUrl'] ?? null
                            ]
                        ], 201);
                    } else {
                        DB::rollBack();
                        return response()->json([
                            'success' => false,
                            'message' => 'Không thể tạo thanh toán Momo',
                            'error' => $momoResponse['message'] ?? 'Unknown error'
                        ], 500);
                    }
                }

                if ($request->payment_method === 'payos') {
                    $payosResponse = $this->createPayOSPayment($order);

                    if (isset($payosResponse['checkoutUrl'])) {
                        return response()->json([
                            'success' => true,
                            'message' => 'Đặt hàng thành công. Vui lòng thanh toán.',
                            'data' => [
                                'order' => $order,
                                'payment_url' => $payosResponse['checkoutUrl'],
                                'payment_method' => 'payos',
                                'qr_code_url' => $payosResponse['qrCode'] ?? null
                            ]
                        ], 201);
                    } else {
                        DB::rollBack();
                        return response()->json([
                            'success' => false,
                            'message' => 'Không thể tạo thanh toán PayOS',
                            'error' => $payosResponse['message'] ?? 'Unknown error'
                        ], 500);
                    }
                }

                // Thanh toán COD
                return response()->json([
                    'success' => true,
                    'message' => 'Đặt hàng thành công',
                    'data' => [
                        'order' => $order,
                        'payment_method' => 'COD'
                    ]
                ], 201);

            } catch (\Exception $e) {
                DB::rollBack();
                throw $e;
            }

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Lỗi khi tạo đơn hàng',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Xem chi tiết đơn hàng
     */
    public function show($id)
    {
        try {
            $user = Auth::user();

            $order = Order::with([
                'items.productVariant.product',
                'items.productVariant.color',
                'items.review', // Load review relationship
                'voucher'
            ])->where('user_id', $user->id) // ← Chỉ lấy đơn của user
                ->find($id);

            if (!$order) {
                return response()->json([
                    'success' => false,
                    'message' => 'Không tìm thấy đơn hàng'
                ], 404);
            }

            // Format order items với thông tin review
            $formattedItems = $order->items->map(function ($item) use ($order) {
                $hasReview = $item->review !== null;
                $canReview = $order->status === 'completed' && !$hasReview;

                return [
                    'id' => $item->id,
                    'product' => [
                        'id' => $item->productVariant->product->id,
                        'name' => $item->productVariant->product->name,
                        'image' => $item->productVariant->product->image ? Storage::url($item->productVariant->product->image) : null,
                    ],
                    'variant' => [
                        'color' => $item->productVariant->color->color_name ?? null,
                        'size' => $item->productVariant->size ?? null,
                    ],
                    'quantity' => $item->quantity,
                    'price' => $item->price,
                    'subtotal' => $item->quantity * $item->price,
                    // Thông tin review
                    'can_review' => $canReview,
                    'has_review' => $hasReview,
                    'review' => $hasReview ? [
                        'id' => $item->review->id,
                        'rating' => $item->review->rating,
                        'content' => $item->review->content,
                        'image' => $item->review->image ? Storage::url($item->review->image) : null,
                        'created_at' => $item->review->created_at->format('d/m/Y H:i'),
                    ] : null,
                ];
            });

            $orderData = [
                'id' => $order->id,
                'order_code' => $order->order_code,
                'status' => $order->status,
                'status_text' => $this->getStatusText($order->status),
                'payment_method' => $order->payment_method,
                'payment_method_text' => $this->getPaymentMethodText($order->payment_method),
                'payment_status' => $order->payment_status,
                'customer_info' => [
                    'name' => $order->name,
                    'email' => $order->email,
                    'phone' => $order->phone,
                    'address' => $order->address,
                ],
                'pricing' => [
                    'original_total' => $order->original_total,
                    'discount_amount' => $order->discount_amount,
                    'final_total' => $order->final_total,
                ],
                'voucher' => $order->voucher ? [
                    'code' => $order->voucher->code,
                    'type' => $order->voucher->type,
                    'value' => $order->voucher->value,
                ] : null,
                'items' => $formattedItems,
                'note' => $order->note,
                'created_at' => $order->created_at->format('d/m/Y H:i'),
                'updated_at' => $order->updated_at->format('d/m/Y H:i'),
            ];

            return response()->json([
                'success' => true,
                'message' => 'Lấy chi tiết đơn hàng thành công',
                'data' => $orderData
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Lỗi khi lấy chi tiết đơn hàng',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Hủy đơn hàng (chỉ khi status = pending)
     */
    public function cancel($id)
    {
        try {
            $user = Auth::user();

            $order = Order::with('items')->find($id);

            if (!$order) {
                return response()->json([
                    'success' => false,
                    'message' => 'Không tìm thấy đơn hàng'
                ], 404);
            }

            // Kiểm tra quyền
            if ($order->user_id !== $user->id) {
                return response()->json([
                    'success' => false,
                    'message' => 'Bạn không có quyền hủy đơn hàng này'
                ], 403);
            }

            // Chỉ cho phép hủy đơn hàng pending
            if ($order->status !== 'pending') {
                return response()->json([
                    'success' => false,
                    'message' => 'Chỉ có thể hủy đơn hàng đang chờ xử lý',
                    'data' => [
                        'current_status' => $order->status
                    ]
                ], 400);
            }

            DB::beginTransaction();

            try {
                // Hoàn lại số lượng tồn kho
                foreach ($order->items as $item) {
                    $variant = ProductVariant::find($item->product_variant_id);
                    $variant->quantity += $item->quantity;
                    $variant->save();
                }

                // Hoàn lại voucher nếu có
                if ($order->voucher_id) {
                    $voucher = Voucher::find($order->voucher_id);
                    $voucher->decrement('used_count');
                }

                // Cập nhật trạng thái
                $order->status = 'cancelled';
                $order->save();

                DB::commit();

                return response()->json([
                    'success' => true,
                    'message' => 'Hủy đơn hàng thành công',
                    'data' => $order
                ], 200);
            } catch (\Exception $e) {
                DB::rollBack();
                throw $e;
            }
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Lỗi khi hủy đơn hàng',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Admin: Lấy tất cả đơn hàng
     */
    public function adminIndex(Request $request)
    {
        try {
            $status = $request->input('status');
            $search = $request->input('search');
            $perPage = $request->input('per_page', 15);

            $query = Order::with(['user', 'items.productVariant.product', 'voucher']);

            // Lọc theo trạng thái
            if ($status) {
                $query->where('status', $status);
            }

            // Tìm kiếm theo tên, email, phone
            if ($search) {
                $query->where(function ($q) use ($search) {
                    $q->where('name', 'LIKE', "%{$search}%")
                        ->orWhere('email', 'LIKE', "%{$search}%")
                        ->orWhere('phone', 'LIKE', "%{$search}%")
                        ->orWhere('id', 'LIKE', "%{$search}%");
                });
            }

            $orders = $query->orderBy('created_at', 'desc')->paginate($perPage);

            return response()->json([
                'success' => true,
                'message' => 'Lấy danh sách đơn hàng thành công',
                'data' => $orders
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Lỗi khi lấy danh sách đơn hàng',
                'error' => $e->getMessage()
            ], 500);
        }
    }
    //Show chi tiết đơn hàng admin
    public function adminShowOrder($id)
    {
        try {
            $order = Order::with([
                'items.productVariant.product.category',
                'items.productVariant.color',
                'voucher',
                'user' // ← Admin cần thấy thông tin user
            ])->find($id);

            if (!$order) {
                return response()->json([
                    'success' => false,
                    'message' => 'Không tìm thấy đơn hàng'
                ], 404);
            }

            // KHÔNG CẦN kiểm tra quyền vì đã có middleware admin

            return response()->json([
                'success' => true,
                'message' => 'Lấy chi tiết đơn hàng thành công',
                'data' => $order
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Lỗi khi lấy chi tiết đơn hàng',
                'error' => $e->getMessage()
            ], 500);
        }
    }
    /**
     * Admin: Cập nhật trạng thái đơn hàng
     */
    public function updateStatus(Request $request, $id)
    {
        try {
            $validator = Validator::make($request->all(), [
                'status' => 'required|string|in:pending,processing,shipping,completed,cancelled',
            ], [
                'status.required' => 'Vui lòng chọn trạng thái',
                'status.in' => 'Trạng thái không hợp lệ',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation error',
                    'errors' => $validator->errors()
                ], 422);
            }

            $order = Order::with('items')->find($id);

            if (!$order) {
                return response()->json([
                    'success' => false,
                    'message' => 'Không tìm thấy đơn hàng'
                ], 404);
            }

            $oldStatus = $order->status;
            $newStatus = $request->status;

            // Nếu đổi từ trạng thái khác sang cancelled
            if ($oldStatus !== 'cancelled' && $newStatus === 'cancelled') {
                DB::beginTransaction();

                try {
                    // Hoàn lại tồn kho
                    foreach ($order->items as $item) {
                        $variant = ProductVariant::find($item->product_variant_id);
                        $variant->quantity += $item->quantity;
                        $variant->save();
                    }

                    // Hoàn lại voucher
                    if ($order->voucher_id) {
                        $voucher = Voucher::find($order->voucher_id);
                        $voucher->decrement('used_count');
                    }

                    $order->status = $newStatus;
                    $order->save();

                    DB::commit();
                } catch (\Exception $e) {
                    DB::rollBack();
                    throw $e;
                }
            } else {
                // Cập nhật trạng thái bình thường
                $order->status = $newStatus;
                $order->save();
            }

            return response()->json([
                'success' => true,
                'message' => 'Cập nhật trạng thái đơn hàng thành công',
                'data' => [
                    'order_id' => $order->id,
                    'old_status' => $oldStatus,
                    'new_status' => $newStatus,
                ]
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Lỗi khi cập nhật trạng thái đơn hàng',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Admin: Xóa đơn hàng
     */
    public function destroy($id)
    {
        try {
            $order = Order::find($id);

            if (!$order) {
                return response()->json([
                    'success' => false,
                    'message' => 'Không tìm thấy đơn hàng'
                ], 404);
            }

            // Chỉ cho phép xóa đơn hàng đã hủy
            if ($order->status !== 'cancelled') {
                return response()->json([
                    'success' => false,
                    'message' => 'Chỉ có thể xóa đơn hàng đã hủy',
                    'data' => [
                        'current_status' => $order->status
                    ]
                ], 400);
            }

            $order->delete();

            return response()->json([
                'success' => true,
                'message' => 'Xóa đơn hàng thành công'
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Lỗi khi xóa đơn hàng',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Thống kê đơn hàng theo trạng thái
     */
    public function getStatistics()
    {
        try {
            $user = Auth::user();

            $statistics = [
                'pending' => Order::where('user_id', $user->id)->where('status', 'pending')->count(),
                'processing' => Order::where('user_id', $user->id)->where('status', 'processing')->count(),
                'shipping' => Order::where('user_id', $user->id)->where('status', 'shipping')->count(),
                'completed' => Order::where('user_id', $user->id)->where('status', 'completed')->count(),
                'cancelled' => Order::where('user_id', $user->id)->where('status', 'cancelled')->count(),
                'total' => Order::where('user_id', $user->id)->count(),
            ];

            return response()->json([
                'success' => true,
                'message' => 'Lấy thống kê đơn hàng thành công',
                'data' => $statistics
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Lỗi khi lấy thống kê đơn hàng',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Admin: Thống kê tổng quan
     */
    public function adminStatistics(Request $request)
    {
        try {
            $startDate = $request->input('start_date');
            $endDate = $request->input('end_date');

            $query = Order::query();

            if ($startDate && $endDate) {
                $query->whereBetween('created_at', [$startDate, $endDate]);
            }

            $statistics = [
                'total_orders' => (clone $query)->count(),
                'pending' => (clone $query)->where('status', 'pending')->count(),
                'processing' => (clone $query)->where('status', 'processing')->count(),
                'shipping' => (clone $query)->where('status', 'shipping')->count(),
                'completed' => (clone $query)->where('status', 'completed')->count(),
                'cancelled' => (clone $query)->where('status', 'cancelled')->count(),
                'total_revenue' => (clone $query)->where('status', 'completed')->sum('final_total'),
                'total_discount' => (clone $query)->sum('discount_amount'),
            ];

            return response()->json([
                'success' => true,
                'message' => 'Lấy thống kê thành công',
                'data' => $statistics
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Lỗi khi lấy thống kê',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Tạo thanh toán Momo
     */
    private function createMomoPayment($order)
    {
        $partnerCode = config('services.momo.partner_code');
        $accessKey = config('services.momo.access_key');
        $secretKey = config('services.momo.secret_key');
        $endpoint = config('services.momo.endpoint');
        $returnUrl = config('services.momo.return_url');
        $notifyUrl = config('services.momo.notify_url');

        $orderId = $order->id . '_' . time(); // Lưu order_id để retrieve sau
        $requestId = $orderId;
        $amount = (string) ((int) $order->final_total);
        $orderInfo = "Thanh toan don hang Mova Fashion";
        $redirectUrl = $returnUrl;
        $ipnUrl = $notifyUrl;
        $extraData = base64_encode(json_encode(['order_id' => $order->id]));
        $requestType = "captureWallet";

        // captureWallet API signature
        $rawHash = "accessKey=" . $accessKey .
            "&amount=" . $amount .
            "&extraData=" . $extraData .
            "&ipnUrl=" . $ipnUrl .
            "&orderId=" . $orderId .
            "&orderInfo=" . $orderInfo .
            "&partnerCode=" . $partnerCode .
            "&redirectUrl=" . $redirectUrl .
            "&requestId=" . $requestId .
            "&requestType=" . $requestType;

        $signature = hash_hmac("sha256", $rawHash, $secretKey);

        // Debug - Log để kiểm tra
        Log::info('Momo Payment Request', [
            'rawHash' => $rawHash,
            'signature' => $signature,
            'secretKey' => substr($secretKey, 0, 5) . '***'
        ]);

        // captureWallet API request data
        $data = [
            'partnerCode' => $partnerCode,
            'partnerName' => "Mova Fashion",
            'storeId' => "MovaStore",
            'requestId' => $requestId,
            'amount' => $amount,
            'orderId' => $orderId,
            'orderInfo' => $orderInfo,
            'redirectUrl' => $redirectUrl,
            'ipnUrl' => $ipnUrl,
            'lang' => 'vi',
            'extraData' => $extraData,
            'requestType' => $requestType,
            'signature' => $signature
        ];

        try {
            $result = $this->execPostRequest($endpoint, json_encode($data));
            $jsonResult = json_decode($result, true);

            // Debug - Log response
            Log::info('Momo Response', ['response' => $jsonResult]);

            // Lưu orderId để mapping sau
            if (isset($jsonResult['payUrl'])) {
                $order->transaction_id = $orderId;
                $order->save();
            }

            return $jsonResult;
        } catch (\Exception $e) {
            return [
                'resultCode' => 500,
                'message' => $e->getMessage()
            ];
        }
    }

    /**
     * Execute POST request
     */
    private function execPostRequest($url, $data)
    {
        $ch = curl_init($url);
        curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "POST");
        curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt(
            $ch,
            CURLOPT_HTTPHEADER,
            array(
                'Content-Type: application/json',
                'Content-Length: ' . strlen($data)
            )
        );
        curl_setopt($ch, CURLOPT_TIMEOUT, 5);
        curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 5);

        $result = curl_exec($ch);
        curl_close($ch);

        return $result;
    }

    /**
     * Xử lý IPN (notify) từ Momo
     */
    public function momoNotify(Request $request)
    {
        try {
            $secretKey = config('services.momo.secret_key');

            // Verify signature
            $rawHash = "accessKey=" . config('services.momo.access_key') .
                "&amount=" . $request->amount .
                "&extraData=" . $request->extraData .
                "&message=" . $request->message .
                "&orderId=" . $request->orderId .
                "&orderInfo=" . $request->orderInfo .
                "&orderType=" . $request->orderType .
                "&partnerCode=" . $request->partnerCode .
                "&payType=" . $request->payType .
                "&requestId=" . $request->requestId .
                "&responseTime=" . $request->responseTime .
                "&resultCode=" . $request->resultCode .
                "&transId=" . $request->transId;

            $signature = hash_hmac("sha256", $rawHash, $secretKey);

            if ($signature !== $request->signature) {
                return response()->json([
                    'resultCode' => 97,
                    'message' => 'Invalid signature'
                ]);
            }

            // Lấy order_id từ extraData
            $extraData = json_decode(base64_decode($request->extraData), true);
            $orderId = $extraData['order_id'] ?? null;

            if (!$orderId) {
                return response()->json([
                    'resultCode' => 98,
                    'message' => 'Order ID not found'
                ]);
            }

            $order = Order::find($orderId);

            if (!$order) {
                return response()->json([
                    'resultCode' => 99,
                    'message' => 'Order not found'
                ]);
            }

            // Momo resultCode = 0 nghĩa là thành công
            if ($request->resultCode == 0) {
                $order->status = 'processing';
                $order->payment_status = 'paid';
                $order->save();

                Log::info('Momo payment successful', [
                    'order_id' => $order->id,
                    'status' => $order->status,
                    'payment_status' => $order->payment_status
                ]);

                return response()->json([
                    'resultCode' => 0,
                    'message' => 'Success'
                ]);
            } else {
                // Thanh toán thất bại - hủy đơn hàng
                DB::beginTransaction();

                try {
                    // Hoàn lại tồn kho
                    foreach ($order->items as $item) {
                        $variant = ProductVariant::find($item->product_variant_id);
                        $variant->quantity += $item->quantity;
                        $variant->save();
                    }

                    // Hoàn lại voucher
                    if ($order->voucher_id) {
                        $voucher = Voucher::find($order->voucher_id);
                        $voucher->decrement('used_count');
                    }

                    $order->status = 'cancelled';
                    $order->payment_status = 'unpaid';
                    $order->save();

                    Log::info('Momo payment failed - order cancelled', [
                        'order_id' => $order->id,
                        'resultCode' => $request->resultCode
                    ]);

                    DB::commit();

                    return response()->json([
                        'resultCode' => 0,
                        'message' => 'Order cancelled'
                    ]);
                } catch (\Exception $e) {
                    DB::rollBack();

                    return response()->json([
                        'resultCode' => 99,
                        'message' => 'Error'
                    ]);
                }
            }
        } catch (\Exception $e) {
            return response()->json([
                'resultCode' => 99,
                'message' => 'Error: ' . $e->getMessage()
            ]);
        }
    }

    /**
     * Xử lý callback từ Momo (Return URL)
     */
    public function momoCallback(Request $request)
    {
        try {
            // Lấy order_id từ extraData
            $extraData = json_decode(base64_decode($request->extraData), true);
            $orderId = $extraData['order_id'] ?? null;

            if (!$orderId) {
                return response()->json([
                    'success' => false,
                    'message' => 'Không tìm thấy thông tin đơn hàng'
                ], 400);
            }

            $order = Order::find($orderId);

            if (!$order) {
                return response()->json([
                    'success' => false,
                    'message' => 'Không tìm thấy đơn hàng'
                ], 404);
            }

            // Momo resultCode = 0 là thành công
            if ($request->resultCode == 0) {
                return response()->json([
                    'success' => true,
                    'message' => 'Thanh toán thành công',
                    'data' => [
                        'order_id' => $order->id,
                        'status' => $order->status,
                        'amount' => $order->final_total,
                        'transaction_id' => $request->transId ?? null,
                    ]
                ], 200);
            } else {
                return response()->json([
                    'success' => false,
                    'message' => 'Thanh toán thất bại. Đơn hàng đã bị hủy.',
                    'data' => [
                        'order_id' => $order->id,
                        'status' => $order->status,
                        'result_code' => $request->resultCode,
                        'message' => $request->message,
                    ]
                ], 400);
            }
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Lỗi khi xử lý callback Momo',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Kiểm tra trạng thái thanh toán
     */
    public function checkPaymentStatus($orderId)
    {
        try {
            $order = Order::find($orderId);

            if (!$order) {
                return response()->json([
                    'success' => false,
                    'message' => 'Không tìm thấy đơn hàng'
                ], 404);
            }

            // Kiểm tra quyền truy cập
            $user = Auth::user();
            if ($order->user_id !== $user->id && $user->role !== 'admin') {
                return response()->json([
                    'success' => false,
                    'message' => 'Bạn không có quyền kiểm tra đơn hàng này'
                ], 403);
            }

            $isPaid = in_array($order->status, ['processing', 'shipping', 'completed']);

            return response()->json([
                'success' => true,
                'message' => 'Lấy trạng thái thanh toán thành công',
                'data' => [
                    'order_id' => $order->id,
                    'status' => $order->status,
                    'is_paid' => $isPaid,
                    'payment_method' => $order->payment_method,
                ]
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Lỗi khi kiểm tra trạng thái thanh toán',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Tạo thanh toán PayOS
     */
    private function createPayOSPayment($order)
    {
        $clientId = config('services.payos.client_id');
        $apiKey = config('services.payos.api_key');
        $checksumKey = config('services.payos.checksum_key');
        $endpoint = config('services.payos.endpoint');
        $returnUrl = config('services.payos.return_url');
        $cancelUrl = config('services.payos.cancel_url');

        $orderCode = (int) ($order->id . time()); // PayOS yêu cầu số nguyên
        $amount = (int) $order->final_total;
        $description = "Mova thanh toan " . number_format($order->final_total); // Max 25 ký tự

        // Tạo items trước
        $items = [];
        foreach ($order->items as $item) {
            $items[] = [
                'name' => $item->productVariant->product->name ?? 'Product',
                'quantity' => $item->quantity,
                'price' => (int) $item->price
            ];
        }

        // Tạo signature - PayOS yêu cầu format cụ thể
        $signatureData = "amount={$amount}&cancelUrl={$cancelUrl}&description={$description}&orderCode={$orderCode}&returnUrl={$returnUrl}";
        $signature = hash_hmac('sha256', $signatureData, $checksumKey);

        // Tạo data request - PHẢI có signature trong body
        $data = [
            'orderCode' => $orderCode,
            'amount' => $amount,
            'description' => $description,
            'buyerName' => $order->name,
            'buyerEmail' => $order->email,
            'buyerPhone' => $order->phone,
            'buyerAddress' => $order->address,
            'items' => $items,
            'cancelUrl' => $cancelUrl,
            'returnUrl' => $returnUrl,
            'signature' => $signature
        ];

        // Log để debug
        Log::info('PayOS Payment Request', [
            'orderCode' => $orderCode,
            'amount' => $amount,
            'signature' => $signature
        ]);

        try {
            $ch = curl_init($endpoint);
            curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "POST");
            curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            curl_setopt($ch, CURLOPT_HTTPHEADER, [
                'Content-Type: application/json',
                'x-client-id: ' . $clientId,
                'x-api-key: ' . $apiKey,
            ]);
            curl_setopt($ch, CURLOPT_TIMEOUT, 30);

            $result = curl_exec($ch);
            $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
            curl_close($ch);

            $jsonResult = json_decode($result, true);

            // Log response
            Log::info('PayOS Response', ['response' => $jsonResult, 'httpCode' => $httpCode]);

            if ($httpCode === 200 && isset($jsonResult['data'])) {
                // Lưu orderCode để mapping sau
                $order->transaction_id = (string) $orderCode;
                $order->save();

                return $jsonResult['data'];
            }

            return [
                'error' => true,
                'message' => $jsonResult['desc'] ?? 'Unknown error',
                'code' => $jsonResult['code'] ?? 'UNKNOWN'
            ];
        } catch (\Exception $e) {
            Log::error('PayOS Payment Error', ['error' => $e->getMessage()]);
            return [
                'error' => true,
                'message' => $e->getMessage()
            ];
        }
    }

    /**
     * Xử lý webhook từ PayOS
     */
    public function payosWebhook(Request $request)
    {
        try {
            $checksumKey = config('services.payos.checksum_key');

            // Verify webhook signature
            $webhookData = $request->all();
            Log::info('PayOS Webhook Received', $webhookData);

            // Tìm order theo orderCode
            $orderCode = $webhookData['data']['orderCode'] ?? null;
            if (!$orderCode) {
                return response()->json(['error' => 'Invalid webhook data'], 400);
            }

            $order = Order::where('transaction_id', (string) $orderCode)->first();
            if (!$order) {
                return response()->json(['error' => 'Order not found'], 404);
            }

            // Kiểm tra trạng thái thanh toán
            $code = $webhookData['code'] ?? null;
            $success = $webhookData['success'] ?? false;

            if ($code === '00' && $success) {
                // Thanh toán thành công
                $order->status = 'processing';
                $order->payment_status = 'paid';
                $order->save();

                Log::info('PayOS payment successful', [
                    'order_id' => $order->id,
                    'status' => $order->status,
                    'payment_status' => $order->payment_status
                ]);

                return response()->json([
                    'error' => 0,
                    'message' => 'Webhook received successfully'
                ]);
            } else {
                // Thanh toán thất bại - rollback
                DB::beginTransaction();
                try {
                    $order->status = 'cancelled';
                    $order->payment_status = 'unpaid';
                    $order->save();

                    // Hoàn lại tồn kho
                    foreach ($order->items as $item) {
                        $variant = ProductVariant::find($item->product_variant_id);
                        $variant->quantity += $item->quantity;
                        $variant->save();
                    }

                    // Hoàn lại voucher
                    if ($order->voucher_id) {
                        $voucher = Voucher::find($order->voucher_id);
                        $voucher->decrement('used_count');
                    }

                    Log::info('PayOS payment failed - order cancelled', [
                        'order_id' => $order->id,
                        'code' => $code
                    ]);

                    DB::commit();

                    return response()->json([
                        'error' => 0,
                        'message' => 'Payment failed, order cancelled'
                    ]);
                } catch (\Exception $e) {
                    DB::rollBack();
                    throw $e;
                }
            }
        } catch (\Exception $e) {
            Log::error('PayOS Webhook Error', ['error' => $e->getMessage()]);
            return response()->json(['error' => 'Internal server error'], 500);
        }
    }

    /**
     * Xử lý return URL từ PayOS
     */
    public function payosReturn(Request $request)
    {
        try {
            $code = $request->query('code');
            $id = $request->query('id');
            $orderCode = $request->query('orderCode');

            // Tìm order
            $order = Order::where('transaction_id', (string) $orderCode)->first();

            if (!$order) {
                return response()->json([
                    'success' => false,
                    'message' => 'Không tìm thấy đơn hàng'
                ], 404);
            }

            if ($code === '00') {
                return response()->json([
                    'success' => true,
                    'message' => 'Thanh toán thành công',
                    'data' => [
                        'order_id' => $order->id,
                        'status' => $order->status,
                        'amount' => $order->final_total
                    ]
                ], 200);
            } else {
                return response()->json([
                    'success' => false,
                    'message' => 'Thanh toán thất bại. Đơn hàng đã bị hủy.',
                    'data' => [
                        'order_id' => $order->id,
                        'status' => $order->status,
                        'code' => $code
                    ]
                ], 400);
            }
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Lỗi khi xử lý return PayOS',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Helper: Lấy text hiển thị trạng thái
     */
    private function getStatusText($status)
    {
        $statusTexts = [
            'pending' => 'Chờ xác nhận',
            'processing' => 'Đang xử lý',
            'shipping' => 'Đang giao hàng',
            'completed' => 'Hoàn thành',
            'cancelled' => 'Đã hủy',
        ];

        return $statusTexts[$status] ?? $status;
    }

    /**
     * Helper: Lấy text hiển thị phương thức thanh toán
     */
    private function getPaymentMethodText($paymentMethod)
    {
        $paymentTexts = [
            'COD' => 'Thanh toán khi nhận hàng',
            'momo' => 'Ví điện tử Momo',
            'payos' => 'Chuyển khoản ngân hàng (PayOS)',
        ];

        return $paymentTexts[$paymentMethod] ?? $paymentMethod;
    }
}
