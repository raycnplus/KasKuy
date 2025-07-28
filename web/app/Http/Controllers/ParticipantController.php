<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Receipt;
use App\Models\SplitBillParticipant;
use Illuminate\Support\Facades\Auth;
use App\Models\Friendship;

class ParticipantController extends Controller
{
    public function showParticipantsByReceipt($receiptId)
    {

        $receipt = Receipt::where('id', $receiptId)
            ->where('created_by', Auth::id())
            ->firstOrFail();

        $participants = SplitBillParticipant::with('user')
            ->where('receipt_id', $receiptId)
            ->get();

        return response()->json([
            'message' => 'Daftar partisipan split bill',
            'data' => $participants
        ]);
    }


    public function store(Request $request, $receiptId)
    {
        $request->validate([
            'user_id' => 'required|exists:users,id',
        ]);

        $receipt = Receipt::where('id', $receiptId)
            ->where('created_by', Auth::id())
            ->firstOrFail();

        $isFriend = Friendship::where(function ($query) use ($request) {
            $query->where('user_id', Auth::id())
                ->where('friend_id', $request->user_id)
                ->where('status', 'accepted');
        })->orWhere(function ($query) use ($request) {
            $query->where('friend_id', Auth::id())
                ->where('user_id', $request->user_id)
                ->where('status', 'accepted');
        })->exists();

        if (!$isFriend && $request->user_id != Auth::id()) {
            return response()->json([
                'message' => 'Hanya bisa menambahkan teman yang sudah berteman atau diri sendiri.'
            ], 403);
        }

        $exists = SplitBillParticipant::where('receipt_id', $receiptId)
            ->where('user_id', $request->user_id)
            ->exists();

        if ($exists) {
            return response()->json(['message' => 'User sudah menjadi partisipan.'], 409);
        }

        $participant = SplitBillParticipant::create([
            'receipt_id' => $receiptId,
            'user_id' => $request->user_id,
        ]);

        return response()->json(['participant' => $participant->load('user')], 201);
    }

    public function destroy($receiptId, $participantId)
    {
        $participant = SplitBillParticipant::where('id', $participantId)
            ->where('receipt_id', $receiptId)
            ->firstOrFail();

        $receipt = $participant->receipt;

        if ($receipt->created_by !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $participant->delete();

        return response()->json(['message' => 'Partisipan dihapus.']);
    }

}
