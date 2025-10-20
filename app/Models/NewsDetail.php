<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class NewsDetail extends Model
{
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
