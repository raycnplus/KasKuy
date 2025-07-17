<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\SplitBill;
use App\Models\SplitBillParticipant;

class SplitBillParticipantController extends Controller
{
    public function store(Request $request, $splitBillId)
    {
        try {
            $splitBill = SplitBill::where('id', $splitBillId)
                ->where('created_by', Auth::id())
                ->firstOrFail();

            $data = $request->validate([
                'usernames' => 'required|array|min:1',
                'usernames.*' => 'required|string|exists:users,username',
            ]);

            $userIds = \App\Models\User::whereIn('username', $data['usernames'])->pluck('id');

            foreach ($userIds as $userId) {
                SplitBillParticipant::firstOrCreate([
                    'split_bill_id' => $splitBill->id,
                    'user_id'       => $userId,
                ]);
            }

            return response()->json([
                'message' => 'Teman berhasil ditambahkan ke split bill.',
                'participants' => SplitBillParticipant::with('user')->where('split_bill_id', $splitBill->id)->get(),
            ]);

        } catch (\Throwable $e) {
            return response()->json([
                'message'   => $e->getMessage(),
                'exception' => class_basename($e),
                'line'      => $e->getLine(),
                'file'      => $e->getFile(),
            ], 500);
        }
    }
}
