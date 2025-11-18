<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Product;
use App\Models\Category;
use Illuminate\Support\Facades\DB;

class HomeController extends Controller
{
    /**
     * Lấy danh sách sản phẩm cho trang chủ
     */
    public function index(Request $request)
    {
        try {
            $perPage = $request->input('per_page', 12);
            $page = $request->input('page', 1);

            // Lấy sản phẩm với các relationships
            $products = Product::with(['category', 'colors', 'variants'])
                ->orderBy('created_at', 'desc')
                ->paginate($perPage);

            return response()->json([
                'success' => true,
                'message' => 'Lấy danh sách sản phẩm thành công',
                'data' => $products
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Lỗi khi lấy danh sách sản phẩm',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Lấy sản phẩm nổi bật (featured products)
     */
    public function featured()
    {
        try {
            // Lấy sản phẩm có tag 'featured' hoặc sản phẩm có view_count cao
            $products = Product::with(['category', 'colors', 'variants'])
                ->where('tag', 'LIKE', '%featured%')
                ->orWhereNotNull('id')
                ->orderBy('view_count', 'desc')
                ->limit(8)
                ->get();

            return response()->json([
                'success' => true,
                'message' => 'Lấy sản phẩm nổi bật thành công',
                'data' => $products
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Lỗi khi lấy sản phẩm nổi bật',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Lấy sản phẩm mới nhất
     */
    public function newArrivals()
    {
        try {
            $products = Product::with(['category', 'colors', 'variants'])
                ->orderBy('created_at', 'desc')
                ->limit(8)
                ->get();

            return response()->json([
                'success' => true,
                'message' => 'Lấy sản phẩm mới nhất thành công',
                'data' => $products
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Lỗi khi lấy sản phẩm mới nhất',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Lấy sản phẩm đang sale
     */
    public function onSale()
    {
        try {
            $products = Product::with(['category', 'colors', 'variants'])
                ->whereNotNull('sale_price')
                ->where('sale_price', '<', DB::raw('price'))
                ->orderBy('created_at', 'desc')
                ->limit(8)
                ->get();

            return response()->json([
                'success' => true,
                'message' => 'Lấy sản phẩm đang sale thành công',
                'data' => $products
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Lỗi khi lấy sản phẩm đang sale',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Lấy sản phẩm theo danh mục
     */
    public function getByCategory($categoryId)
    {
        try {
            $category = Category::find($categoryId);

            if (!$category) {
                return response()->json([
                    'success' => false,
                    'message' => 'Không tìm thấy danh mục'
                ], 404);
            }

            $products = Product::with(['category', 'colors', 'variants'])
                ->where('category_id', $categoryId)
                ->orderBy('created_at', 'desc')
                ->paginate(12);

            return response()->json([
                'success' => true,
                'message' => 'Lấy sản phẩm theo danh mục thành công',
                'data' => [
                    'category' => $category,
                    'products' => $products
                ]
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Lỗi khi lấy sản phẩm theo danh mục',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Tìm kiếm sản phẩm
     */
    public function search(Request $request)
    {
        try {
            $keyword = $request->input('keyword', '');
            $categoryId = $request->input('category_id');
            $minPrice = $request->input('min_price');
            $maxPrice = $request->input('max_price');
            $sortBy = $request->input('sort_by', 'created_at');
            $sortOrder = $request->input('sort_order', 'desc');
            $perPage = $request->input('per_page', 12);

            $query = Product::with(['category', 'colors', 'variants']);

            // Tìm kiếm theo từ khóa
            if ($keyword) {
                $query->where(function($q) use ($keyword) {
                    $q->where('name', 'LIKE', "%{$keyword}%")
                      ->orWhere('description', 'LIKE', "%{$keyword}%")
                      ->orWhere('tag', 'LIKE', "%{$keyword}%");
                });
            }

            // Lọc theo danh mục
            if ($categoryId) {
                $query->where('category_id', $categoryId);
            }

            // Lọc theo giá
            if ($minPrice) {
                $query->where(function($q) use ($minPrice) {
                    $q->where('sale_price', '>=', $minPrice)
                      ->orWhere(function($q2) use ($minPrice) {
                          $q2->whereNull('sale_price')
                             ->where('price', '>=', $minPrice);
                      });
                });
            }

            if ($maxPrice) {
                $query->where(function($q) use ($maxPrice) {
                    $q->where('sale_price', '<=', $maxPrice)
                      ->orWhere(function($q2) use ($maxPrice) {
                          $q2->whereNull('sale_price')
                             ->where('price', '<=', $maxPrice);
                      });
                });
            }

            // Sắp xếp
            $query->orderBy($sortBy, $sortOrder);

            $products = $query->paginate($perPage);

            return response()->json([
                'success' => true,
                'message' => 'Tìm kiếm sản phẩm thành công',
                'data' => $products
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Lỗi khi tìm kiếm sản phẩm',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Lấy sản phẩm liên quan
     */
    public function getRelated($id)
    {
        try {
            $product = Product::find($id);

            if (!$product) {
                return response()->json([
                    'success' => false,
                    'message' => 'Không tìm thấy sản phẩm'
                ], 404);
            }

            // Lấy sản phẩm cùng danh mục, trừ sản phẩm hiện tại
            $relatedProducts = Product::with(['category', 'colors', 'variants'])
                ->where('category_id', $product->category_id)
                ->where('id', '!=', $id)
                ->limit(4)
                ->get();

            return response()->json([
                'success' => true,
                'message' => 'Lấy sản phẩm liên quan thành công',
                'data' => $relatedProducts
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Lỗi khi lấy sản phẩm liên quan',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Lấy danh sách danh mục
     */
    public function getCategories()
    {
        try {
            $categories = Category::where('is_active', true)
                ->withCount('products')
                ->get();

            return response()->json([
                'success' => true,
                'message' => 'Lấy danh sách danh mục thành công',
                'data' => $categories
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Lỗi khi lấy danh sách danh mục',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
