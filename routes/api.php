<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ProductController;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);
Route::post('/reset-password', [AuthController::class, 'resetPassword']);

Route::post('/products', [ProductController::class, 'store']); // route tạo sản phẩm

// Các route cần đăng nhập bằng Sanctum
Route::middleware('auth:sanctum')->group(function () {
	Route::post('/logout', [AuthController::class, 'logout']);
	Route::get('/me', [AuthController::class, 'me']);
	Route::post('/change-password', [AuthController::class, 'changePassword']);

	// Test route dành cho admin
	Route::get('/admin/ping', function () {
		return response()->json(['message' => 'pong (admin)']);
	})->middleware('admin');
});