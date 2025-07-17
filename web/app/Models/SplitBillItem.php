<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SplitBillItem extends Model
{
    protected $fillable = ['split_bill_id', 'name', 'price', 'quantity'];

    public function splitBill()
    {
        return $this->belongsTo(SplitBill::class);
    }

    public function assignments()
    {
        return $this->hasMany(SplitBillAssignment::class, 'item_id');
    }
}
