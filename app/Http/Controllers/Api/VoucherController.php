<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Voucher;
use Illuminate\Support\Facades\Validator;

class VoucherController extends Controller
{
    /**
     * Lấy danh sách voucher có sẵn (public)
     */
    public function index()
    {
        try {
            $vouchers = Voucher::available()
                ->orderBy('discount_percent', 'desc')
                ->get();

            return response()->json([
                'success' => true,
                'message' => 'Lấy danh sách voucher thành công',
                'data' => $vouchers
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Lỗi khi lấy danh sách voucher',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Kiểm tra voucher theo mã code
     */
    public function checkVoucher(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'code' => 'required|string',
                'order_total' => 'required|numeric|min:0',
            ], [
                'code.required' => 'Vui lòng nhập mã voucher',
                'order_total.required' => 'Vui lòng nhập tổng đơn hàng',
                'order_total.numeric' => 'Tổng đơn hàng phải là số',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation error',
                    'errors' => $validator->errors()
                ], 422);
            }

            $voucher = Voucher::where('code', strtoupper($request->code))->first();

            if (!$voucher) {
                return response()->json([
                    'success' => false,
                    'message' => 'Mã voucher không tồn tại'
                ], 404);
            }

            // Kiểm tra voucher có còn hiệu lực không
            if (!$voucher->isValid()) {
                $reason = 'Mã voucher không còn hiệu lực';
                
                if (!$voucher->is_active) {
                    $reason = 'Mã voucher đã bị vô hiệu hóa';
                } elseif ($voucher->used_count >= $voucher->quantity) {
                    $reason = 'Mã voucher đã hết lượt sử dụng';
                } elseif ($voucher->is_expired) {
                    $reason = 'Mã voucher đã hết hạn';
                } elseif ($voucher->start_date && now()->lt($voucher->start_date)) {
                    $reason = 'Mã voucher chưa đến ngày áp dụng';
                }

                return response()->json([
                    'success' => false,
                    'message' => $reason,
                    'data' => [
                        'voucher' => $voucher,
                        'status' => $voucher->status
                    ]
                ], 400);
            }

            // Kiểm tra tổng đơn hàng tối thiểu
            if (!$voucher->canApply($request->order_total)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Đơn hàng chưa đạt giá trị tối thiểu để áp dụng voucher',
                    'data' => [
                        'min_total' => $voucher->min_total,
                        'current_total' => $request->order_total,
                        'required_more' => $voucher->min_total - $request->order_total
                    ]
                ], 400);
            }

            // Tính số tiền được giảm
            $discount = $voucher->calculateDiscount($request->order_total);
            $finalTotal = $request->order_total - $discount;

