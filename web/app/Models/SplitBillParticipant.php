<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SplitBillParticipant extends Model
{
    protected $fillable = ['split_bill_id', 'user_id', 'total_share'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function splitBill()
    {
        return $this->belongsTo(SplitBill::class);
    }
}
