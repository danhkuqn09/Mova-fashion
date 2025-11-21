<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Review;
use App\Models\OrderItem;
use App\Models\Order;
use App\Models\Product;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;

class ReviewController extends Controller
{
    /**
     * Public: Lấy danh sách review của sản phẩm
     */
    public function index(Request $request)
    {
        try {
            $productId = $request->input('product_id');
            $perPage = $request->input('per_page', 10);

            $query = Review::with(['user', 'orderItem.productVariant.product'])
                ->whereHas('orderItem.productVariant.product', function ($q) use ($productId) {
                    if ($productId) {
                        $q->where('id', $productId);
                    }
                })
                ->orderBy('created_at', 'desc');

            $reviews = $query->paginate($perPage);

            // Format data
            $formattedReviews = $reviews->map(function ($review) {
                return [
                    'id' => $review->id,
                    'user' => [
                        'id' => $review->user->id,
                        'name' => $review->user->name,
                        'avatar' => $review->user->avatar ?? null,
                    ],
                    'product' => [
                        'id' => $review->orderItem->productVariant->product->id,
                        'name' => $review->orderItem->productVariant->product->name,
                    ],
                    'rating' => $review->rating,
                    'content' => $review->content,
                    'image' => $review->image ? Storage::url($review->image) : null,
                    'created_at' => $review->created_at->format('d/m/Y H:i'),
                    'created_at_human' => $review->created_at->diffForHumans(),
                ];
            });

            return response()->json([
                'success' => true,
                'message' => 'Lấy danh sách đánh giá thành công',
                'data' => [
                    'reviews' => $formattedReviews,
                    'pagination' => [
                        'total' => $reviews->total(),
                        'per_page' => $reviews->perPage(),
                        'current_page' => $reviews->currentPage(),
                        'last_page' => $reviews->lastPage(),
                    ]
                ]
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Lỗi khi lấy danh sách đánh giá',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * User: Lấy danh sách review của mình
     */
    public function myReviews()
    {
        try {
            $user = Auth::user();

            $reviews = Review::with(['orderItem.productVariant.product', 'orderItem.productVariant.color'])
                ->where('user_id', $user->id)
                ->orderBy('created_at', 'desc')
                ->get();

            $formattedReviews = $reviews->map(function ($review) {
                return [
                    'id' => $review->id,
                    'product' => [
                        'id' => $review->orderItem->productVariant->product->id,
                        'name' => $review->orderItem->productVariant->product->name,
                        'image' => $review->orderItem->productVariant->product->image ? Storage::url($review->orderItem->productVariant->product->image) : null,
                    ],
                    'variant' => [
                        'color' => $review->orderItem->productVariant->color->name ?? null,
                    ],
                    'rating' => $review->rating,
                    'content' => $review->content,
                    'image' => $review->image ? Storage::url($review->image) : null,
                    'created_at' => $review->created_at->format('d/m/Y H:i'),
                    'can_delete' => true, // Chỉ cho phép xóa, không cho sửa
                ];
            });

            return response()->json([
                'success' => true,
                'message' => 'Lấy danh sách đánh giá của bạn thành công',
                'data' => $formattedReviews
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Lỗi khi lấy danh sách đánh giá',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * User: Tạo review mới
     */
    public function store(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'order_item_id' => 'required|exists:order_items,id',
                'rating' => 'required|integer|min:1|max:5',
                'content' => 'required|string|min:10|max:1000',
                'image' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
            ], [
                'order_item_id.required' => 'Vui lòng chọn sản phẩm',
                'order_item_id.exists' => 'Sản phẩm không tồn tại',
                'rating.required' => 'Vui lòng chọn số sao',
                'rating.integer' => 'Số sao phải là số nguyên',
                'rating.min' => 'Số sao tối thiểu là 1',
                'rating.max' => 'Số sao tối đa là 5',
                'content.required' => 'Vui lòng nhập nội dung đánh giá',
                'content.min' => 'Nội dung đánh giá phải có ít nhất 10 ký tự',
                'content.max' => 'Nội dung đánh giá không được quá 1000 ký tự',
                'image.image' => 'File phải là hình ảnh',
                'image.mimes' => 'Hình ảnh phải có định dạng jpeg, png, jpg',
                'image.max' => 'Kích thước hình ảnh không được quá 2MB',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation error',
                    'errors' => $validator->errors()
                ], 422);
            }

            $user = Auth::user();

            // Kiểm tra order item có thuộc về user không
            $orderItem = OrderItem::with('order')->find($request->order_item_id);

            if ($orderItem->order->user_id !== $user->id) {
                return response()->json([
                    'success' => false,
                    'message' => 'Bạn không có quyền đánh giá sản phẩm này'
                ], 403);
            }

            // Kiểm tra đơn hàng đã hoàn thành chưa
            if ($orderItem->order->status !== 'completed') {
                return response()->json([
                    'success' => false,
                    'message' => 'Chỉ có thể đánh giá sản phẩm từ đơn hàng đã hoàn thành'
                ], 400);
            }

            // Kiểm tra đã review chưa
            $existingReview = Review::where('order_item_id', $request->order_item_id)->first();
            if ($existingReview) {
                return response()->json([
                    'success' => false,
                    'message' => 'Bạn đã đánh giá sản phẩm này rồi'
                ], 400);
            }

            // Upload image nếu có
            $imagePath = null;
            if ($request->hasFile('image')) {
                $imagePath = $request->file('image')->store('reviews', 'public');
            }

            // Tạo review
            $review = Review::create([
                'user_id' => $user->id,
                'order_item_id' => $request->order_item_id,
                'rating' => $request->rating,
                'content' => $request->content,
                'image' => $imagePath,
            ]);

            // Load relationships
            $review->load(['user', 'orderItem.productVariant.product']);

            return response()->json([
                'success' => true,
                'message' => 'Đánh giá sản phẩm thành công',
                'data' => [
                    'id' => $review->id,
                    'rating' => $review->rating,
                    'content' => $review->content,
                    'image' => $review->image ? Storage::url($review->image) : null,
                    'created_at' => $review->created_at->format('d/m/Y H:i'),
                ]
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Lỗi khi tạo đánh giá',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * User: Xem chi tiết review của mình (chỉ xem, không sửa)
     */
    public function show($id)
    {
        try {
            $user = Auth::user();

            $review = Review::with(['orderItem.productVariant.product', 'orderItem.productVariant.color'])
                ->where('user_id', $user->id)
                ->find($id);

            if (!$review) {
                return response()->json([
                    'success' => false,
                    'message' => 'Không tìm thấy đánh giá'
                ], 404);
            }

            return response()->json([
                'success' => true,
                'message' => 'Lấy chi tiết đánh giá thành công',
                'data' => [
                    'id' => $review->id,
                    'product' => [
                        'id' => $review->orderItem->productVariant->product->id,
                        'name' => $review->orderItem->productVariant->product->name,
                        'image' => $review->orderItem->productVariant->product->image ? Storage::url($review->orderItem->productVariant->product->image) : null,
                    ],
                    'rating' => $review->rating,
                    'content' => $review->content,
                    'image' => $review->image ? Storage::url($review->image) : null,
                    'created_at' => $review->created_at->format('d/m/Y H:i'),
                    'can_delete' => true,
                ]
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Lỗi khi lấy chi tiết đánh giá',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * User: Xóa review của mình
     */
    public function destroy($id)
    {
        try {
            $user = Auth::user();

            $review = Review::where('user_id', $user->id)->find($id);

            if (!$review) {
                return response()->json([
                    'success' => false,
                    'message' => 'Không tìm thấy đánh giá'
                ], 404);
            }

            // Xóa ảnh nếu có
            if ($review->image) {
                Storage::disk('public')->delete($review->image);
            }

            $review->delete();

            return response()->json([
                'success' => true,
                'message' => 'Xóa đánh giá thành công'
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Lỗi khi xóa đánh giá',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Admin: Xem tất cả reviews
     */
    public function adminIndex(Request $request)
    {
        try {
            $search = $request->input('search');
            $rating = $request->input('rating');
            $perPage = $request->input('per_page', 15);

            $query = Review::with(['user', 'orderItem.productVariant.product'])
                ->orderBy('created_at', 'desc');

            // Search by product name or user name
            if ($search) {
                $query->where(function ($q) use ($search) {
                    $q->whereHas('user', function ($q2) use ($search) {
                        $q2->where('name', 'like', "%{$search}%");
                    })->orWhereHas('orderItem.productVariant.product', function ($q2) use ($search) {
                        $q2->where('name', 'like', "%{$search}%");
                    });
                });
            }

            // Filter by rating
            if ($rating) {
                $query->where('rating', $rating);
            }

            $reviews = $query->paginate($perPage);

            $formattedReviews = $reviews->map(function ($review) {
                return [
                    'id' => $review->id,
                    'user' => [
                        'id' => $review->user->id,
                        'name' => $review->user->name,
                        'email' => $review->user->email,
                    ],
                    'product' => [
                        'id' => $review->orderItem->productVariant->product->id,
                        'name' => $review->orderItem->productVariant->product->name,
                        'image' => $review->orderItem->productVariant->product->image ? Storage::url($review->orderItem->productVariant->product->image) : null,
                    ],
                    'order_id' => $review->orderItem->order_id,
                    'rating' => $review->rating,
                    'content' => $review->content,
                    'image' => $review->image ? Storage::url($review->image) : null,
                    'created_at' => $review->created_at->format('d/m/Y H:i'),
                ];
            });

            return response()->json([
                'success' => true,
                'message' => 'Lấy danh sách đánh giá thành công',
                'data' => [
                    'reviews' => $formattedReviews,
                    'pagination' => [
                        'total' => $reviews->total(),
                        'per_page' => $reviews->perPage(),
                        'current_page' => $reviews->currentPage(),
                        'last_page' => $reviews->lastPage(),
                    ]
                ]
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Lỗi khi lấy danh sách đánh giá',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Admin: Thống kê reviews
     */
    public function adminStatistics()
    {
        try {
            $totalReviews = Review::count();
            $averageRating = Review::avg('rating');

            $ratingDistribution = [];
            for ($i = 1; $i <= 5; $i++) {
                $count = Review::where('rating', $i)->count();
                $percentage = $totalReviews > 0 ? round(($count / $totalReviews) * 100, 2) : 0;
                $ratingDistribution[] = [
                    'rating' => $i,
                    'count' => $count,
                    'percentage' => $percentage,
                ];
            }

            return response()->json([
                'success' => true,
                'message' => 'Lấy thống kê đánh giá thành công',
                'data' => [
                    'total_reviews' => $totalReviews,
                    'average_rating' => round($averageRating, 2),
                    'rating_distribution' => $ratingDistribution,
                ]
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Lỗi khi lấy thống kê',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
