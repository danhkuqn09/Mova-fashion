<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\HomeController;

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
Route::get('/products/{id}', [HomeController::class, 'show']);
Route::get('/products/featured', [HomeController::class, 'featured']);
Route::get('/products/new-arrivals', [HomeController::class, 'newArrivals']);
Route::get('/products/on-sale', [HomeController::class, 'onSale']);
Route::get('/products/category/{categoryId}', [HomeController::class, 'getByCategory']);
Route::get('/products/related/{id}', [HomeController::class, 'getRelated']);
Route::get('/products/search', [HomeController::class, 'search']);
Route::get('/categories', [HomeController::class, 'getCategories']);

// Các route cần đăng nhập bằng Sanctum
Route::middleware('auth:sanctum')->group(function () {
	Route::post('/logout', [AuthController::class, 'logout']);
	Route::post('/change-password', [AuthController::class, 'changePassword']);

	// Test route dành cho admin
	Route::get('/admin/ping', function () {
		return response()->json(['message' => 'pong (admin)']);
	})->middleware('admin');
});