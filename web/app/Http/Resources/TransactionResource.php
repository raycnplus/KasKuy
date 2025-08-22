<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TransactionResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id'          => $this->id,
            'type'        => $this->type,
            'amount'      => $this->amount,
            'description' => $this->description,
            'date'        => $this->date,
            'category'    => $this->category ? [
                'id'   => $this->category->id,
                'name' => $this->category->name,
                'icon' => $this->category->icon ?? '📦',
            ] : null,
        ];
    }
}
