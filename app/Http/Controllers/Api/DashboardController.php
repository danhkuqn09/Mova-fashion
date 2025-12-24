<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Order;
use App\Models\User;
use App\Models\Product;
use App\Models\Review;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class DashboardController extends Controller
{
    /**
     * Thống kê tổng quan Dashboard Admin
     */
    public function overview()
    {
        try {
            // Tổng quan
            $totalOrders = Order::count();
            $totalUsers = User::where('role', 'user')->count();
            $totalProducts = Product::count();
            
            // Tính doanh thu: Đơn completed + Momo đã thanh toán
            $completedRevenue = Order::where('status', 'completed')->sum('final_total');
            $momoRevenue = Order::where('payment_method', 'momo')
                ->where('payment_status', 'paid')
                ->sum('final_total');
            $totalRevenue = $completedRevenue + $momoRevenue;

            // Đơn hàng theo trạng thái
            $ordersByStatus = Order::select('status', DB::raw('count(*) as total'))
                ->groupBy('status')
                ->get()
                ->pluck('total', 'status');

            // Đơn hàng chờ xác nhận
            $pendingOrders = Order::where('status', 'pending')
                ->with([
                    'user:id,name,email',
                    'items.productVariant.product:id,name,image',
                    'items.productVariant.color:id,name,image',
                    'items.productVariant.size:id,name'
                ])
                ->orderBy('created_at', 'desc')
                ->limit(10)
                ->get()
                ->map(function ($order) {
                    return [
                        'id' => $order->id,
                        // 'order_code' => $order->order_code, // Trường này không tồn tại
                        'user_name' => $order->user->name,
                        'user_email' => $order->user->email,
                        'final_total' => $order->final_total,
                        'payment_method' => $order->payment_method,
                        'shipping_address' => $order->shipping_address ?? $order->address ?? null,
                        'items_count' => $order->items->count(),
                        'created_at' => $order->created_at->format('d/m/Y H:i'),
                    ];
                });

            // Doanh thu 7 ngày gần nhất
            $last7Days = [];
            for ($i = 6; $i >= 0; $i--) {
                $date = Carbon::now()->subDays($i);
                $revenue = Order::where('status', 'completed')
                    ->whereDate('created_at', $date)
                    ->sum('final_total');
                
                $last7Days[] = [
                    'date' => $date->format('d/m'),
                    'revenue' => $revenue,
                ];
            }

            // Top 5 sản phẩm bán chạy
            $topProducts = Product::withCount(['variants as total_sold' => function ($query) {
                    $query->select(DB::raw('COALESCE(SUM(order_items.quantity), 0)'))
                        ->join('order_items', 'product_variants.id', '=', 'order_items.product_variant_id')
                        ->join('orders', 'order_items.order_id', '=', 'orders.id')
                        ->where('orders.status', 'completed');
                }])
                ->orderBy('total_sold', 'desc')
                ->limit(5)
                ->get(['id', 'name', 'image', 'price', 'sale_price'])
                ->map(function ($product) {
                    return [
                        'id' => $product->id,
                        'name' => $product->name,
                        'image' => $product->image ? asset('storage/' . $product->image) : null,
                        'price' => $product->price,
                        'sale_price' => $product->sale_price,
                        'total_sold' => $product->total_sold ?? 0,
                    ];
                });

            // User mới trong 30 ngày
            $newUsersLast30Days = User::where('role', 'user')
                ->where('created_at', '>=', Carbon::now()->subDays(30))
                ->count();

            return response()->json([
                'success' => true,
                'message' => 'Lấy thống kê dashboard thành công',
                'data' => [
                    'overview' => [
                        'total_orders' => $totalOrders,
                        'total_users' => $totalUsers,
                        'total_products' => $totalProducts,
                        'total_revenue' => $totalRevenue,
                        'new_users_last_30_days' => $newUsersLast30Days,
                    ],
                    'orders_by_status' => [
                        'pending' => $ordersByStatus['pending'] ?? 0,
                        'confirmed' => $ordersByStatus['confirmed'] ?? 0,
                        'processing' => $ordersByStatus['processing'] ?? 0,
                        'shipped' => $ordersByStatus['shipped'] ?? 0,
                        'completed' => $ordersByStatus['completed'] ?? 0,
                        'cancelled' => $ordersByStatus['cancelled'] ?? 0,
                    ],
                    'pending_orders' => $pendingOrders,
                    'revenue_last_7_days' => $last7Days,
                    'top_products' => $topProducts,
                ]
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Lỗi khi lấy thống kê dashboard',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Thống kê doanh thu theo ngày
     * - Doanh thu được tính khi admin chuyển trạng thái sang "completed"
     * - Hoặc khi thanh toán Momo thành công (payment_status = 'paid')
     */
    public function revenueByDay(Request $request)
    {
        try {
            $startDate = $request->input('start_date', Carbon::now()->subDays(30)->format('Y-m-d'));
            $endDate = $request->input('end_date', Carbon::now()->format('Y-m-d'));

            // Lấy đơn hàng đã hoàn thành (COD)
            $completedOrders = Order::where('status', 'completed')
                ->whereBetween('updated_at', [$startDate . ' 00:00:00', $endDate . ' 23:59:59'])
                ->select(
                    DB::raw('DATE(updated_at) as date'),
                    DB::raw('SUM(final_total) as revenue'),
                    DB::raw('COUNT(*) as order_count')
                )
                ->groupBy('date');

            // Lấy đơn hàng Momo đã thanh toán (payment_status = 'paid')
            $paidMomoOrders = Order::where('payment_method', 'momo')
                ->where('payment_status', 'paid')
                ->where('status', '!=', 'completed') // Không tính trùng với completed
                ->whereBetween('updated_at', [$startDate . ' 00:00:00', $endDate . ' 23:59:59'])
                ->select(
                    DB::raw('DATE(updated_at) as date'),
                    DB::raw('SUM(final_total) as revenue'),
                    DB::raw('COUNT(*) as order_count')
                )
                ->groupBy('date');

            // Union 2 queries
            $revenues = $completedOrders
                ->union($paidMomoOrders)
                ->get();

            // Group và sum lại theo ngày (trường hợp có cả 2 loại trong cùng 1 ngày)
            $revenuesByDate = $revenues->groupBy('date')->map(function ($items, $date) {
                return [
                    'date' => Carbon::parse($date)->format('d/m/Y'),
                    'revenue' => $items->sum('revenue'),
                    'order_count' => $items->sum('order_count'),
                ];
            })->sortBy('date')->values();

            $totalRevenue = $revenuesByDate->sum('revenue');
            $totalOrders = $revenuesByDate->sum('order_count');

            return response()->json([
                'success' => true,
                'message' => 'Lấy thống kê doanh thu theo ngày thành công',
                'data' => [
                    'start_date' => Carbon::parse($startDate)->format('d/m/Y'),
                    'end_date' => Carbon::parse($endDate)->format('d/m/Y'),
                    'total_revenue' => $totalRevenue,
                    'total_orders' => $totalOrders,
                    'revenues' => $revenuesByDate,
                ]
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Lỗi khi lấy thống kê doanh thu theo ngày',
                'error' => $e->getMessage()
            ], 500);
        }
    }



    /**
     * Lấy danh sách đơn hàng chờ xác nhận
     */
    public function pendingOrders(Request $request)
    {
        try {
            $perPage = $request->input('per_page', 15);

            $orders = Order::where('status', 'pending')
                ->with([
                    'user:id,name,email,phone',
                    'items.productVariant.product:id,name,image',
                    'items.productVariant.color:id,name,image',
                    'items.productVariant.size:id,name'
                ])
                ->orderBy('created_at', 'desc')
                ->paginate($perPage);

            $orders->getCollection()->transform(function ($order) {
                return [
                    'id' => $order->id,
                    'order_code' => $order->order_code,
                    'user' => [
                        'id' => $order->user->id,
                        'name' => $order->user->name,
                        'email' => $order->user->email,
                        'phone' => $order->user->phone,
                    ],
                    'items' => $order->items->map(function ($item) {
                        return [
                            'product_name' => $item->productVariant->product->name,
                            'color' => $item->productVariant->color->name,
                            'size' => $item->productVariant->size ? $item->productVariant->size->name : null,
                            'quantity' => $item->quantity,
                            'price' => $item->price,
                            'image' => $item->productVariant->product->image 
                                ? asset('storage/' . $item->productVariant->product->image) 
                                : null,
                        ];
                    }),
                    'subtotal' => $order->subtotal,
                    'shipping_fee' => $order->shipping_fee,
                    'discount' => $order->discount,
                    'final_total' => $order->final_total,
                    'payment_method' => $order->payment_method,
                    'payment_status' => $order->payment_status,
                    'shipping_address' => $order->shipping_address,
                    'note' => $order->note,
                    'created_at' => $order->created_at->format('d/m/Y H:i'),
                ];
            });

            return response()->json([
                'success' => true,
                'message' => 'Lấy danh sách đơn hàng chờ xác nhận thành công',
                'data' => $orders
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Lỗi khi lấy danh sách đơn hàng chờ xác nhận',
                'error' => $e->getMessage()
            ], 500);
        }
    }
    
    /**
     * So sánh doanh thu tháng này với tháng trước
     */
    public function revenueComparison(Request $request)
    {
        try {
            // Tháng hiện tại
            $thisMonthStart = Carbon::now()->startOfMonth();
            $thisMonthEnd = Carbon::now()->endOfMonth();
            
            // Doanh thu: Completed + Momo paid
            $thisMonthCompletedRevenue = Order::where('status', 'completed')
                ->whereBetween('created_at', [$thisMonthStart, $thisMonthEnd])
                ->sum('final_total');
            
            $thisMonthMomoRevenue = Order::where('payment_method', 'momo')
                ->where('payment_status', 'paid')
                ->whereBetween('created_at', [$thisMonthStart, $thisMonthEnd])
                ->sum('final_total');
            
            $thisMonthRevenue = $thisMonthCompletedRevenue + $thisMonthMomoRevenue;
            
            // Số đơn hàng
            $thisMonthCompletedOrders = Order::where('status', 'completed')
                ->whereBetween('created_at', [$thisMonthStart, $thisMonthEnd])
                ->count();
            
            $thisMonthMomoOrders = Order::where('payment_method', 'momo')
                ->where('payment_status', 'paid')
                ->whereBetween('created_at', [$thisMonthStart, $thisMonthEnd])
                ->count();
            
            $thisMonthOrders = $thisMonthCompletedOrders + $thisMonthMomoOrders;

            // Tháng trước
            $lastMonthStart = Carbon::now()->subMonth()->startOfMonth();
            $lastMonthEnd = Carbon::now()->subMonth()->endOfMonth();
            
            // Doanh thu: Completed + Momo paid
            $lastMonthCompletedRevenue = Order::where('status', 'completed')
                ->whereBetween('created_at', [$lastMonthStart, $lastMonthEnd])
                ->sum('final_total');
            
            $lastMonthMomoRevenue = Order::where('payment_method', 'momo')
                ->where('payment_status', 'paid')
                ->whereBetween('created_at', [$lastMonthStart, $lastMonthEnd])
                ->sum('final_total');
            
            $lastMonthRevenue = $lastMonthCompletedRevenue + $lastMonthMomoRevenue;
            
            // Số đơn hàng
            $lastMonthCompletedOrders = Order::where('status', 'completed')
                ->whereBetween('created_at', [$lastMonthStart, $lastMonthEnd])
                ->count();
            
            $lastMonthMomoOrders = Order::where('payment_method', 'momo')
                ->where('payment_status', 'paid')
                ->whereBetween('created_at', [$lastMonthStart, $lastMonthEnd])
                ->count();
            
            $lastMonthOrders = $lastMonthCompletedOrders + $lastMonthMomoOrders;

            // Tính phần trăm tăng trưởng
            $revenueGrowth = $lastMonthRevenue > 0 
                ? round((($thisMonthRevenue - $lastMonthRevenue) / $lastMonthRevenue) * 100, 2)
                : 0;
            
            $ordersGrowth = $lastMonthOrders > 0
                ? round((($thisMonthOrders - $lastMonthOrders) / $lastMonthOrders) * 100, 2)
                : 0;

            // Doanh thu trung bình mỗi đơn
            $thisMonthAvgOrderValue = $thisMonthOrders > 0 
                ? round($thisMonthRevenue / $thisMonthOrders, 0)
                : 0;
            
            $lastMonthAvgOrderValue = $lastMonthOrders > 0
                ? round($lastMonthRevenue / $lastMonthOrders, 0)
                : 0;

            // Doanh thu theo ngày trong tháng hiện tại
            $completedDaily = Order::where('status', 'completed')
                ->whereBetween('created_at', [$thisMonthStart, $thisMonthEnd])
                ->select(
                    DB::raw('DATE(created_at) as date'),
                    DB::raw('SUM(final_total) as revenue'),
                    DB::raw('COUNT(*) as order_count')
                )
                ->groupBy('date');
            
            $momoDaily = Order::where('payment_method', 'momo')
                ->where('payment_status', 'paid')
                ->whereBetween('created_at', [$thisMonthStart, $thisMonthEnd])
                ->select(
                    DB::raw('DATE(created_at) as date'),
                    DB::raw('SUM(final_total) as revenue'),
                    DB::raw('COUNT(*) as order_count')
                )
                ->groupBy('date');
            
            $allDaily = $completedDaily->union($momoDaily)->get();
            
            $dailyRevenue = $allDaily->groupBy('date')->map(function ($items, $date) {
                return [
                    'date' => Carbon::parse($date)->format('d/m'),
                    'revenue' => $items->sum('revenue'),
                    'order_count' => $items->sum('order_count'),
                ];
            })->sortBy('date')->values();

            return response()->json([
                'success' => true,
                'message' => 'So sánh doanh thu thành công',
                'data' => [
                    'this_month' => [
                        'month_name' => 'Tháng ' . Carbon::now()->format('m/Y'),
                        'revenue' => $thisMonthRevenue,
                        'orders' => $thisMonthOrders,
                        'avg_order_value' => $thisMonthAvgOrderValue,
                        'daily_revenue' => $dailyRevenue,
                    ],
                    'last_month' => [
                        'month_name' => 'Tháng ' . Carbon::now()->subMonth()->format('m/Y'),
                        'revenue' => $lastMonthRevenue,
                        'orders' => $lastMonthOrders,
                        'avg_order_value' => $lastMonthAvgOrderValue,
                    ],
                    'comparison' => [
                        'revenue_difference' => $thisMonthRevenue - $lastMonthRevenue,
                        'revenue_growth_percent' => $revenueGrowth,
                        'revenue_trend' => $revenueGrowth > 0 ? 'increase' : ($revenueGrowth < 0 ? 'decrease' : 'stable'),
                        'orders_difference' => $thisMonthOrders - $lastMonthOrders,
                        'orders_growth_percent' => $ordersGrowth,
                        'orders_trend' => $ordersGrowth > 0 ? 'increase' : ($ordersGrowth < 0 ? 'decrease' : 'stable'),
                    ],
                ]
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Lỗi khi so sánh doanh thu',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
