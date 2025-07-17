<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SplitBillAssignment extends Model
{
    protected $fillable = ['item_id', 'user_id', 'share_amount'];

    public function item()
    {
        return $this->belongsTo(SplitBillItem::class, 'item_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
