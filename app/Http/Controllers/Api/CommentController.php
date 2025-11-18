<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Comment;
use App\Models\Product;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Auth;

class CommentController extends Controller
{
    /**
     * Lấy danh sách bình luận của sản phẩm (Public)
     */
    public function index(Request $request, $productId)
    {
        try {
            $product = Product::find($productId);
            
            if (!$product) {
                return response()->json([
                    'success' => false,
                    'message' => 'Không tìm thấy sản phẩm'
                ], 404);
            }

            $perPage = $request->input('per_page', 10);
            $sortBy = $request->input('sort_by', 'newest'); // newest, oldest

            $query = Comment::with(['user'])
                ->where('product_id', $productId);

            // Sort
            if ($sortBy === 'oldest') {
                $query->orderBy('created_at', 'asc');
            } else {
                $query->orderBy('created_at', 'desc');
            }

            $comments = $query->paginate($perPage);

            $formattedComments = $comments->map(function ($comment) {
                return [
                    'id' => $comment->id,
                    'user' => [
                        'id' => $comment->user->id,
                        'name' => $comment->user->name,
                    ],
                    'content' => $comment->content,
                    'image' => $comment->image ? Storage::url($comment->image) : null,
                    'created_at' => $comment->created_at->format('d/m/Y H:i'),
                    'is_owner' => Auth::check() && Auth::id() === $comment->user_id,
                ];
            });

            return response()->json([
                'success' => true,
                'message' => 'Lấy danh sách bình luận thành công',
                'data' => [
                    'comments' => $formattedComments,
                    'pagination' => [
                        'total' => $comments->total(),
                        'per_page' => $comments->perPage(),
                        'current_page' => $comments->currentPage(),
                        'last_page' => $comments->lastPage(),
                    ]
                ]
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Lỗi khi lấy danh sách bình luận',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Tạo bình luận mới (User)
     */
    public function store(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'product_id' => 'required|exists:products,id',
                'content' => 'required|string|max:1000',
                'image' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
            ], [
                'product_id.required' => 'Vui lòng chọn sản phẩm',
                'product_id.exists' => 'Sản phẩm không tồn tại',
                'content.required' => 'Vui lòng nhập nội dung bình luận',
                'content.max' => 'Nội dung bình luận không được quá 1000 ký tự',
                'image.image' => 'File phải là hình ảnh',
                'image.max' => 'Kích thước ảnh không được vượt quá 2MB',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation error',
                    'errors' => $validator->errors()
                ], 422);
            }

            // Upload image nếu có
            $imagePath = null;
            if ($request->hasFile('image')) {
                $imagePath = $request->file('image')->store('comments', 'public');
            }

            // Tạo bình luận
            $comment = Comment::create([
                'user_id' => Auth::id(),
                'product_id' => $request->product_id,
                'content' => $request->content,
                'image' => $imagePath,
            ]);

            // Load relationship
            $comment->load('user', 'product');

            return response()->json([
                'success' => true,
                'message' => 'Tạo bình luận thành công',
                'data' => [
                    'id' => $comment->id,
                    'user' => [
                        'id' => $comment->user->id,
                        'name' => $comment->user->name,
                    ],
                    'product' => [
                        'id' => $comment->product->id,
                        'name' => $comment->product->name,
                    ],
                    'content' => $comment->content,
                    'image' => $comment->image ? Storage::url($comment->image) : null,
                    'created_at' => $comment->created_at->format('d/m/Y H:i'),
                ]
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Lỗi khi tạo bình luận',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Cập nhật bình luận (User - Chỉ bình luận của mình)
     */
    public function update(Request $request, $id)
    {
        try {
            $comment = Comment::find($id);

            if (!$comment) {
                return response()->json([
                    'success' => false,
                    'message' => 'Không tìm thấy bình luận'
                ], 404);
            }

            // Kiểm tra quyền sở hữu
            if ($comment->user_id !== Auth::id()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Bạn không có quyền sửa bình luận này'
                ], 403);
            }

            $validator = Validator::make($request->all(), [
                'content' => 'required|string|max:1000',
                'image' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
            ], [
                'content.required' => 'Vui lòng nhập nội dung bình luận',
                'content.max' => 'Nội dung bình luận không được quá 1000 ký tự',
                'image.image' => 'File phải là hình ảnh',
                'image.max' => 'Kích thước ảnh không được vượt quá 2MB',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation error',
                    'errors' => $validator->errors()
                ], 422);
            }

            // Upload image mới nếu có
            if ($request->hasFile('image')) {
                // Xóa ảnh cũ
                if ($comment->image) {
                    Storage::disk('public')->delete($comment->image);
                }
                $comment->image = $request->file('image')->store('comments', 'public');
            }

            // Cập nhật content
            $comment->content = $request->content;
            $comment->save();

            return response()->json([
                'success' => true,
                'message' => 'Cập nhật bình luận thành công',
                'data' => [
                    'id' => $comment->id,
                    'content' => $comment->content,
                    'image' => $comment->image ? Storage::url($comment->image) : null,
                    'updated_at' => $comment->updated_at->format('d/m/Y H:i'),
                ]
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Lỗi khi cập nhật bình luận',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Xóa bình luận (User - Chỉ bình luận của mình)
     */
    public function destroy($id)
    {
        try {
            $comment = Comment::find($id);

            if (!$comment) {
                return response()->json([
                    'success' => false,
                    'message' => 'Không tìm thấy bình luận'
                ], 404);
            }

            // Kiểm tra quyền sở hữu
            if ($comment->user_id !== Auth::id()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Bạn không có quyền xóa bình luận này'
                ], 403);
            }

            // Xóa ảnh nếu có
            if ($comment->image) {
                Storage::disk('public')->delete($comment->image);
            }

            // Xóa bình luận
            $comment->delete();

            return response()->json([
                'success' => true,
                'message' => 'Xóa bình luận thành công'
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Lỗi khi xóa bình luận',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Lấy danh sách bình luận của user (User)
     */
    public function myComments(Request $request)
    {
        try {
            $perPage = $request->input('per_page', 10);
            
            $comments = Comment::with(['product'])
                ->where('user_id', Auth::id())
                ->orderBy('created_at', 'desc')
                ->paginate($perPage);

            $formattedComments = $comments->map(function ($comment) {
                return [
                    'id' => $comment->id,
                    'product' => [
                        'id' => $comment->product->id,
                        'name' => $comment->product->name,
                        'image' => $comment->product->image ? Storage::url($comment->product->image) : null,
                    ],
                    'content' => $comment->content,
                    'image' => $comment->image ? Storage::url($comment->image) : null,
                    'created_at' => $comment->created_at->format('d/m/Y H:i'),
                ];
            });

            return response()->json([
                'success' => true,
                'message' => 'Lấy danh sách bình luận của tôi thành công',
                'data' => [
                    'comments' => $formattedComments,
                    'pagination' => [
                        'total' => $comments->total(),
                        'per_page' => $comments->perPage(),
                        'current_page' => $comments->currentPage(),
                        'last_page' => $comments->lastPage(),
                    ]
                ]
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Lỗi khi lấy danh sách bình luận',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Admin: Lấy tất cả bình luận
     */
    public function adminIndex(Request $request)
    {
        try {
            $perPage = $request->input('per_page', 20);
            $search = $request->input('search');
            $productId = $request->input('product_id');

            $query = Comment::with(['user', 'product']);

            // Search
            if ($search) {
                $query->where(function($q) use ($search) {
                    $q->where('content', 'like', "%{$search}%")
                      ->orWhereHas('user', function($q2) use ($search) {
                          $q2->where('name', 'like', "%{$search}%");
                      })
                      ->orWhereHas('product', function($q3) use ($search) {
                          $q3->where('name', 'like', "%{$search}%");
                      });
                });
            }

            // Filter by product
            if ($productId) {
                $query->where('product_id', $productId);
            }

            $comments = $query->orderBy('created_at', 'desc')->paginate($perPage);

            $formattedComments = $comments->map(function ($comment) {
                return [
                    'id' => $comment->id,
                    'user' => [
                        'id' => $comment->user->id,
                        'name' => $comment->user->name,
                    ],
                    'product' => [
                        'id' => $comment->product->id,
                        'name' => $comment->product->name,
                    ],
                    'content' => $comment->content,
                    'image' => $comment->image ? Storage::url($comment->image) : null,
                    'created_at' => $comment->created_at->format('d/m/Y H:i'),
                ];
            });

            return response()->json([
                'success' => true,
                'message' => 'Lấy danh sách bình luận thành công',
                'data' => [
                    'comments' => $formattedComments,
                    'pagination' => [
                        'total' => $comments->total(),
                        'per_page' => $comments->perPage(),
                        'current_page' => $comments->currentPage(),
                        'last_page' => $comments->lastPage(),
                    ]
                ]
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Lỗi khi lấy danh sách bình luận',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Admin: Xóa bình luận bất kỳ
     */
    public function adminDestroy($id)
    {
        try {
            $comment = Comment::find($id);

            if (!$comment) {
                return response()->json([
                    'success' => false,
                    'message' => 'Không tìm thấy bình luận'
                ], 404);
            }

            // Xóa ảnh nếu có
            if ($comment->image) {
                Storage::disk('public')->delete($comment->image);
            }

            // Xóa bình luận
            $comment->delete();

            return response()->json([
                'success' => true,
                'message' => 'Xóa bình luận thành công'
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Lỗi khi xóa bình luận',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
