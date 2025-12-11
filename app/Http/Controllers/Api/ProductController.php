<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Product;
use App\Models\ProductVariant;
use App\Models\ProductColor;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;

class ProductController extends Controller
{
    /**
     * Lấy danh sách sản phẩm (Public)
     */
    public function index(Request $request)
    {
        try {
            $perPage = $request->input('per_page', 20);
            $search = $request->input('search');
            $categoryId = $request->input('category_id');
            $minPrice = $request->input('min_price');
            $maxPrice = $request->input('max_price');
            $tag = $request->input('tag');
            $sortBy = $request->input('sort_by', 'newest'); // newest, price_asc, price_desc, popular

            $query = Product::with(['category', 'colors', 'variants']);

            // Search
            if ($search) {
                $query->where('name', 'like', "%{$search}%");
            }

            // Filter by category
            if ($categoryId) {
                $query->where('category_id', $categoryId);
            }

            // Filter by price range
            if ($minPrice) {
                $query->where('price', '>=', $minPrice);
            }
            if ($maxPrice) {
                $query->where('price', '<=', $maxPrice);
            }

            // Filter by tag
            if ($tag) {
                $query->where('tag', $tag);
            }

            // Sort
            switch ($sortBy) {
                case 'price_asc':
                    $query->orderBy('price', 'asc');
                    break;
                case 'price_desc':
                    $query->orderBy('price', 'desc');
                    break;
                case 'popular':
                    $query->orderBy('view_count', 'desc');
                    break;
                case 'newest':
                default:
                    $query->orderBy('created_at', 'desc');
                    break;
            }

            $products = $query->paginate($perPage);

            $formattedProducts = $products->map(function ($product) {
                return $this->formatProduct($product);
            });

            return response()->json([
                'success' => true,
                'message' => 'Lấy danh sách sản phẩm thành công',
                'data' => [
                    'products' => $formattedProducts,
                    'pagination' => [
                        'total' => $products->total(),
                        'per_page' => $products->perPage(),
                        'current_page' => $products->currentPage(),
                        'last_page' => $products->lastPage(),
                    ]
                ]
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
     * Xem chi tiết sản phẩm (Public)
     */
    public function show($id)
    {
        try {
            $product = Product::with(['category', 'colors', 'variants.color', 'comments.user'])->find($id);

            if (!$product) {
                return response()->json([
                    'success' => false,
                    'message' => 'Không tìm thấy sản phẩm'
                ], 404);
            }

            // Tăng view count
            $product->increment('view_count');

            // Get reviews
            $reviews = $product->reviews()
                ->with(['orderItem.order.user', 'orderItem.productVariant.color'])
                ->orderBy('created_at', 'desc')
                ->get();

            $formattedReviews = $reviews->map(function ($review) {
                return [
                    'id' => $review->id,
                    'rating' => $review->rating,
                    'comment' => $review->comment,
                    'user' => [
                        'id' => $review->user->id,
                        'name' => $review->user->name,
                    ],
                    'variant' => [
                        'color' => $review->orderItem->productVariant->color->color_name ?? null,
                        'size' => $review->orderItem->productVariant->size,
                    ],
                    'created_at' => $review->created_at->format('d/m/Y H:i'),
                ];
            });

            // Calculate average rating
            $avgRating = $reviews->avg('rating');
            $reviewCount = $reviews->count();

            // Tính tổng đã bán (từ order_items qua product_colors)
            $totalSold = DB::table('order_items')
                ->join('orders', 'order_items.order_id', '=', 'orders.id')
                ->join('product_variants', 'order_items.product_variant_id', '=', 'product_variants.id')
                ->join('product_colors', 'product_variants.color_id', '=', 'product_colors.id')
                ->where('product_colors.product_id', $product->id)
                ->whereIn('orders.status', ['processing', 'shipping', 'completed'])
                ->sum('order_items.quantity');

            return response()->json([
                'success' => true,
                'message' => 'Lấy chi tiết sản phẩm thành công',
                'data' => [
                    'id' => $product->id,
                    'name' => $product->name,
                    'image' => $product->image ? Storage::url($product->image) : null,
                    'price' => $product->price,
                    'sale_price' => $product->sale_price,
                    'discount_percent' => $product->sale_price 
                        ? round((($product->price - $product->sale_price) / $product->price) * 100) 
                        : 0,
                    'tag' => $product->tag,
                    'description' => $product->description,
                    'view_count' => $product->view_count,
                    'category' => [
                        'id' => $product->category->id,
                        'name' => $product->category->name,
                    ],
                    'colors' => $product->colors->map(function ($color) {
                        return [
                            'id' => $color->id,
                            'name' => $color->color_name,
                            'hex_code' => $color->color_code,
                            'image' => $color->image ? Storage::url($color->image) : null,
                        ];
                    }),
                    'variants' => $product->variants->map(function ($variant) use ($product) {
                        // Tính giá hiển thị cho variant
                        $displayPrice = $variant->sale_price 
                            ?? $variant->price 
                            ?? $product->sale_price 
                            ?? $product->price;
                        
                        // Giá gốc để tính discount
                        $originalPrice = $variant->price ?? $product->price;
                        
                        // Tính % giảm giá
                        $discountPercent = 0;
                        $salePrice = $variant->sale_price ?? $product->sale_price;
                        if ($salePrice && $originalPrice > $salePrice) {
                            $discountPercent = round((($originalPrice - $salePrice) / $originalPrice) * 100);
                        }
                        
                        // Lấy thông tin màu sắc
                        $colorData = null;
                        if ($variant->color_id && $variant->color) {
                            $colorData = [
                                'id' => $variant->color->id,
                                'name' => $variant->color->color_name,
                                'hex_code' => $variant->color->color_code,
                            ];
                        }
                        
                        return [
                            'id' => $variant->id,
                            'color_id' => $variant->color_id,
                            'color' => $colorData,
                            'size' => $variant->size,
                            'quantity' => $variant->quantity,
                            'in_stock' => $variant->quantity > 0,
                            'image' => $variant->color && $variant->color->image ? Storage::url($variant->color->image) : null,
                            
                            // Pricing
                            'price' => $variant->price,
                            'sale_price' => $variant->sale_price,
                            'display_price' => $displayPrice,
                            'original_price' => $originalPrice,
                            'discount_percent' => $discountPercent,
                            'is_on_sale' => $variant->sale_price || ($product->sale_price && !$variant->price),
                        ];
                    }),
                    'comments' => $product->comments->map(function ($comment) {
                        return [
                            'id' => $comment->id,
                            'user' => [
                                'id' => $comment->user->id,
                                'name' => $comment->user->name,
                            ],
                            'content' => $comment->content,
                            'created_at' => $comment->created_at->format('d/m/Y H:i'),
                        ];
                    }),
                    'reviews' => $formattedReviews,
                    'rating' => [
                        'average' => round($avgRating, 1),
                        'count' => $reviewCount,
                    ],
                    'total_sold' => $totalSold ?? 0,
                    'created_at' => $product->created_at->format('d/m/Y H:i'),
                ]
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Lỗi khi lấy chi tiết sản phẩm',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Admin: Tạo sản phẩm mới
     */
    public function store(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'name' => 'required|string|max:255',
                'image' => 'nullable|image|mimes:jpeg,png,jpg,webp,gif|max:2048',
                'price' => 'required|numeric|min:0',
                'sale_price' => 'nullable|numeric|min:0|lt:price',
                'tag' => 'nullable|string|in:new,hot,sale',
                'description' => 'nullable|string',
                'category_id' => 'required|exists:categories,id',
                'colors' => 'required|array|min:1',
                'colors.*.name' => 'required|string|max:255',
                'colors.*.color_code' => 'required|string|max:7',
                'colors.*.image' => 'nullable|image|mimes:jpeg,png,jpg,webp,gif|max:2048',
                'variants' => 'required|array|min:1',
                'variants.*.color_index' => 'required|integer',
                'variants.*.size' => 'required|string',
                'variants.*.quantity' => 'required|integer|min:0',
                'variants.*.price' => 'nullable|numeric|min:0',
                'variants.*.sale_price' => 'nullable|numeric|min:0',
            ], [
                'name.required' => 'Vui lòng nhập tên sản phẩm',
                'price.required' => 'Vui lòng nhập giá sản phẩm',
                'sale_price.lt' => 'Giá khuyến mãi phải nhỏ hơn giá gốc',
                'category_id.required' => 'Vui lòng chọn danh mục',
                'colors.required' => 'Vui lòng thêm ít nhất 1 màu',
                'variants.required' => 'Vui lòng thêm ít nhất 1 biến thể',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation error',
                    'errors' => $validator->errors()
                ], 422);
            }

            DB::beginTransaction();
            try {
                // Upload product image
                $imagePath = null;
                if ($request->hasFile('image')) {
                    $imagePath = $request->file('image')->store('products', 'public');
                }

                // Create product
                $product = Product::create([
                    'name' => $request->name,
                    'image' => $imagePath,
                    'price' => $request->price,
                    'sale_price' => $request->sale_price,
                    'tag' => $request->tag,
                    'description' => $request->description,
                    'category_id' => $request->category_id,
                ]);

                // Create colors
                $colorIds = [];
                foreach ($request->colors as $index => $colorData) {
                    $colorImagePath = null;
                    if (isset($colorData['image']) && $request->hasFile("colors.{$index}.image")) {
                        $colorImagePath = $request->file("colors.{$index}.image")->store('products/colors', 'public');
                    }

                    $color = ProductColor::create([
                        'product_id' => $product->id,
                        'color_name' => $colorData['name'],
                        'color_code' => $colorData['color_code'],
                        'image' => $colorImagePath,
                    ]);

                    $colorIds[$index] = $color->id;
                }

                // Create variants
                foreach ($request->variants as $variantData) {
                    $colorId = $colorIds[$variantData['color_index']];

                    ProductVariant::create([
                        'color_id' => $colorId,
                        'size' => $variantData['size'],
                        'quantity' => $variantData['quantity'],
                        'price' => $variantData['price'] ?? null,
                        'sale_price' => $variantData['sale_price'] ?? null,
                    ]);
                }

                DB::commit();

                return response()->json([
                    'success' => true,
                    'message' => 'Tạo sản phẩm thành công',
                    'data' => [
                        'id' => $product->id,
                        'name' => $product->name,
                    ]
                ], 201);

            } catch (\Exception $e) {
                DB::rollBack();
                throw $e;
            }

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Lỗi khi tạo sản phẩm',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Admin: Cập nhật sản phẩm
     */
    public function update(Request $request, $id)
    {
        try {
            $product = Product::find($id);

            if (!$product) {
                return response()->json([
                    'success' => false,
                    'message' => 'Không tìm thấy sản phẩm'
                ], 404);
            }

            $validator = Validator::make($request->all(), [
                'name' => 'required|string|max:255',
                'image' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
                'price' => 'required|numeric|min:0',
                'sale_price' => 'nullable|numeric|min:0|lt:price',
                'tag' => 'nullable|string|in:new,hot,sale',
                'description' => 'nullable|string',
                'category_id' => 'required|exists:categories,id',
                'variants' => 'nullable|array',
                'variants.*.id' => 'required|exists:product_variants,id',
                'variants.*.quantity' => 'nullable|integer|min:0',
                'variants.*.price' => 'nullable|numeric|min:0',
                'variants.*.sale_price' => 'nullable|numeric|min:0',
            ], [
                'variants.*.id.required' => 'Variant ID là bắt buộc',
                'variants.*.id.exists' => 'Variant không tồn tại',
                'variants.*.quantity.integer' => 'Số lượng phải là số nguyên',
                'variants.*.quantity.min' => 'Số lượng không được âm',
                'variants.*.price.numeric' => 'Giá phải là số',
                'variants.*.price.min' => 'Giá không được âm',
                'variants.*.sale_price.numeric' => 'Giá sale phải là số',
                'variants.*.sale_price.min' => 'Giá sale không được âm',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation error',
                    'errors' => $validator->errors()
                ], 422);
            }

            DB::beginTransaction();

            try {
                // Upload image mới nếu có
                if ($request->hasFile('image')) {
                    // Xóa ảnh cũ
                    if ($product->image) {
                        Storage::disk('public')->delete($product->image);
                    }
                    $product->image = $request->file('image')->store('products', 'public');
                }

                // Cập nhật product
                $product->name = $request->name;
                $product->price = $request->price;
                $product->sale_price = $request->sale_price;
                $product->tag = $request->tag;
                $product->description = $request->description;
                $product->category_id = $request->category_id;
                $product->save();

                // Cập nhật variants nếu có
                if ($request->has('variants') && is_array($request->variants)) {
                    foreach ($request->variants as $variantData) {
                        $variant = ProductVariant::whereHas('color', function($q) use ($product) {
                                $q->where('product_id', $product->id);
                            })
                            ->where('id', $variantData['id'])
                            ->first();

                        if ($variant) {
                            // Cập nhật quantity
                            if (isset($variantData['quantity'])) {
                                $variant->quantity = $variantData['quantity'];
                            }

                            // Cập nhật price (null = dùng giá product)
                            if (array_key_exists('price', $variantData)) {
                                $variant->price = $variantData['price'] === '' || $variantData['price'] === null 
                                    ? null 
                                    : $variantData['price'];
                            }

                            // Cập nhật sale_price (null = dùng sale_price product)
                            if (array_key_exists('sale_price', $variantData)) {
                                $variant->sale_price = $variantData['sale_price'] === '' || $variantData['sale_price'] === null 
                                    ? null 
                                    : $variantData['sale_price'];
                            }

                            $variant->save();
                        }
                    }
                }

                DB::commit();

                // Load lại product với variants
                $product->load(['variants.color', 'category']);

                return response()->json([
                    'success' => true,
                    'message' => 'Cập nhật sản phẩm thành công',
                    'data' => [
                        'id' => $product->id,
                        'name' => $product->name,
                        'price' => $product->price,
                        'sale_price' => $product->sale_price,
                        'variants' => $product->variants->map(function($variant) {
                            return [
                                'id' => $variant->id,
                                'color_name' => $variant->color->color_name,
                                'color_hex' => $variant->color->color_code,
                                'size' => $variant->size,
                                'quantity' => $variant->quantity,
                                'price' => $variant->price,
                                'sale_price' => $variant->sale_price,
                            ];
                        }),
                    ]
                ], 200);

            } catch (\Exception $e) {
                DB::rollBack();
                throw $e;
            }

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Lỗi khi cập nhật sản phẩm',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Admin: Xóa sản phẩm
     */
    public function destroy($id)
    {
        try {
            $product = Product::with(['colors', 'variants'])->find($id);

            if (!$product) {
                return response()->json([
                    'success' => false,
                    'message' => 'Không tìm thấy sản phẩm'
                ], 404);
            }

            DB::beginTransaction();
            try {
                // Xóa images
                if ($product->image) {
                    Storage::disk('public')->delete($product->image);
                }

                foreach ($product->colors as $color) {
                    if ($color->image) {
                        Storage::disk('public')->delete($color->image);
                    }
                    $color->delete();
                }

                // Xóa variants
                $product->variants()->delete();

                // Xóa product
                $product->delete();

                DB::commit();

                return response()->json([
                    'success' => true,
                    'message' => 'Xóa sản phẩm thành công'
                ], 200);

            } catch (\Exception $e) {
                DB::rollBack();
                throw $e;
            }

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Lỗi khi xóa sản phẩm',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Admin: Cập nhật variant (quantity, price, sale_price)
     */
    public function updateVariantStock(Request $request, $variantId)
    {
        try {
            $validator = Validator::make($request->all(), [
                'quantity' => 'nullable|integer|min:0',
                'price' => 'nullable|numeric|min:0',
                'sale_price' => 'nullable|numeric|min:0',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation error',
                    'errors' => $validator->errors()
                ], 422);
            }

            $variant = ProductVariant::find($variantId);

            if (!$variant) {
                return response()->json([
                    'success' => false,
                    'message' => 'Không tìm thấy biến thể'
                ], 404);
            }

            // Cập nhật các trường được gửi lên
            if ($request->has('quantity')) {
                $variant->quantity = $request->quantity;
            }
            if ($request->has('price')) {
                $variant->price = $request->price;
            }
            if ($request->has('sale_price')) {
                $variant->sale_price = $request->sale_price;
            }
            
            $variant->save();

            return response()->json([
                'success' => true,
                'message' => 'Cập nhật biến thể thành công',
                'data' => [
                    'id' => $variant->id,
                    'quantity' => $variant->quantity,
                    'price' => $variant->price,
                    'sale_price' => $variant->sale_price,
                ]
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Lỗi khi cập nhật biến thể',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Helper: Format product
     */
    private function formatProduct($product)
    {
        // Tính khoảng giá từ variants
        $prices = [];
        foreach ($product->variants as $variant) {
            $displayPrice = $variant->sale_price 
                ?? $variant->price 
                ?? $product->sale_price 
                ?? $product->price;
            $prices[] = $displayPrice;
        }
        
        $minPrice = !empty($prices) ? min($prices) : $product->price;
        $maxPrice = !empty($prices) ? max($prices) : $product->price;
        
        return [
            'id' => $product->id,
            'name' => $product->name,
            'image' => $product->image ? Storage::url($product->image) : null,
            'price' => $product->price,
            'sale_price' => $product->sale_price,
            'price_range' => [
                'min' => $minPrice,
                'max' => $maxPrice,
                'display' => $minPrice == $maxPrice 
                    ? number_format($minPrice, 0, ',', '.') . 'đ'
                    : number_format($minPrice, 0, ',', '.') . 'đ - ' . number_format($maxPrice, 0, ',', '.') . 'đ'
            ],
            'discount_percent' => $product->sale_price 
                ? round((($product->price - $product->sale_price) / $product->price) * 100) 
                : 0,
            'tag' => $product->tag,
            'category' => [
                'id' => $product->category->id,
                'name' => $product->category->name,
            ],
            'colors_count' => $product->colors->count(),
            'variants_count' => $product->variants->count(),
            'total_stock' => $product->variants->sum('quantity'),
            'view_count' => $product->view_count,
            'created_at' => $product->created_at->format('d/m/Y H:i'),
        ];
    }
}
