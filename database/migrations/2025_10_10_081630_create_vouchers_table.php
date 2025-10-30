<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('vouchers', function (Blueprint $table) {
            $table->id();
            $table->string('code')->unique();
            $table->unsignedTinyInteger('discount_percent');    // Phần trăm giảm giá
            $table->unsignedInteger('quantity');
            $table->unsignedInteger('min_total')->default(0);     // Tổng đơn hàng tối thiểu để áp dụng
            $table->date('start_date')->nullable();              // Ngày bắt đầu
            $table->date('end_date')->nullable();                // Ngày hết hạn
            $table->unsignedInteger('used_count')->default(0);   // Số lần đã dùng
            $table->boolean('is_active')->default(true);         // Trạng thái
            $table->unsignedInteger('max_discount_amount')->nullable(); // Giảm tối đa (VNĐ)
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('vouchers');
    }
};
