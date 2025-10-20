<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Voucher extends Model
{
    protected $fillable = [
        'code',
        'discount_percent',
        'quantity',
        'min_total',
    ];

    protected $casts = [
        'discount_percent' => 'integer',
        'quantity' => 'integer',
        'min_total' => 'integer',
    ];
}
