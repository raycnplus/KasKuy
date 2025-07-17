<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\SplitBillItem;
use App\Models\SplitBillAssignment;
use App\Models\User;

class SplitBillAssignmentController extends Controller
{
    public function assign(Request $request, $itemId)
    {
        $data = $request->validate([
            'assignments' => 'required|array|min:1',
            'assignments.*.item_id' => 'required|exists:split_bill_items,id',
            'assignments.*.usernames' => 'required|array|min:1',
            'assignments.*.usernames.*' => 'required|string|exists:users,username',
        ]);

        foreach ($data['assignments'] as $assignment) {
            $item = SplitBillItem::findOrFail($assignment['item_id']);
            $splitBill = $item->splitBill;

            if ($splitBill->created_by !== Auth::id()) {
                return response()->json(['message' => 'Unauthorized'], 403);
            }

            SplitBillAssignment::where('item_id', $item->id)->delete();

            $userIds = User::whereIn('username', $assignment['usernames'])->pluck('id');
            $shareAmount = ($item->price * $item->quantity) / max(count($userIds), 1);

            foreach ($userIds as $userId) {
                SplitBillAssignment::create([
                    'item_id'      => $item->id,
                    'user_id'      => $userId,
                    'share_amount' => round($shareAmount, 2),
                ]);
            }
        }

        return response()->json(['message' => 'Semua item berhasil di-assign.']);
    }
}
