<?php

namespace App\Http\Controllers;

use App\Models\FriendShip;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\User;

class FriendShipController extends Controller
{
    public function sendRequest(Request $request)
    {
        try {

            $request->validate([
                'friend_username' => 'required|string|exists:users,username',
            ]);

            $friend = User::where('username', $request->friend_username)->first();

            if ($friend->id === $request->user()->id) {
                return response()->json(['message' => 'Tidak bisa mengirim permintaan ke diri sendiri'], 400);
            }

            $exists = Friendship::where('user_id', $request->user()->id)
                ->where('friend_id', $friend->id)
                ->exists();

            if ($exists) {
                return response()->json(['message' => 'Permintaan sudah dikirim sebelumnya'], 400);
            }

            Friendship::create([
                'user_id'   => $request->user()->id,
                'friend_id' => $friend->id,
                'status'    => 'pending',
            ]);

            return response()->json(['message' => 'Permintaan pertemanan dikirim']);
        } catch (\Throwable $e) {
            return response()->json([
                'message'   => $e->getMessage(),
                'exception' => class_basename($e),
                'line'      => $e->getLine(),
                'file'      => $e->getFile(),
            ], 500);
        }
    }

    public function respondRequest(Request $request)
    {
        try {
            $data = $request->validate([
                'username' => 'required|exists:users,username',
                'action'   => 'required|in:accepted,rejected',
            ]);

            $currentUser = $request->user();
            $friend = User::where('username', $data['username'])->first();

            $friendship = Friendship::where('user_id', $friend->id)
                ->where('friend_id', $currentUser->id)
                ->where('status', 'pending')
                ->first();

            if (!$friendship) {
                return response()->json(['message' => 'Friend request not found.'], 404);
            }

            if ($data['action'] === 'accepted') {
                $friendship->update(['status' => 'accepted']);
                return response()->json(['message' => 'Friend request accepted.']);
            }

            if ($data['action'] === 'rejected') {
                $friendship->delete();
                return response()->json(['message' => 'Friend request rejected.']);
            }
        } catch (\Throwable $e) {
            return response()->json([
                'message'   => $e->getMessage(),
                'exception' => class_basename($e),
                'line'      => $e->getLine(),
                'file'      => $e->getFile(),
            ], 500);
        }
    }

    public function incomingRequests(Request $request)
    {
        try {
            $incoming = Friendship::where('friend_id', $request->user()->id)
                ->where('status', 'pending')
                ->with('user:id,username,name')
                ->get();

            return response()->json($incoming);
        } catch (\Throwable $e) {
            return response()->json([
                'message'   => $e->getMessage(),
                'exception' => class_basename($e),
                'line'      => $e->getLine(),
                'file'      => $e->getFile(),
            ], 500);
        }
    }

    public function friends(Request $request)
    {
        try {
            $friends = Friendship::where(function ($query) use ($request) {
                $query->where('user_id', $request->user()->id)
                    ->orWhere('friend_id', $request->user()->id);
            })->where('status', 'accepted')
                ->with(['user:id,name,username', 'friend:id,name,username'])
                ->get();

            return response()->json($friends);
        } catch (\Throwable $e) {
            return response()->json([
                'message'   => $e->getMessage(),
                'exception' => class_basename($e),
                'line'      => $e->getLine(),
                'file'      => $e->getFile(),
            ], 500);
        }
    }

    public function removeFriend($username)
    {
        try {
            $authUser = Auth::user();
            $targetUser = User::where('username', $username)->first();

            if (!$targetUser) {
                return response()->json(['message' => 'User not found.'], 404);
            }

            $friendship = Friendship::where(function ($query) use ($authUser, $targetUser) {
                $query->where('user_id', $authUser->id)
                    ->where('friend_id', $targetUser->id);
            })->orWhere(function ($query) use ($authUser, $targetUser) {
                $query->where('user_id', $targetUser->id)
                    ->where('friend_id', $authUser->id);
            })->first();

            if (!$friendship) {
                return response()->json(['message' => 'Friendship not found.'], 404);
            }

            $friendship->delete();

            return response()->json(['message' => 'Friendship removed successfully.']);
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
