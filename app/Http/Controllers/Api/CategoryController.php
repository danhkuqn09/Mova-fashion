<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Category;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;

class CategoryController extends Controller
{
    /**
     * Lấy danh sách danh mục (Public)
     */
    public function index(Request $request)
    {
        try {
            $perPage = $request->input('per_page', 20);
            $search = $request->input('search');

            $query = Category::withCount('products');

            // Search
            if ($search) {
                $query->where('name', 'like', "%{$search}%");
            }

            $query->orderBy('name', 'asc');

            if ($request->input('per_page') === 'all') {
                $categories = $query->get();
                $formattedCategories = $this->formatCategories($categories);

                return response()->json([
                    'success' => true,
                    'message' => 'Lấy danh sách danh mục thành công',
                    'data' => $formattedCategories
                ], 200);
            }

            $categories = $query->paginate($perPage);
            $formattedCategories = $this->formatCategories($categories);

            return response()->json([
                'success' => true,
                'message' => 'Lấy danh sách danh mục thành công',
                'data' => [
                    'categories' => $formattedCategories,
                    'pagination' => [
                        'total' => $categories->total(),
                        'per_page' => $categories->perPage(),
                        'current_page' => $categories->currentPage(),
                        'last_page' => $categories->lastPage(),
                    ]
                ]
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Lỗi khi lấy danh sách danh mục',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Xem chi tiết danh mục (Public)
     */
    public function show($id)
    {
        try {
            $category = Category::withCount('products')->find($id);

            if (!$category) {
                return response()->json([
                    'success' => false,
                    'message' => 'Không tìm thấy danh mục'
                ], 404);
            }

            return response()->json([
                'success' => true,
                'message' => 'Lấy chi tiết danh mục thành công',
                'data' => [
                    'id' => $category->id,
                    'name' => $category->name,
                    'image' => $category->image ? Storage::url($category->image) : null,
                    'description' => $category->description,
                    'products_count' => $category->products_count,
                    'created_at' => $category->created_at->format('d/m/Y H:i'),
                ]
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Lỗi khi lấy chi tiết danh mục',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Admin: Tạo danh mục mới
     */
    public function store(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'name' => 'required|string|max:255|unique:categories,name',
                'image' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
                'description' => 'nullable|string|max:500',
            ], [
                'name.required' => 'Vui lòng nhập tên danh mục',
                'name.unique' => 'Tên danh mục đã tồn tại',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation error',
                    'errors' => $validator->errors()
                ], 422);
            }

            // Upload image
            $imagePath = null;
            if ($request->hasFile('image')) {
                $imagePath = $request->file('image')->store('categories', 'public');
            }

            // Tạo category
            $category = Category::create([
                'name' => $request->name,
                'image' => $imagePath,
                'description' => $request->description,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Tạo danh mục thành công',
                'data' => [
                    'id' => $category->id,
                    'name' => $category->name,
                ]
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Lỗi khi tạo danh mục',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Admin: Cập nhật danh mục
     */
    public function update(Request $request, $id)
    {
        try {
            $category = Category::find($id);

            if (!$category) {
                return response()->json([
                    'success' => false,
                    'message' => 'Không tìm thấy danh mục'
                ], 404);
            }

            $validator = Validator::make($request->all(), [
                'name' => 'required|string|max:255|unique:categories,name,' . $id,
                'image' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
                'description' => 'nullable|string|max:500',
            ], [
                'name.required' => 'Vui lòng nhập tên danh mục',
                'name.unique' => 'Tên danh mục đã tồn tại',
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
                if ($category->image) {
                    Storage::disk('public')->delete($category->image);
                }
                $category->image = $request->file('image')->store('categories', 'public');
            }

            // Cập nhật category
            $category->name = $request->name;
            $category->description = $request->description;
            $category->save();

            return response()->json([
                'success' => true,
                'message' => 'Cập nhật danh mục thành công',
                'data' => [
                    'id' => $category->id,
                    'name' => $category->name,
                ]
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Lỗi khi cập nhật danh mục',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Admin: Xóa danh mục
     */
    public function destroy($id)
    {
        try {
            $category = Category::withCount('products')->find($id);

            if (!$category) {
                return response()->json([
                    'success' => false,
                    'message' => 'Không tìm thấy danh mục'
                ], 404);
            }

            // Không cho phép xóa nếu có sản phẩm
            if ($category->products_count > 0) {
                return response()->json([
                    'success' => false,
                    'message' => 'Không thể xóa danh mục đang có sản phẩm'
                ], 400);
            }

            // Xóa image
            if ($category->image) {
                Storage::disk('public')->delete($category->image);
            }

            $category->delete();

            return response()->json([
                'success' => true,
                'message' => 'Xóa danh mục thành công'
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Lỗi khi xóa danh mục',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
