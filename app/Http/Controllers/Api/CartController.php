<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Cart;
use App\Models\ProductVariant;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class CartController extends Controller
{
    /**
     * Lấy danh sách giỏ hàng của user
     */
    public function index()
    {
        try {
            $user = Auth::user();
            
            $carts = Cart::with([
                'productVariant.product.category',
                'productVariant.color'
            ])
            ->where('user_id', $user->id)
            ->get();

            // Tính tổng giá trị giỏ hàng
            $totalPrice = 0;
            $items = [];

            foreach ($carts as $cart) {
                $variant = $cart->productVariant;
                $product = $variant->product;
                
                // Tính giá hiển thị cho variant
                $displayPrice = $variant->sale_price 
                    ?? $variant->price 
                    ?? $product->sale_price 
                    ?? $product->price;
                    
                $subtotal = $displayPrice * $cart->quantity;
                $totalPrice += $subtotal;

                $items[] = [
                    'id' => $cart->id,
                    'product_variant_id' => $variant->id,
                    'product' => [
                        'id' => $product->id,
                        'name' => $product->name,
                        'image' => $product->image,
                        'price' => $product->price,
                        'sale_price' => $product->sale_price,
                        'category' => $product->category->name ?? null,
                    ],
                    'variant' => [
                        'id' => $variant->id,
                        'size' => $variant->size,
                        'color' => $variant->color->color_name ?? null,
                        'color_code' => $variant->color->color_code ?? null,
                        'color_hex' => $variant->color->hex_code ?? null,
                        'image' => $variant->image,
                        'quantity' => $variant->quantity,
                        'price' => $variant->price,
                        'sale_price' => $variant->sale_price,
                    ],
                    'quantity' => $cart->quantity,
                    'price' => (float) $displayPrice,
                    'subtotal' => (float) $subtotal,
                ];
            }

            return response()->json([
                'success' => true,
                'message' => 'Lấy giỏ hàng thành công',
                'data' => [
                    'items' => $items,
                    'total_items' => count($items),
                    'total_price' => $totalPrice,
                ]
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Lỗi khi lấy giỏ hàng',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Thêm sản phẩm vào giỏ hàng
     */
    public function store(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'product_variant_id' => 'required|exists:product_variants,id',
                'quantity' => 'required|integer|min:1',
            ], [
                'product_variant_id.required' => 'Vui lòng chọn sản phẩm',
                'product_variant_id.exists' => 'Sản phẩm không tồn tại',
                'quantity.required' => 'Vui lòng nhập số lượng',
                'quantity.integer' => 'Số lượng phải là số nguyên',
                'quantity.min' => 'Số lượng phải lớn hơn 0',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation error',
                    'errors' => $validator->errors()
                ], 422);
            }

            $user = Auth::user();
            $productVariant = ProductVariant::with('product')->find($request->product_variant_id);

            // Kiểm tra tồn kho
            if ($productVariant->quantity < $request->quantity) {
                return response()->json([
                    'success' => false,
                    'message' => 'Sản phẩm không đủ số lượng trong kho',
                    'data' => [
                        'available_quantity' => $productVariant->quantity
                    ]
                ], 400);
            }

            // Kiểm tra sản phẩm đã có trong giỏ hàng chưa
            $existingCart = Cart::where('user_id', $user->id)
                ->where('product_variant_id', $request->product_variant_id)
                ->first();

            if ($existingCart) {
                // Cập nhật số lượng
                $newQuantity = $existingCart->quantity + $request->quantity;
                
                // Kiểm tra tồn kho với số lượng mới
                if ($productVariant->quantity < $newQuantity) {
                    return response()->json([
                        'success' => false,
                        'message' => 'Vượt quá số lượng tồn kho',
                        'data' => [
                            'available_quantity' => $productVariant->quantity,
                            'current_in_cart' => $existingCart->quantity
                        ]
                    ], 400);
                }

                $existingCart->quantity = $newQuantity;
                $existingCart->save();

                return response()->json([
                    'success' => true,
                    'message' => 'Đã cập nhật số lượng trong giỏ hàng',
                    'data' => $existingCart
                ], 200);
            }

            // Thêm mới vào giỏ hàng
            $cart = Cart::create([
                'user_id' => $user->id,
                'product_variant_id' => $request->product_variant_id,
                'quantity' => $request->quantity,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Thêm vào giỏ hàng thành công',
                'data' => $cart
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Lỗi khi thêm vào giỏ hàng',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Cập nhật số lượng sản phẩm trong giỏ hàng
     */
    public function update(Request $request, $id)
    {
        try {
            $validator = Validator::make($request->all(), [
                'quantity' => 'required|integer|min:1',
            ], [
                'quantity.required' => 'Vui lòng nhập số lượng',
                'quantity.integer' => 'Số lượng phải là số nguyên',
                'quantity.min' => 'Số lượng phải lớn hơn 0',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation error',
                    'errors' => $validator->errors()
                ], 422);
            }

            $user = Auth::user();
            $cart = Cart::where('id', $id)
                ->where('user_id', $user->id)
                ->first();

            if (!$cart) {
                return response()->json([
                    'success' => false,
                    'message' => 'Không tìm thấy sản phẩm trong giỏ hàng'
                ], 404);
            }

            // Kiểm tra tồn kho
            $productVariant = ProductVariant::find($cart->product_variant_id);
            if ($productVariant->quantity < $request->quantity) {
                return response()->json([
                    'success' => false,
                    'message' => 'Sản phẩm không đủ số lượng trong kho',
                    'data' => [
                        'available_quantity' => $productVariant->quantity
                    ]
                ], 400);
            }

            $cart->quantity = $request->quantity;
            $cart->save();

            return response()->json([
                'success' => true,
                'message' => 'Cập nhật giỏ hàng thành công',
                'data' => $cart
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Lỗi khi cập nhật giỏ hàng',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Xóa sản phẩm khỏi giỏ hàng
     */
    public function destroy($id)
    {
        try {
            $user = Auth::user();
            $cart = Cart::where('id', $id)
                ->where('user_id', $user->id)
                ->first();

            if (!$cart) {
                return response()->json([
                    'success' => false,
                    'message' => 'Không tìm thấy sản phẩm trong giỏ hàng'
                ], 404);
            }

            $cart->delete();

            return response()->json([
                'success' => true,
                'message' => 'Xóa sản phẩm khỏi giỏ hàng thành công'
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Lỗi khi xóa sản phẩm khỏi giỏ hàng',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Xóa toàn bộ giỏ hàng
     */
    public function clear()
    {
        try {
            $user = Auth::user();
            Cart::where('user_id', $user->id)->delete();

            return response()->json([
                'success' => true,
                'message' => 'Đã xóa toàn bộ giỏ hàng'
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Lỗi khi xóa giỏ hàng',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Đếm số lượng sản phẩm trong giỏ hàng
     */
    public function count()
    {
        try {
            $user = Auth::user();
            $count = Cart::where('user_id', $user->id)->count();

            return response()->json([
                'success' => true,
                'message' => 'Lấy số lượng giỏ hàng thành công',
                'data' => [
                    'count' => $count
                ]
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Lỗi khi đếm giỏ hàng',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
