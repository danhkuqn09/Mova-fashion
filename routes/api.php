<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\HomeController;
use App\Http\Controllers\Api\CartController;
use App\Http\Controllers\Api\VoucherController;
use App\Http\Controllers\Api\OrderController;

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
Route::get('/products', [HomeController::class, 'index']);
Route::get('/products/featured', [HomeController::class, 'featured']);
Route::get('/products/new-arrivals', [HomeController::class, 'newArrivals']);
Route::get('/products/on-sale', [HomeController::class, 'onSale']);
Route::get('/products/search', [HomeController::class, 'search']);
Route::get('/products/category/{categoryId}', [HomeController::class, 'getByCategory']);
Route::get('/products/related/{id}', [HomeController::class, 'getRelated']);
Route::get('/products/{id}', [HomeController::class, 'show']);
Route::get('/categories', [HomeController::class, 'getCategories']);

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
		Route::put('/admin/orders/{id}/status', [OrderController::class, 'updateStatus']);
		Route::delete('/admin/orders/{id}', [OrderController::class, 'destroy']);
	});

	// Test route dành cho admin
	Route::get('/admin/ping', function () {
		return response()->json(['message' => 'pong (admin)']);
	})->middleware('admin');
});

// Voucher routes (Public - Xem danh sách)
Route::get('/vouchers', [VoucherController::class, 'index']);