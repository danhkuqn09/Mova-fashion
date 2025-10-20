<?php

namespace App\Http\Controllers\Api;

use App\Models\Category;
use App\Models\ProductColor;
use App\Models\ProductColorSize;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use App\Http\Controllers\Controller;


class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $query = Product::query()->with(['category','category']);
        
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //

        $validated = $request->validate([
            'name' => 'required|string',
            'price' => 'required|numeric',
            'sale_price' => 'nullable|numeric|min:0|lte:price',
            'image' => 'required|image|mimes:jpg,jpeg,png,webp|max:5120',
            'category_id' => 'nullable|exists:categories,id',
            'description' => 'nullable|string',
            'tag' => 'nullable|string|in:hot-sales,new-arrivals',
            'colors' => 'nullable|array',
            'colors.*.color' => 'required_with:colors|string',
            'colors.*.image' => 'nullable|file|image|mimes:jpg,jpeg,png,webp|max:5120',
            'colors.*.sizes' => 'nullable|array',
            'colors.*.sizes.*.size' => 'required_with:colors|string',
            'colors.*.sizes.*.quantity' => 'required_with:colors|integer|min:0',
        ]);

        DB::beginTransaction();
        try {
            // upload main image
            $path = $request->file('image')->store('uploads/products', 'public');
            $validated['image'] = $path;

            $product = Product::create($validated);

            // xử lý colors (nếu có)
            if ($request->has('colors') && is_array($request->colors)) {
                foreach ($request->colors as $idx => $colorData) {
                    if (empty($colorData['color'])) continue;

                    $colorImagePath = null;
                    // nếu file được gửi qua multipart với key colors[0][image]
                    if ($request->hasFile("colors.{$idx}.image")) {
                        $colorImagePath = $request->file("colors.{$idx}.image")->store('uploads/colors', 'public');
                    } elseif (!empty($colorData['image']) && is_string($colorData['image'])) {
                        // nếu client gửi đường dẫn/string thay vì file
                        $colorImagePath = $colorData['image'];
                    }

                    $productColor = ProductColor::create([
                        'product_id' => $product->id,
                        'color' => $colorData['color'],
                        'image' => $colorImagePath,
                    ]);

                    if (!empty($colorData['sizes']) && is_array($colorData['sizes'])) {
                        foreach ($colorData['sizes'] as $sizeItem) {
                            if (!isset($sizeItem['size']) || !isset($sizeItem['quantity'])) continue;
                            ProductColorSize::create([
                                'product_color_id' => $productColor->id,
                                'size' => $sizeItem['size'],
                                'quantity' => (int) $sizeItem['quantity'],
                            ]);
                        }
                    }
                }
            }

            DB::commit();

            // trả về JSON (API)
            return response()->json([
                'message' => 'Product created',
                'product' => $product->load('colors.sizes')
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Failed to create product',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Product $product)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Product $product)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Product $product)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Product $product)
    {
        //
    }
}
