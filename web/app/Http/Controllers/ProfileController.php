<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ProfileController extends Controller
{
    public function updateProfilePicture(Request $request)
    {
        $request->validate([
            'profile_picture' => 'required|image|mimes:jpeg,png,jpg|max:2048',
        ]);

        $user = Auth::user();

        if ($user->profile_picture && file_exists(public_path('uploads/profile_pictures/' . $user->profile_picture))) {
            unlink(public_path('uploads/profile_pictures/' . $user->profile_picture));
        }

        $file = $request->file('profile_picture');
        $fileName = time() . '_' . uniqid() . '.' . $file->getClientOriginalExtension();
        $file->move(public_path('uploads/profile_pictures'), $fileName);

        $user->profile_picture = $fileName;
        $user->save();

        return response()->json([
            'message' => 'Foto profil berhasil diperbarui',
            'profile_picture_url' => url('uploads/profile_pictures/' . $fileName)
        ]);
    }
}
