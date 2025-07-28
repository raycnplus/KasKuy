<?php

namespace App\Http\Controllers;

use App\Models\Receipt;
use App\Models\ReceiptItem;
use App\Models\SplitBillParticipant;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\AssignItem;

class AssignItemController extends Controller
{
    public function showAssignmentsByReceipt($receiptId)
    {
        $receipt = Receipt::where('id', $receiptId)
            ->where('created_by', Auth::id())
            ->firstOrFail();

        $assignments = AssignItem::with([
            'receiptItem',
            'participant.user'
        ])->whereIn('receipt_item_id', function ($query) use ($receiptId) {
            $query->select('id')
                ->from('receipt_items')
                ->where('receipt_id', $receiptId);
        })->get();

        return response()->json([
            'message' => 'Daftar assignment untuk struk ini',
            'data' => $assignments
        ]);
    }


    public function store(Request $request, $receiptId)
    {
        $request->validate([
            'assignments' => 'required|array',
            'assignments.*.item_id' => 'required|exists:receipt_items,id',
            'assignments.*.participant_id' => 'required|exists:split_bill_participants,id',
        ]);

        $receipt = Receipt::where('id', $receiptId)
            ->where('created_by', Auth::id())
            ->firstOrFail();

        foreach ($request->assignments as $data) {
            $item = ReceiptItem::where('id', $data['item_id'])
                ->where('receipt_id', $receiptId)
                ->firstOrFail();

            $participant = SplitBillParticipant::where('id', $data['participant_id'])
                ->where('receipt_id', $receiptId)
                ->firstOrFail();

            AssignItem::updateOrCreate(
                [
                    'receipt_item_id' => $item->id,
                ],
                [
                    'participant_id' => $participant->id,
                ]
            );
        }

        return response()->json(['message' => 'Item berhasil di-assign.']);
    }

    public function update(Request $request, $id)
    {
        $assignment = AssignItem::findOrFail($id);

        $request->validate([
            'participant_id' => 'required|exists:split_bill_participants,id',
        ]);

        $participant = SplitBillParticipant::where('id', $request->participant_id)->firstOrFail();

        $receiptItem = ReceiptItem::findOrFail($assignment->receipt_item_id);
        $receiptId = $receiptItem->receipt_id;

        $receipt = Receipt::where('id', $receiptId)
            ->where('created_by', Auth::id())
            ->firstOrFail();

        if ($participant->receipt_id != $receiptId) {
            return response()->json(['message' => 'Participant tidak sesuai dengan struk'], 422);
        }

        $assignment->update([
            'participant_id' => $request->participant_id
        ]);

        return response()->json([
            'message' => 'Assignment berhasil diperbarui',
            'data' => $assignment->load('participant.user')
        ]);
    }

    public function destroy($id)
    {
        $assignment = AssignItem::findOrFail($id);

        $receiptItem = ReceiptItem::findOrFail($assignment->receipt_item_id);
        $receipt = Receipt::where('id', $receiptItem->receipt_id)
            ->where('created_by', Auth::id())
            ->firstOrFail();

        $assignment->delete();

        return response()->json([
            'message' => 'Assignment berhasil dihapus'
        ]);
    }
}
