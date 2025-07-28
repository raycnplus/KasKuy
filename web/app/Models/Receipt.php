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
        'change',
        'created_by'
    ];

    public function items()
    {
        return $this->hasMany(ReceiptItem::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function participants()
    {
        return $this->hasMany(SplitBillParticipant::class, 'receipt_id');
    }
}
