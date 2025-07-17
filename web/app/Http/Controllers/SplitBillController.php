<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\SplitBill;

class SplitBillController extends Controller
{
    public function store(Request $request)
    {
        $data = $request->validate([
            'title' => 'required|string|max:255',
            'notes' => 'nullable|string',
        ]);

        $splitBill = SplitBill::create([
            'created_by'   => Auth::id(),
            'title'        => $data['title'],
            'total_amount' => 0, 
        ]);

        return response()->json([
            'message'     => 'Split bill created successfully.',
            'split_bill'  => $splitBill
        ], 201);
    }

    public function summary($splitBillId)
    {
        $splitBill = SplitBill::with([
            'items.assignments.user',
            'participants.user'
        ])->findOrFail($splitBillId);

        if ($splitBill->created_by !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $summary = $splitBill->participants->map(function ($participant) use ($splitBill) {
            $total = 0;

            foreach ($splitBill->items as $item) {
                foreach ($item->assignments as $assignment) {
                    if ($assignment->user_id === $participant->user_id) {
                        $total += $assignment->share_amount;
                    }
                }
            }

            return [
                'user'  => $participant->user->username,
                'total' => round($total, 2)
            ];
        });

        return response()->json([
            'title'        => $splitBill->title,
            'total_amount' => $splitBill->total_amount,
            'summary'      => $summary
        ]);
    }
}
