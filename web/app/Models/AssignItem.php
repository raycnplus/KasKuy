<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AssignItem extends Model
{
    protected $fillable = [
        'receipt_item_id',
        'participant_id',
    ];

    public function item()
    {
        return $this->belongsTo(ReceiptItem::class, 'receipt_item_id');
    }

    public function participant()
    {
        return $this->belongsTo(SplitBillParticipant::class, 'participant_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
