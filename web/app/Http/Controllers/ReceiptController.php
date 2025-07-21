<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use App\Models\Receipt;
use Illuminate\Support\Facades\Auth;

class ReceiptController extends Controller
{
    public function ocr(Request $request)
    {
        $request->validate([
            'image' => 'required|image|mimes:jpg,jpeg,png|max:2048'
        ]);

        $response = Http::attach(
            'image',
            fopen($request->file('image')->getPathname(), 'r'),
            $request->file('image')->getClientOriginalName()
        )->post('http://localhost:5000/api/ocr/upload');

        if (!$response->successful()) {
            return response()->json(['message' => 'Gagal menghubungi OCR server'], 500);
        }

        $result = $response->json();

        return response()->json([
            'message' => 'Hasil OCR berhasil diambil',
            'data' => $result
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'store_name' => 'required|string',
            'store_address' => 'nullable|string',
            'type' => 'nullable|string',
            'date' => 'required|date',
            'subtotal' => 'nullable|numeric',
            'tax' => 'nullable|numeric',
            'total' => 'required|numeric',
            'cash' => 'nullable|numeric',
            'change' => 'nullable|numeric',
            'items' => 'required|array|min:1',
            'items.*.product' => 'required|string',
            'items.*.price' => 'required|numeric',
            'items.*.quantity' => 'required|numeric',
            'items.*.total' => 'required|numeric',
        ]);

        $receipt = Receipt::create([
            'store_name' => $validated['store_name'],
            'store_address' => $validated['store_address'] ?? null,
            'type' => $validated['type'] ?? null,
            'date' => $validated['date'],
            'subtotal' => $validated['subtotal'] ?? null,
            'tax' => $validated['tax'] ?? null,
            'total' => $validated['total'],
            'cash' => $validated['cash'] ?? null,
            'change' => $validated['change'] ?? null,
            'created_by' => Auth::id(),
        ]);

        foreach ($validated['items'] as $item) {
            $receipt->items()->create([
                'product' => $item['product'],
                'price' => $item['price'],
                'quantity' => $item['quantity'],
                'total' => $item['total'],
            ]);
        }

        return response()->json([
            'message' => 'Receipt berhasil disimpan',
            'data' => $receipt->load('items')
        ], 201);
    }
}
