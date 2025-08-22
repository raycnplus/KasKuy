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

        $dir = public_path('uploads/profile_pictures');
        if (!is_dir($dir)) {
            mkdir($dir, 0755, true);
        }

        if ($user->profile_picture) {
            $old = $dir . DIRECTORY_SEPARATOR . $user->profile_picture;
            if (file_exists($old)) {
                @unlink($old);
            }
        }

        $file = $request->file('profile_picture');
        $fileName = time() . '_' . uniqid() . '.' . $file->getClientOriginalExtension();
        $file->move($dir, $fileName);

        $user->profile_picture = $fileName;
        $user->save();

        return response()->json([
            'message' => 'Foto profil berhasil diperbarui',
            'profile_picture_url' => url('uploads/profile_pictures/' . $fileName),
        ]);
    }
}
