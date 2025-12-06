<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\News;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;

class NewController extends Controller
{
    /**
     * Lấy danh sách bài viết (Public)
     */
    public function index(Request $request)
    {
        try {
            $perPage = $request->input('per_page', 10);
            $search = $request->input('search');

            $query = News::with('user')
                ->where('status', 'published')
                ->orderBy('created_at', 'desc');

            if ($search) {
                $query->where(function ($q) use ($search) {
                    $q->where('title', 'like', "%{$search}%")
                      ->orWhere('summary', 'like', "%{$search}%");
                });
            }

            $news = $query->paginate($perPage);

            $formattedNews = $news->map(function ($item) {
                return [
                    'id' => $item->id,
                    'title' => $item->title,
                    'thumbnail' => $item->thumbnail ? Storage::url($item->thumbnail) : null,
                    'summary' => $item->summary,
                    'author' => [
                        'id' => $item->user->id,
                        'name' => $item->user->name,
                    ],
                    'view_count' => $item->view_count,
                    'created_at' => $item->created_at->format('d/m/Y H:i'),
                    'created_at_human' => $item->created_at->diffForHumans(),
                ];
            });

            return response()->json([
                'success' => true,
                'message' => 'Lấy danh sách bài viết thành công',
                'data' => [
                    'news' => $formattedNews,
                    'pagination' => [
                        'total' => $news->total(),
                        'per_page' => $news->perPage(),
                        'current_page' => $news->currentPage(),
                        'last_page' => $news->lastPage(),
                    ]
                ]
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Lỗi khi lấy danh sách bài viết',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Xem chi tiết bài viết (Public)
     */
    public function show($id)
    {
        try {
            $news = News::with('user')
                ->where('status', 'published')
                ->find($id);

            if (!$news) {
                return response()->json([
                    'success' => false,
                    'message' => 'Không tìm thấy bài viết'
                ], 404);
            }

            // Tăng view count
            $news->increment('view_count');

            return response()->json([
                'success' => true,
                'message' => 'Lấy chi tiết bài viết thành công',
                'data' => [
                    'id' => $news->id,
                    'title' => $news->title,
                    'thumbnail' => $news->thumbnail ? Storage::url($news->thumbnail) : null,
                    'summary' => $news->summary,
                    'content' => $news->content,
                    'author' => [
                        'id' => $news->user->id,
                        'name' => $news->user->name,
                    ],
                    'view_count' => $news->view_count,
                    'created_at' => $news->created_at->format('d/m/Y H:i'),
                    'updated_at' => $news->updated_at->format('d/m/Y H:i'),
                ]
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Lỗi khi lấy chi tiết bài viết',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * User: Lấy danh sách bài viết của mình
     */
    public function myNews(Request $request)
    {
        try {
            $user = Auth::user();
            $perPage = $request->input('per_page', 15);

            $news = News::where('user_id', $user->id)
                ->orderBy('created_at', 'desc')
                ->paginate($perPage);

            $formattedNews = $news->map(function ($item) {
                return [
                    'id' => $item->id,
                    'title' => $item->title,
                    'thumbnail' => $item->thumbnail ? Storage::url($item->thumbnail) : null,
                    'summary' => $item->summary,
                    'status' => $item->status,
                    'status_text' => $this->getStatusText($item->status),
                    'view_count' => $item->view_count,
                    'created_at' => $item->created_at->format('d/m/Y H:i'),
                ];
            });

            return response()->json([
                'success' => true,
                'message' => 'Lấy danh sách bài viết của bạn thành công',
                'data' => [
                    'news' => $formattedNews,
                    'pagination' => [
                        'total' => $news->total(),
                        'per_page' => $news->perPage(),
                        'current_page' => $news->currentPage(),
                        'last_page' => $news->lastPage(),
                    ]
                ]
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Lỗi khi lấy danh sách bài viết',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * User: Tạo bài viết mới
     */
    public function store(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'title' => 'required|string|max:255',
                'thumbnail' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
                'summary' => 'required|string|max:500',
                'content' => 'required|string',
            ], [
                'title.required' => 'Vui lòng nhập tiêu đề',
                'title.max' => 'Tiêu đề không được quá 255 ký tự',
                'summary.required' => 'Vui lòng nhập tóm tắt',
                'summary.max' => 'Tóm tắt không được quá 500 ký tự',
                'content.required' => 'Vui lòng nhập nội dung bài viết',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation error',
                    'errors' => $validator->errors()
                ], 422);
            }

            $user = Auth::user();

            // Upload thumbnail
            $thumbnailPath = null;
            if ($request->hasFile('thumbnail')) {
                $thumbnailPath = $request->file('thumbnail')->store('news/thumbnails', 'public');
            }

            // Tạo news
            $news = News::create([
                'user_id' => $user->id,
                'title' => $request->title,
                'thumbnail' => $thumbnailPath,
                'summary' => $request->summary,
                'content' => $request->content,
                'status' => 'draft',
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Tạo bài viết thành công',
                'data' => [
                    'id' => $news->id,
                    'title' => $news->title,
                    'status' => $news->status,
                ]
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Lỗi khi tạo bài viết',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * User: Cập nhật bài viết của mình
     */
    public function update(Request $request, $id)
    {
        try {
            $validator = Validator::make($request->all(), [
                'title' => 'required|string|max:255',
                'thumbnail' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
                'summary' => 'required|string|max:500',
                'content' => 'required|string',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation error',
                    'errors' => $validator->errors()
                ], 422);
            }

            $user = Auth::user();
            $news = News::where('user_id', $user->id)->find($id);

            if (!$news) {
                return response()->json([
                    'success' => false,
                    'message' => 'Không tìm thấy bài viết'
                ], 404);
            }

            // Chỉ cho phép update nếu status là draft hoặc rejected
            if (!in_array($news->status, ['draft', 'rejected'])) {
                return response()->json([
                    'success' => false,
                    'message' => 'Chỉ có thể sửa bài viết đang ở trạng thái nháp hoặc bị từ chối'
                ], 400);
            }

            // Upload thumbnail mới nếu có
            if ($request->hasFile('thumbnail')) {
                // Xóa ảnh cũ
                if ($news->thumbnail) {
                    Storage::disk('public')->delete($news->thumbnail);
                }
                $news->thumbnail = $request->file('thumbnail')->store('news/thumbnails', 'public');
            }

            // Cập nhật news
            $news->title = $request->title;
            $news->summary = $request->summary;
            $news->content = $request->content;
            $news->status = 'draft'; // Reset về draft khi sửa
            $news->save();

            return response()->json([
                'success' => true,
                'message' => 'Cập nhật bài viết thành công',
                'data' => [
                    'id' => $news->id,
                    'title' => $news->title,
                ]
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Lỗi khi cập nhật bài viết',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * User: Xóa bài viết của mình
     */
    public function destroy($id)
    {
        try {
            $user = Auth::user();
            $news = News::where('user_id', $user->id)->find($id);

            if (!$news) {
                return response()->json([
                    'success' => false,
                    'message' => 'Không tìm thấy bài viết'
                ], 404);
            }

            // Chỉ cho phép xóa nếu là draft hoặc rejected
            if (!in_array($news->status, ['draft', 'rejected'])) {
                return response()->json([
                    'success' => false,
                    'message' => 'Chỉ có thể xóa bài viết đang ở trạng thái nháp hoặc bị từ chối'
                ], 400);
            }

            // Xóa thumbnail
            if ($news->thumbnail) {
                Storage::disk('public')->delete($news->thumbnail);
            }

            $news->delete();

            return response()->json([
                'success' => true,
                'message' => 'Xóa bài viết thành công'
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Lỗi khi xóa bài viết',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * User: Gửi bài viết để duyệt
     */
    public function submitForReview($id)
    {
        try {
            $user = Auth::user();
            $news = News::where('user_id', $user->id)->find($id);

            if (!$news) {
                return response()->json([
                    'success' => false,
                    'message' => 'Không tìm thấy bài viết'
                ], 404);
            }

            if (!in_array($news->status, ['draft', 'rejected'])) {
                return response()->json([
                    'success' => false,
                    'message' => 'Chỉ có thể gửi bài viết đang ở trạng thái nháp hoặc bị từ chối'
                ], 400);
            }

            $news->status = 'pending';
            $news->save();

            return response()->json([
                'success' => true,
                'message' => 'Gửi bài viết để duyệt thành công',
                'data' => [
                    'id' => $news->id,
                    'status' => $news->status,
                ]
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Lỗi khi gửi bài viết',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Admin: Lấy tất cả bài viết (không bao gồm draft)
     */
    public function adminIndex(Request $request)
    {
        try {
            $perPage = $request->input('per_page', 5);
            $status = $request->input('status');
            $search = $request->input('search');

            $query = News::with('user')
                ->whereIn('status', ['pending', 'published', 'rejected'])
                ->orderBy('created_at', 'desc');

            // Filter theo status cụ thể nếu có
            if ($status && in_array($status, ['pending', 'published', 'rejected'])) {
                $query->where('status', $status);
            }

            if ($search) {
                $query->where(function ($q) use ($search) {
                    $q->where('title', 'like', "%{$search}%")
                      ->orWhereHas('user', function ($q2) use ($search) {
                          $q2->where('name', 'like', "%{$search}%");
                      });
                });
            }

            $news = $query->paginate($perPage);

            $formattedNews = $news->map(function ($item) {
                return [
                    'id' => $item->id,
                    'title' => $item->title,
                    'thumbnail' => $item->thumbnail ? Storage::url($item->thumbnail) : null,
                    'summary' => $item->summary,
                    'author' => [
                        'id' => $item->user->id,
                        'name' => $item->user->name,
                        'email' => $item->user->email,
                    ],
                    'status' => $item->status,
                    'status_text' => $this->getStatusText($item->status),
                    'view_count' => $item->view_count,
                    'created_at' => $item->created_at->format('d/m/Y H:i'),
                ];
            });

            return response()->json([
                'success' => true,
                'message' => 'Lấy danh sách bài viết thành công',
                'data' => [
                    'news' => $formattedNews,
                    'pagination' => [
                        'total' => $news->total(),
                        'per_page' => $news->perPage(),
                        'current_page' => $news->currentPage(),
                        'last_page' => $news->lastPage(),
                    ],
                    'statistics' => [
                        'pending' => News::where('status', 'pending')->count(),
                        'published' => News::where('status', 'published')->count(),
                        'rejected' => News::where('status', 'rejected')->count(),
                    ]
                ]
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Lỗi khi lấy danh sách bài viết',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Admin: Duyệt bài viết
     */
    public function approve($id)
    {
        try {
            $news = News::find($id);

            if (!$news) {
                return response()->json([
                    'success' => false,
                    'message' => 'Không tìm thấy bài viết'
                ], 404);
            }

            if ($news->status !== 'pending') {
                return response()->json([
                    'success' => false,
                    'message' => 'Chỉ có thể duyệt bài viết đang chờ duyệt'
                ], 400);
            }

            $news->status = 'published';
            $news->save();

            return response()->json([
                'success' => true,
                'message' => 'Duyệt bài viết thành công',
                'data' => [
                    'id' => $news->id,
                    'status' => $news->status,
                ]
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Lỗi khi duyệt bài viết',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Admin: Từ chối bài viết
     */
    public function reject(Request $request, $id)
    {
        try {
            $news = News::find($id);

            if (!$news) {
                return response()->json([
                    'success' => false,
                    'message' => 'Không tìm thấy bài viết'
                ], 404);
            }

            if ($news->status !== 'pending') {
                return response()->json([
                    'success' => false,
                    'message' => 'Chỉ có thể từ chối bài viết đang chờ duyệt'
                ], 400);
            }

            $news->status = 'rejected';
            $news->save();

            return response()->json([
                'success' => true,
                'message' => 'Từ chối bài viết thành công',
                'data' => [
                    'id' => $news->id,
                    'status' => $news->status,
                ]
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Lỗi khi từ chối bài viết',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Admin: Xóa bài viết
     */
    public function adminDestroy($id)
    {
        try {
            $news = News::find($id);

            if (!$news) {
                return response()->json([
                    'success' => false,
                    'message' => 'Không tìm thấy bài viết'
                ], 404);
            }

            // Xóa thumbnail nếu có
            if ($news->thumbnail) {
                Storage::disk('public')->delete($news->thumbnail);
            }

            $news->delete();

            return response()->json([
                'success' => true,
                'message' => 'Xóa bài viết thành công'
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Lỗi khi xóa bài viết',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Helper: Lấy text status
     */
    private function getStatusText($status)
    {
        $statusTexts = [
            'draft' => 'Nháp',
            'pending' => 'Chờ duyệt',
            'published' => 'Đã xuất bản',
            'rejected' => 'Bị từ chối',
        ];

        return $statusTexts[$status] ?? $status;
    }
}
