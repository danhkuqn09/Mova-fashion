<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class NewDetail extends Model
{
    protected $table = 'new_details'; // Chỉ định tên bảng là new_details
    
    protected $fillable = [
        'news_id',
        'content',
        'image',
    ];

    public function news(): BelongsTo
    {
        return $this->belongsTo(News::class);
    }
}
