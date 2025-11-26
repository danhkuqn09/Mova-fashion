<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;

class UserController extends Controller
{
    /**
     * Lấy thông tin profile user đang đăng nhập
     */
    public function getProfile()
    {
        try {
            $user = Auth::user();

            return response()->json([
                'success' => true,
                'message' => 'Lấy thông tin thành công',
                'data' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'phone' => $user->phone,
                    'address' => $user->address,
                    'avatar' => $user->avatar ? Storage::url($user->avatar) : null,
                    'role' => $user->role,
                    'created_at' => $user->created_at->format('d/m/Y H:i'),
                ]
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Lỗi khi lấy thông tin',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Cập nhật thông tin profile (name, phone, address, avatar)
     */
    public function updateProfile(Request $request)
    {
        try {
            $user = Auth::user();

            $validator = Validator::make($request->all(), [
                'name' => 'nullable|string|max:255',
                'phone' => 'nullable|string|max:20',
                'address' => 'nullable|string|max:500',
                'avatar' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
            ], [
                'name.max' => 'Tên không được quá 255 ký tự',
                'phone.max' => 'Số điện thoại không được quá 20 ký tự',
                'address.max' => 'Địa chỉ không được quá 500 ký tự',
                'avatar.image' => 'File phải là hình ảnh',
                'avatar.mimes' => 'Ảnh phải có định dạng jpeg, png, jpg',
                'avatar.max' => 'Kích thước ảnh không được vượt quá 2MB',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation error',
                    'errors' => $validator->errors()
                ], 422);
            }

            // Update name, phone, address nếu có
            if ($request->has('name')) {
                $user->name = $request->name;
            }
            if ($request->has('phone')) {
                $user->phone = $request->phone;
            }
            if ($request->has('address')) {
                $user->address = $request->address;
            }

            // Upload avatar mới nếu có
            if ($request->hasFile('avatar')) {
                // Xóa avatar cũ
                if ($user->avatar) {
                    Storage::disk('public')->delete($user->avatar);
                }
                
                $avatarPath = $request->file('avatar')->store('avatars', 'public');
                $user->avatar = $avatarPath;
            }

            $user->save();

            return response()->json([
                'success' => true,
                'message' => 'Cập nhật thông tin thành công',
                'data' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'phone' => $user->phone,
                    'address' => $user->address,
                    'avatar' => $user->avatar ? Storage::url($user->avatar) : null,
                ]
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Lỗi khi cập nhật thông tin',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Đổi mật khẩu
     */
    public function updatePassword(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'current_password' => 'required|string',
                'new_password' => 'required|string|min:8|confirmed',
            ], [
                'current_password.required' => 'Vui lòng nhập mật khẩu hiện tại',
                'new_password.required' => 'Vui lòng nhập mật khẩu mới',
                'new_password.min' => 'Mật khẩu mới phải có ít nhất 8 ký tự',
                'new_password.confirmed' => 'Xác nhận mật khẩu không khớp',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation error',
                    'errors' => $validator->errors()
                ], 422);
            }

            $user = Auth::user();

            // Kiểm tra mật khẩu hiện tại
            if (!Hash::check($request->current_password, $user->password)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Mật khẩu hiện tại không đúng'
                ], 400);
            }

            // Cập nhật mật khẩu mới
            $user->password = Hash::make($request->new_password);
            $user->save();

            return response()->json([
                'success' => true,
                'message' => 'Đổi mật khẩu thành công'
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Lỗi khi đổi mật khẩu',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Xóa avatar
     */
    public function deleteAvatar()
    {
        try {
            $user = Auth::user();

            if ($user->avatar) {
                Storage::disk('public')->delete($user->avatar);
                $user->avatar = null;
                $user->save();
            }

            return response()->json([
                'success' => true,
                'message' => 'Xóa ảnh đại diện thành công'
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Lỗi khi xóa ảnh đại diện',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Lấy thống kê của user (số đơn hàng, số bình luận, số review)
     */
    public function getStatistics()
    {
        try {
            $user = Auth::user();

            $totalOrders = $user->orders()->count();
            $pendingOrders = $user->orders()->where('status', 'pending')->count();
            $processingOrders = $user->orders()->where('status', 'processing')->count();
            $completedOrders = $user->orders()->where('status', 'completed')->count();
            $cancelledOrders = $user->orders()->where('status', 'cancelled')->count();

            $totalComments = $user->comments()->count();
            $totalReviews = $user->reviews()->count();

            $totalSpent = $user->orders()
                ->whereIn('status', ['completed'])
                ->sum('final_total');

            return response()->json([
                'success' => true,
                'message' => 'Lấy thống kê thành công',
                'data' => [
                    'orders' => [
                        'total' => $totalOrders,
                        'pending' => $pendingOrders,
                        'processing' => $processingOrders,
                        'completed' => $completedOrders,
                        'cancelled' => $cancelledOrders,
                    ],
                    'comments' => $totalComments,
                    'reviews' => $totalReviews,
                    'total_spent' => $totalSpent,
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

    /**
     * Logout - Xóa token hiện tại
     */
    public function logout(Request $request)
    {
        try {
            // Xóa token hiện tại
            $request->user()->currentAccessToken()->delete();

            return response()->json([
                'success' => true,
                'message' => 'Đăng xuất thành công'
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Lỗi khi đăng xuất',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Logout all devices - Xóa tất cả tokens
     */
    public function logoutAllDevices(Request $request)
    {
        try {
            // Xóa tất cả tokens của user
            $request->user()->tokens()->delete();

            return response()->json([
                'success' => true,
                'message' => 'Đăng xuất tất cả thiết bị thành công'
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Lỗi khi đăng xuất',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Admin - Lấy danh sách tất cả users
     */
    public function adminIndex(Request $request)
    {
        try {
            $perPage = $request->input('per_page', 15);
            $search = $request->input('search');
            $role = $request->input('role'); // admin hoặc user
            $sortBy = $request->input('sort_by', 'created_at');
            $sortOrder = $request->input('sort_order', 'desc');

            $query = User::query();

            // Tìm kiếm theo tên, email, phone
            if ($search) {
                $query->where(function($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                      ->orWhere('email', 'like', "%{$search}%")
                      ->orWhere('phone', 'like', "%{$search}%");
                });
            }

            // Lọc theo role
            if ($role) {
                $query->where('role', $role);
            }

            // Sắp xếp
            $query->orderBy($sortBy, $sortOrder);

            $users = $query->paginate($perPage);

            // Format dữ liệu
            $users->getCollection()->transform(function ($user) {
                return [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'phone' => $user->phone,
                    'address' => $user->address,
                    'avatar' => $user->avatar ? Storage::url($user->avatar) : null,
                    'role' => $user->role,
                    'email_verified_at' => $user->email_verified_at ? $user->email_verified_at->format('d/m/Y H:i') : null,
                    'created_at' => $user->created_at->format('d/m/Y H:i'),
                    'total_orders' => $user->orders()->count(),
                    'total_spent' => $user->orders()->where('status', 'completed')->sum('final_total'),
                ];
            });

            return response()->json([
                'success' => true,
                'message' => 'Lấy danh sách user thành công',
                'data' => $users
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Lỗi khi lấy danh sách user',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Admin - Xem chi tiết 1 user
     */
    public function adminShow($id)
    {
        try {
            $user = User::findOrFail($id);

            $totalOrders = $user->orders()->count();
            $completedOrders = $user->orders()->where('status', 'completed')->count();
            $cancelledOrders = $user->orders()->where('status', 'cancelled')->count();
            $totalSpent = $user->orders()->where('status', 'completed')->sum('final_total');
            $totalComments = $user->comments()->count();
            $totalReviews = $user->reviews()->count();

            // Lấy 5 đơn hàng gần nhất
            $recentOrders = $user->orders()
                ->orderBy('created_at', 'desc')
                ->limit(5)
                ->get()
                ->map(function ($order) {
                    return [
                        'id' => $order->id,
                        'order_code' => $order->order_code,
                        'status' => $order->status,
                        'final_total' => $order->final_total,
                        'created_at' => $order->created_at->format('d/m/Y H:i'),
                    ];
                });

            return response()->json([
                'success' => true,
                'message' => 'Lấy thông tin user thành công',
                'data' => [
                    'user' => [
                        'id' => $user->id,
                        'name' => $user->name,
                        'email' => $user->email,
                        'phone' => $user->phone,
                        'address' => $user->address,
                        'avatar' => $user->avatar ? Storage::url($user->avatar) : null,
                        'role' => $user->role,
                        'email_verified_at' => $user->email_verified_at ? $user->email_verified_at->format('d/m/Y H:i') : null,
                        'created_at' => $user->created_at->format('d/m/Y H:i'),
                    ],
                    'statistics' => [
                        'total_orders' => $totalOrders,
                        'completed_orders' => $completedOrders,
                        'cancelled_orders' => $cancelledOrders,
                        'total_spent' => $totalSpent,
                        'total_comments' => $totalComments,
                        'total_reviews' => $totalReviews,
                    ],
                    'recent_orders' => $recentOrders,
                ]
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Lỗi khi lấy thông tin user',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Admin - Xóa user
     */
    public function adminDestroy($id)
    {
        try {
            $user = User::findOrFail($id);

            // Không cho phép xóa chính mình
            if ($user->id === Auth::id()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Không thể xóa tài khoản của chính bạn'
                ], 400);
            }

            // Xóa avatar nếu có
            if ($user->avatar) {
                Storage::disk('public')->delete($user->avatar);
            }

            $user->delete();

            return response()->json([
                'success' => true,
                'message' => 'Xóa user thành công'
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Lỗi khi xóa user',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Admin - Thay đổi role của user
     */
    public function adminChangeRole(Request $request, $id)
    {
        try {
            $user = User::findOrFail($id);

            // Không cho phép thay đổi role của chính mình
            if ($user->id === Auth::id()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Không thể thay đổi role của chính bạn'
                ], 400);
            }

            $validator = Validator::make($request->all(), [
                'role' => 'required|in:admin,user',
            ], [
                'role.required' => 'Vui lòng chọn vai trò',
                'role.in' => 'Vai trò không hợp lệ',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation error',
                    'errors' => $validator->errors()
                ], 422);
            }

            $user->role = $request->role;
            $user->save();

            return response()->json([
                'success' => true,
                'message' => 'Thay đổi role thành công',
                'data' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'role' => $user->role,
                ]
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Lỗi khi thay đổi role',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Admin - Lấy thống kê tổng quan về users
     */
    public function adminStatistics()
    {
        try {
            $totalUsers = User::count();
            $totalAdmins = User::where('role', 'admin')->count();
            $totalCustomers = User::where('role', 'user')->count();
            $verifiedUsers = User::whereNotNull('email_verified_at')->count();
            $unverifiedUsers = User::whereNull('email_verified_at')->count();

            // Top 5 users có tổng chi tiêu cao nhất
            $topSpenders = User::withCount('orders')
                ->withSum(['orders as total_spent' => function($query) {
                    $query->where('status', 'completed');
                }], 'final_total')
                ->orderBy('total_spent', 'desc')
                ->limit(5)
                ->get()
                ->map(function ($user) {
                    return [
                        'id' => $user->id,
                        'name' => $user->name,
                        'email' => $user->email,
                        'avatar' => $user->avatar ? Storage::url($user->avatar) : null,
                        'total_orders' => $user->orders_count,
                        'total_spent' => $user->total_spent ?? 0,
                    ];
                });

            // Top 5 users có nhiều đơn hàng nhất
            $topBuyers = User::withCount('orders')
                ->orderBy('orders_count', 'desc')
                ->limit(5)
                ->get()
                ->map(function ($user) {
                    return [
                        'id' => $user->id,
                        'name' => $user->name,
                        'email' => $user->email,
                        'avatar' => $user->avatar ? Storage::url($user->avatar) : null,
                        'total_orders' => $user->orders_count,
                    ];
                });

            // Users mới đăng ký trong 30 ngày
            $newUsersLast30Days = User::where('created_at', '>=', now()->subDays(30))->count();

            return response()->json([
                'success' => true,
                'message' => 'Lấy thống kê thành công',
                'data' => [
                    'overview' => [
                        'total_users' => $totalUsers,
                        'total_admins' => $totalAdmins,
                        'total_customers' => $totalCustomers,
                        'verified_users' => $verifiedUsers,
                        'unverified_users' => $unverifiedUsers,
                        'new_users_last_30_days' => $newUsersLast30Days,
                    ],
                    'top_spenders' => $topSpenders,
                    'top_buyers' => $topBuyers,
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
