<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use App\Models\Receipt;
use Illuminate\Support\Facades\Auth;
use App\Models\ReceiptItem;
use App\Models\SplitBillParticipant;

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

        $receipt = Receipt::create([
            'created_by'    => Auth::id(),
            'store_name'    => $result['store_name'] ?? 'Tanpa Nama Toko',
            'store_address' => $result['store_address'] ?? null,
            'date'          => $result['date'] ?? now(),
            'subtotal'      => $result['subtotal'] ?? null,
            'tax'           => $result['tax'] ?? null,
            'total'         => $result['total'] ?? 0,
            'cash'          => $result['cash'] ?? null,
            'change'        => $result['change'] ?? null,
        ]);

        foreach ($result['items'] ?? [] as $item) {
            ReceiptItem::create([
                'receipt_id' => $receipt->id,
                'product'    => $item['product'] ?? 'Produk Tidak Dikenal',
                'quantity'   => $item['quantity'] ?? 1,
                'price'      => $item['price'] ?? 0,
                'total'      => $item['total'] ?? null,
            ]);
        }

        return response()->json([
            'message' => 'Hasil OCR berhasil disimpan',
            'data' => $receipt->load('items')
        ], 201);
    }


    public function mySplitBills()
    {
        $userId = Auth::id();

        $joinedReceiptIds = SplitBillParticipant::where('user_id', $userId)->pluck('receipt_id');

        $splitBills = Receipt::withCount('items')
            ->where('created_by', $userId)
            ->orWhereIn('id', $joinedReceiptIds)
            ->with(['participants.user'])
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'message' => 'Daftar split bill yang dibuat atau diikuti',
            'data' => $splitBills
        ]);
    }

    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'product' => 'required|string',
            'price' => 'required|numeric',
            'quantity' => 'required|numeric',
            'total' => 'required|numeric',
        ]);

        $item = ReceiptItem::findOrFail($id);

        if ($item->receipt->created_by !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $item->update($validated);

        return response()->json([
            'message' => 'Item berhasil diperbarui.',
            'data' => $item
        ]);
    }

    public function summary($receiptId)
    {
        $receipt = Receipt::with([
            'items.assignment.user',
            'participants.user'
        ])->findOrFail($receiptId);

        if ($receipt->created_by !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $participantTotals = [];

        foreach ($receipt->participants as $participant) {
            $participantTotals[$participant->user_id] = [
                'user' => [
                    'id' => $participant->user->id,
                    'name' => $participant->user->name,
                    'email' => $participant->user->email,
                ],
                'items' => [],
                'items_total' => 0,
                'tax_share' => 0,
                'final_total' => 0,
                'percentage' => 0,
            ];
        }

        foreach ($receipt->items as $item) {
            if ($item->assignment) {
                $userId = $item->assignment->user_id;
                if (isset($participantTotals[$userId])) {
                    $participantTotals[$userId]['items'][] = [
                        'product' => $item->product,
                        'price' => $item->price,
                        'quantity' => $item->quantity,
                        'total' => $item->total,
                    ];
                    $participantTotals[$userId]['items_total'] += $item->total;
                }
            }
        }

        $totalItemValue = array_sum(array_column($participantTotals, 'items_total'));
        $taxTotal = $receipt->tax ?? 0;

        foreach ($participantTotals as $userId => &$data) {
            $portion = $totalItemValue > 0 ? ($data['items_total'] / $totalItemValue) : 0;
            $data['tax_share'] = round($taxTotal * $portion, 2);
            $data['final_total'] = round($data['items_total'] + $data['tax_share'], 2);
            $data['percentage'] = round($portion * 100, 2);
        }

        return response()->json([
            'receipt' => [
                'id' => $receipt->id,
                'store' => $receipt->store_name,
                'date' => $receipt->date,
                'subtotal' => $receipt->subtotal,
                'tax' => $receipt->tax,
                'total' => $receipt->total,
            ],
            'summary' => array_values($participantTotals)
        ]);
    }
}
