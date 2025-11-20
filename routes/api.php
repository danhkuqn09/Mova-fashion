<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\HomeController;
use App\Http\Controllers\Api\CartController;
use App\Http\Controllers\Api\VoucherController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\ReviewController;
use App\Http\Controllers\Api\NewController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\CommentController;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/verify-otp', [AuthController::class, 'verifyOtp']);
Route::post('/resend-otp', [AuthController::class, 'resendOtp']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);
Route::post('/reset-password', [AuthController::class, 'resetPassword']);

// Google OAuth routes
Route::get('/auth/google', [AuthController::class, 'redirectToGoogle']);
Route::get('/auth/google/callback', [AuthController::class, 'handleGoogleCallback']);

// Trang chủ và Route sản phẩm public
Route::get('/home', [HomeController::class, 'index']);


Route::get('/products/featured', [HomeController::class, 'featured']);
Route::get('/products/new-arrivals', [HomeController::class, 'newArrivals']);
Route::get('/products/on-sale', [HomeController::class, 'onSale']);
Route::get('/products/search', [HomeController::class, 'search']);
Route::get('/products/category/{categoryId}', [HomeController::class, 'getByCategory']);
Route::get('/products/related/{id}', [HomeController::class, 'getRelated']);
Route::get('/categories', [HomeController::class, 'getCategories']);

// Route sản phẩm
Route::get('/products', [ProductController::class, 'index']);
Route::get('/products/{id}', [ProductController::class, 'show']);



// Review routes (Public - Xem review)
Route::get('/reviews', [ReviewController::class, 'index']);

// News routes (Public - Xem bài viết)
Route::get('/news', [NewController::class, 'index']);
Route::get('/news/{id}', [NewController::class, 'show']);

// Category routes (Public)
Route::get('/categories', [CategoryController::class, 'index']);
Route::get('/categories/{id}', [CategoryController::class, 'show']);

// Comment routes (Public - Xem bình luận sản phẩm)
Route::get('/products/{productId}/comments', [CommentController::class, 'index']);

// Momo callbacks (Public - Momo gọi trực tiếp)
Route::post('/momo/notify', [OrderController::class, 'momoNotify']); // IPN URL
Route::get('/momo/callback', [OrderController::class, 'momoCallback']); // Return URL

// PayOS callbacks (Public - PayOS gọi trực tiếp)
Route::post('/payos/webhook', [OrderController::class, 'payosWebhook']); // Webhook URL
Route::get('/payos/return', [OrderController::class, 'payosReturn']); // Return URL

// Các route cần đăng nhập bằng Sanctum
Route::middleware('auth:sanctum')->group(function () {
	Route::post('/logout', [AuthController::class, 'logout']);
	Route::post('/change-password', [AuthController::class, 'changePassword']);

	// Cart routes
	Route::get('/cart', [CartController::class, 'index']);
	Route::post('/cart', [CartController::class, 'store']);
	Route::put('/cart/{id}', [CartController::class, 'update']);
	Route::delete('/cart/{id}', [CartController::class, 'destroy']);
	Route::delete('/cart-clear', [CartController::class, 'clear']);
	Route::get('/cart/count', [CartController::class, 'count']);

	// Voucher routes (User - Check và áp dụng)
	Route::post('/vouchers/check', [VoucherController::class, 'checkVoucher']);
	Route::get('/vouchers/available', [VoucherController::class, 'getAvailableVouchers']);

	// Order routes (User)
	Route::get('/orders', [OrderController::class, 'index']);
	Route::post('/orders', [OrderController::class, 'store']);
	Route::get('/orders/statistics', [OrderController::class, 'getStatistics']);
	Route::get('/orders/{id}', [OrderController::class, 'show']);
	Route::post('/orders/{id}/cancel', [OrderController::class, 'cancel']);
	Route::get('/orders/{id}/payment-status', [OrderController::class, 'checkPaymentStatus']);

	// Review routes (User)
	Route::get('/reviews/my-reviews', [ReviewController::class, 'myReviews']);
	Route::post('/reviews', [ReviewController::class, 'store']);
	Route::get('/reviews/{id}', [ReviewController::class, 'show']);
	Route::delete('/reviews/{id}', [ReviewController::class, 'destroy']);

	// News routes (User - Quản lý bài viết của mình)
	Route::get('/news/my-news', [NewController::class, 'myNews']);
	Route::post('/news', [NewController::class, 'store']);
	Route::put('/news/{id}', [NewController::class, 'update']);
	Route::delete('/news/{id}', [NewController::class, 'destroy']);
	Route::post('/news/{id}/submit', [NewController::class, 'submitForReview']);

	// Comment routes (User - Quản lý bình luận)
	Route::post('/comments', [CommentController::class, 'store']);
	Route::put('/comments/{id}', [CommentController::class, 'update']);
	Route::delete('/comments/{id}', [CommentController::class, 'destroy']);
	Route::get('/my-comments', [CommentController::class, 'myComments']);

	// Admin routes
	Route::middleware('admin')->group(function () {
		//  Quản lí Voucher
		Route::get('/admin/vouchers', [VoucherController::class, 'adminIndex']);
		Route::post('/admin/vouchers', [VoucherController::class, 'store']);
		Route::put('/admin/vouchers/{id}', [VoucherController::class, 'update']);
		Route::delete('/admin/vouchers/{id}', [VoucherController::class, 'destroy']);
		Route::post('/admin/vouchers/{id}/toggle-status', [VoucherController::class, 'toggleStatus']);

		// Quản lí Order
		Route::get('/admin/orders', [OrderController::class, 'adminIndex']);
		Route::get('/admin/orders/statistics', [OrderController::class, 'adminStatistics']);
		Route::get('/admin/orders/{id}', [OrderController::class, 'adminShowOrder']);
		Route::put('/admin/orders/{id}/status', [OrderController::class, 'updateStatus']);
		Route::delete('/admin/orders/{id}', [OrderController::class, 'destroy']);

		// Quản lí Review (Admin - READ ONLY)
		Route::get('/admin/reviews', [ReviewController::class, 'adminIndex']);
		Route::get('/admin/reviews/statistics', [ReviewController::class, 'adminStatistics']);

		// Quản lí News (Admin - Duyệt bài viết)
		Route::get('/admin/news', [NewController::class, 'adminIndex']);
		Route::post('/admin/news/{id}/approve', [NewController::class, 'approve']);
		Route::post('/admin/news/{id}/reject', [NewController::class, 'reject']);

		// Quản lí Category (Admin)
		Route::post('/admin/categories', [CategoryController::class, 'store']);
		Route::put('/admin/categories/{id}', [CategoryController::class, 'update']);
		Route::delete('/admin/categories/{id}', [CategoryController::class, 'destroy']);

		// Quản lí Product (Admin)
		Route::post('/admin/products', [ProductController::class, 'store']);
		Route::put('/admin/products/{id}', [ProductController::class, 'update']);
		Route::delete('/admin/products/{id}', [ProductController::class, 'destroy']);
		Route::put('/admin/products/variants/{variantId}/stock', [ProductController::class, 'updateVariantStock']);

		// Quản lí Comment (Admin)
		Route::get('/admin/comments', [CommentController::class, 'adminIndex']);
		Route::delete('/admin/comments/{id}', [CommentController::class, 'adminDestroy']);
	});
});

// Voucher routes (Public - Xem danh sách)
Route::get('/vouchers', [VoucherController::class, 'index']);