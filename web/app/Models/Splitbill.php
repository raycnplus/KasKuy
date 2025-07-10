<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Splitbill extends Model
{
    use HasFactory;

    protected $fillable = [
        'title', 'description', 'total_amount', 'split_method', 'created_by'
    ];

    public function members()
    {
        return $this->hasMany(SplitBillMember::class);
    }

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}
