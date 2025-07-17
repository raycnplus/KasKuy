<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\SplitBill;
use App\Models\SplitBillItem;


class SplitBillItemController extends Controller
{
    public function store(Request $request, $splitBillId)
    {
        $request->validate([
            'name'     => 'required|string',
            'price'    => 'required|numeric|min:0',
            'quantity' => 'required|integer|min:1',
        ]);

        $splitBill = SplitBill::findOrFail($splitBillId);

        $splitBill->items()->create([
            'name'     => $request->name,
            'price'    => $request->price,
            'quantity' => $request->quantity,
        ]);

        $splitBill->recalculateTotalAmount();

        return response()->json(['message' => 'Item berhasil ditambahkan']);
    }

    public function updateItem(Request $request, $itemId)
    {
        $request->validate([
            'name'     => 'sometimes|string',
            'price'    => 'sometimes|numeric|min:0',
            'quantity' => 'sometimes|integer|min:1',
        ]);

        $item = SplitBillItem::findOrFail($itemId);
        $item->update($request->only('name', 'price', 'quantity'));

        $item->splitBill->recalculateTotalAmount(); 

        return response()->json(['message' => 'Item berhasil diperbarui']);
    }

    public function deleteItem($itemId)
    {
        $item = SplitBillItem::findOrFail($itemId);
        $splitBill = $item->splitBill;

        $item->delete();

        $splitBill->recalculateTotalAmount();

        return response()->json(['message' => 'Item berhasil dihapus']);
    }
}
