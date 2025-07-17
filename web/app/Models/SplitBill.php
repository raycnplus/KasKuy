<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class SplitBill extends Model
{
    protected $fillable = ['title', 'total_amount', 'created_by'];

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function items()
    {
        return $this->hasMany(SplitBillItem::class);
    }

    public function participants()
    {
        return $this->hasMany(SplitBillParticipant::class);
    }

    public function recalculateTotalAmount()
    {
        $total = $this->items()->sum(DB::raw('price * quantity'));
        $this->update(['total_amount' => $total]);
    }
}
