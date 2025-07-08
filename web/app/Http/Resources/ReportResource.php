<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ReportResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
       return [
            'date'          => $this['date'],
            'total_income'  => (int) $this['total_income'],
            'total_expense' => (int) $this['total_expense'],
            'transactions'  => TransactionResource::collection($this['transactions']),
        ];
    }
}
