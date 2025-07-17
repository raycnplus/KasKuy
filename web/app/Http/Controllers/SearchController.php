<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Friendship;
use App\Models\User;

class SearchController extends Controller
{
    public function searchFriends(Request $request)
    {
        $query = $request->query('query');
        $authId = Auth::id();

        $friends = Friendship::with('friend')
            ->where('user_id', $authId)
            ->where('status', 'accepted')
            ->whereHas('friend', function ($q) use ($query) {
                $q->where('username', 'like', "%{$query}%");
            })
            ->get()
            ->pluck('friend'); 

        return response()->json([
            'message' => 'Hasil pencarian teman',
            'data' => $friends,
        ]);
    }

    public function searchUser(Request $request)
    {
        $request->validate([
            'query' => 'required|string|min:1',
        ]);

        $currentUserId = $request->user()->id;

        $results = User::where('username', 'like', '%' . $request->query('query') . '%')
            ->where('id', '!=', $currentUserId)
            ->limit(10)
            ->get(['id', 'name', 'username']);

        if ($results->isEmpty()) {
            return response()->json(['message' => 'User tidak ditemukan'], 404);
        }

        return response()->json($results);
    }
}
