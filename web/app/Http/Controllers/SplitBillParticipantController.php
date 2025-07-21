<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\SplitBill;
use App\Models\SplitBillParticipant;
use App\Models\User;

class SplitBillParticipantController extends Controller
{
    public function store(Request $request, $splitBillId)
    {
        try {
            $user = Auth::user();

            $splitBill = SplitBill::where('id', $splitBillId)
                ->where('created_by', $user->id)
                ->firstOrFail();

            $data = $request->validate([
                'usernames' => 'required|array|min:1',
                'usernames.*' => 'required|string|exists:users,username',
            ]);

            $friendList = $user->friends;

            $allValidUsers = User::whereIn('username', $data['usernames'])->get();
            $validUserIds = collect();

            foreach ($allValidUsers as $candidate) {
                if ($candidate->id === $user->id || $friendList->contains('id', $candidate->id)) {
                    $validUserIds->push($candidate->id);
                }
            }

            $validUsernames = User::whereIn('id', $validUserIds)->pluck('username')->toArray();
            $invalidUsernames = array_diff($data['usernames'], $validUsernames);

            if (!empty($invalidUsernames)) {
                return response()->json([
                    'message' => 'Anda Tidak Berteman dengan salah satu pengguna',
                    'invalid_usernames' => array_values($invalidUsernames)
                ], 422);
            }


            foreach ($validUserIds as $uid) {
                SplitBillParticipant::firstOrCreate([
                    'split_bill_id' => $splitBill->id,
                    'user_id' => $uid,
                ]);
            }

            return response()->json(['message' => 'Participants added successfully'], 201);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Something went wrong',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