            return response()->json([
                'success' => true,
                'message' => 'Áp dụng voucher thành công',
                'data' => [
                    'voucher' => [
                        'id' => $voucher->id,
                        'code' => $voucher->code,
                        'discount_percent' => $voucher->discount_percent,
                        'max_discount_amount' => $voucher->max_discount_amount,
                        'min_total' => $voucher->min_total,
                        'remaining_quantity' => $voucher->remaining_quantity,
                    ],
                    'order_total' => (float) $request->order_total,
                    'discount_amount' => (float) $discount,
                    'final_total' => (float) $finalTotal,
                ]
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Lỗi khi kiểm tra voucher',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Lấy voucher theo tổng đơn hàng (gợi ý voucher phù hợp)
     */
    public function getAvailableVouchers(Request $request)
    {
        try {
            $orderTotal = $request->input('order_total', 0);

            // Lấy các voucher có thể áp dụng
            $availableVouchers = Voucher::available()
                ->where('min_total', '<=', $orderTotal)
                ->orderBy('discount_percent', 'desc')
                ->get()
                ->map(function ($voucher) use ($orderTotal) {
                    return [
                        'id' => $voucher->id,
                        'code' => $voucher->code,
                        'discount_percent' => $voucher->discount_percent,
                        'min_total' => $voucher->min_total,
                        'max_discount_amount' => $voucher->max_discount_amount,
                        'start_date' => $voucher->start_date,
                        'end_date' => $voucher->end_date,
                        'remaining_quantity' => $voucher->remaining_quantity,
                        'discount_amount' => $voucher->calculateDiscount($orderTotal),
                        'can_apply' => true,
                    ];
                });

            // Lấy các voucher chưa đủ điều kiện (để khuyến khích mua thêm)
            $upcomingVouchers = Voucher::available()
                ->where('min_total', '>', $orderTotal)
                ->orderBy('min_total', 'asc')
                ->limit(5)
                ->get()
                ->map(function ($voucher) use ($orderTotal) {
                    return [
                        'id' => $voucher->id,
                        'code' => $voucher->code,
                        'discount_percent' => $voucher->discount_percent,
                        'min_total' => $voucher->min_total,
                        'max_discount_amount' => $voucher->max_discount_amount,
                        'start_date' => $voucher->start_date,
                        'end_date' => $voucher->end_date,
                        'remaining_quantity' => $voucher->remaining_quantity,
                        'required_more' => $voucher->min_total - $orderTotal,
                        'can_apply' => false,
                    ];
                });

            return response()->json([
                'success' => true,
                'message' => 'Lấy danh sách voucher thành công',
                'data' => [
                    'available' => $availableVouchers,
                    'upcoming' => $upcomingVouchers,
                    'order_total' => (float) $orderTotal,
                ]
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Lỗi khi lấy danh sách voucher',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Lấy chi tiết voucher
     */
    

    /**
     * Admin: Tạo voucher mới
     */
    public function store(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'code' => 'required|string|max:255|unique:vouchers,code',
                'discount_percent' => 'required|integer|min:1|max:100',
                'quantity' => 'required|integer|min:1',
                'min_total' => 'nullable|integer|min:0',
                'start_date' => 'nullable|date',
                'end_date' => 'nullable|date|after_or_equal:start_date',
                'max_discount_amount' => 'nullable|integer|min:0',
                'is_active' => 'nullable|boolean',
            ], [
                'code.required' => 'Vui lòng nhập mã voucher',
                'code.unique' => 'Mã voucher đã tồn tại',
                'discount_percent.required' => 'Vui lòng nhập phần trăm giảm giá',
                'discount_percent.min' => 'Phần trăm giảm giá phải từ 1-100',
                'discount_percent.max' => 'Phần trăm giảm giá phải từ 1-100',
                'quantity.required' => 'Vui lòng nhập số lượng',
                'end_date.after_or_equal' => 'Ngày kết thúc phải sau hoặc bằng ngày bắt đầu',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation error',
                    'errors' => $validator->errors()
                ], 422);
            }

            $voucher = Voucher::create([
                'code' => strtoupper($request->code),
                'discount_percent' => $request->discount_percent,
                'quantity' => $request->quantity,
                'min_total' => $request->min_total ?? 0,
                'start_date' => $request->start_date,
                'end_date' => $request->end_date,
                'max_discount_amount' => $request->max_discount_amount,
                'is_active' => $request->is_active ?? true,
                'used_count' => 0,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Tạo voucher thành công',
                'data' => $voucher
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Lỗi khi tạo voucher',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Admin: Cập nhật voucher
     */
    public function update(Request $request, $id)
    {
        try {
            $voucher = Voucher::find($id);

            if (!$voucher) {
                return response()->json([
                    'success' => false,
                    'message' => 'Không tìm thấy voucher'
                ], 404);
            }

            $validator = Validator::make($request->all(), [
                'code' => 'sometimes|required|string|max:255|unique:vouchers,code,' . $id,
                'discount_percent' => 'sometimes|required|integer|min:1|max:100',
                'quantity' => 'sometimes|required|integer|min:' . $voucher->used_count,
                'min_total' => 'nullable|integer|min:0',
                'start_date' => 'nullable|date',
                'end_date' => 'nullable|date|after_or_equal:start_date',
                'max_discount_amount' => 'nullable|integer|min:0',
                'is_active' => 'nullable|boolean',
            ], [
                'code.unique' => 'Mã voucher đã tồn tại',
                'discount_percent.min' => 'Phần trăm giảm giá phải từ 1-100',
                'discount_percent.max' => 'Phần trăm giảm giá phải từ 1-100',
                'quantity.min' => 'Số lượng không được nhỏ hơn số lượng đã sử dụng (' . $voucher->used_count . ')',
                'end_date.after_or_equal' => 'Ngày kết thúc phải sau hoặc bằng ngày bắt đầu',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation error',
                    'errors' => $validator->errors()
                ], 422);
            }

            // Update voucher
            if ($request->has('code')) {
                $voucher->code = strtoupper($request->code);
            }
            if ($request->has('discount_percent')) {
                $voucher->discount_percent = $request->discount_percent;
            }
            if ($request->has('quantity')) {
                $voucher->quantity = $request->quantity;
            }
            if ($request->has('min_total')) {
                $voucher->min_total = $request->min_total;
            }
            if ($request->has('start_date')) {
                $voucher->start_date = $request->start_date;
            }
            if ($request->has('end_date')) {
                $voucher->end_date = $request->end_date;
            }
            if ($request->has('max_discount_amount')) {
                $voucher->max_discount_amount = $request->max_discount_amount;
            }
            if ($request->has('is_active')) {
                $voucher->is_active = $request->is_active;
            }

            $voucher->save();

            return response()->json([
                'success' => true,
                'message' => 'Cập nhật voucher thành công',
                'data' => $voucher
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Lỗi khi cập nhật voucher',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Admin: Xóa voucher
     */
    public function destroy($id)
    {
        try {
            $voucher = Voucher::find($id);

            if (!$voucher) {
                return response()->json([
                    'success' => false,
                    'message' => 'Không tìm thấy voucher'
                ], 404);
            }

            // Kiểm tra xem voucher đã được sử dụng chưa
            if ($voucher->used_count > 0) {
                return response()->json([
                    'success' => false,
                    'message' => 'Không thể xóa voucher đã được sử dụng. Vui lòng vô hiệu hóa thay vì xóa.',
                    'data' => [
                        'used_count' => $voucher->used_count
                    ]
                ], 400);
            }

            $voucher->delete();

            return response()->json([
                'success' => true,
                'message' => 'Xóa voucher thành công'
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Lỗi khi xóa voucher',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Admin: Kích hoạt/Vô hiệu hóa voucher
     */
    public function toggleStatus($id)
    {
        try {
            $voucher = Voucher::find($id);

            if (!$voucher) {
                return response()->json([
                    'success' => false,
                    'message' => 'Không tìm thấy voucher'
                ], 404);
            }

            $voucher->is_active = !$voucher->is_active;
            $voucher->save();

            $status = $voucher->is_active ? 'kích hoạt' : 'vô hiệu hóa';

            return response()->json([
                'success' => true,
                'message' => "Đã {$status} voucher thành công",
                'data' => [
                    'is_active' => $voucher->is_active
                ]
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Lỗi khi thay đổi trạng thái voucher',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Admin: Lấy tất cả voucher (bao gồm cả inactive)
     */
    public function adminIndex()
    {
        try {
            $vouchers = Voucher::orderBy('created_at', 'desc')
                ->get()
                ->map(function ($voucher) {
                    return [
                        'id' => $voucher->id,
                        'code' => $voucher->code,
                        'discount_percent' => $voucher->discount_percent,
                        'quantity' => $voucher->quantity,
                        'used_count' => $voucher->used_count,
                        'remaining_quantity' => $voucher->remaining_quantity,
                        'min_total' => $voucher->min_total,
                        'max_discount_amount' => $voucher->max_discount_amount,
                        'start_date' => $voucher->start_date,
                        'end_date' => $voucher->end_date,
                        'is_active' => $voucher->is_active,
                        'status' => $voucher->status,
                        'created_at' => $voucher->created_at,
                        'updated_at' => $voucher->updated_at,
                    ];
                });

            return response()->json([
                'success' => true,
                'message' => 'Lấy danh sách voucher thành công',
                'data' => $vouchers
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Lỗi khi lấy danh sách voucher',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
