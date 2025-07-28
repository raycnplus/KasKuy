<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\ReceiptItem;
use App\Models\Receipt;
use Illuminate\Support\Facades\Auth;

class ReceiptItemController extends Controller
{
    public function showItemsByReceipt($receiptId)
    {
        $receipt = Receipt::where('id', $receiptId)
            ->where('created_by', Auth::id())
            ->firstOrFail();

        $items = $receipt->items()->with('assignment.user')->get();

        return response()->json([
            'message' => 'Daftar item dalam struk',
            'data' => $items
        ]);
    }


    public function store(Request $request)
    {
        $data = $request->validate([
            'receipt_id' => 'required|exists:receipts,id',
            'product' => 'required|string|max:255',
            'quantity' => 'required|integer|min:1',
            'price' => 'required|numeric|min:0',
            'total' => 'nullable|numeric|min:0',
        ]);

        $item = ReceiptItem::create($data);

        return response()->json([
            'message' => 'Item berhasil ditambahkan',
            'data' => $item
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $item = ReceiptItem::findOrFail($id);

        $data = $request->validate([
            'product' => 'sometimes|string|max:255',
            'quantity' => 'sometimes|integer|min:1',
            'price' => 'sometimes|numeric|min:0',
            'total' => 'nullable|numeric|min:0',
        ]);

        $item->update($data);

        return response()->json([
            'message' => 'Item berhasil diperbarui',
            'data' => $item
        ]);
    }

    public function destroy($id)
    {
        $item = ReceiptItem::findOrFail($id);

        $item->delete();

        return response()->json([
            'message' => 'Item berhasil dihapus'
        ]);
    }
}
