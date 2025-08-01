<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ReceiptItem extends Model
{
    protected $fillable = [
        'receipt_id',
        'product',
        'quantity',
        'price',
        'total'
    ];

    public function receipt()
    {
        return $this->belongsTo(Receipt::class);
    }

    public function assignment()
    {
        return $this->hasOne(AssignItem::class, 'receipt_item_id');
    }
}
