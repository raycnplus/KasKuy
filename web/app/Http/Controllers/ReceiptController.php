<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Receipt;


class ReceiptController extends Controller
{
    public function store(Request $request)
    {
        $data = $request->validate([
            'store_name' => 'required|string',
            'store_address' => 'nullable|string',
            'type' => 'nullable|string',
            'date' => 'required|date',
            'subtotal' => 'nullable|numeric',
            'tax' => 'nullable|numeric',
            'total' => 'required|numeric',
            'cash' => 'nullable|numeric',
            'change' => 'nullable|numeric',
            'items' => 'required|array',
            'items.*.product' => 'required|string',
            'items.*.quantity' => 'required|integer',
            'items.*.price' => 'required|numeric',
            'items.*.total' => 'required|numeric',
        ]);

        $receipt = Receipt::create($data);

        foreach ($data['items'] as $item) {
            $receipt->items()->create($item);
        }

        return response()->json(['message' => 'Receipt berhasil disimpan', 'receipt' => $receipt]);
    }
}
