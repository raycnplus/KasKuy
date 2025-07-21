<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Receipt extends Model
{
    protected $fillable = [
        'store_name',
        'store_address',
        'date',
        'subtotal',
        'tax',
        'total',
        'cash',
        'change'
    ];

    public function items()
    {
        return $this->hasMany(ReceiptItem::class);
    }
}
