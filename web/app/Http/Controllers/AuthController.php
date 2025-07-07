<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\OtpCode;
use Illuminate\Http\Request;
use App\Http\Resources\UserResource;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Cache;

class AuthController extends Controller
{

    public function sendOtpForRegister(Request $request)
    {
        $data = $request->validate([
            'name'     => 'required|string|max:255',
            'username' => 'required|string|max:255',
            'phone'    => 'required|string|unique:users',
            'password' => 'required|string|min:6',
        ]);

        // Simpan sementara selama 10 menit
        Cache::put('register_' . $data['phone'], $data, now()->addMinutes(10));

        // Kirim OTP seperti biasa
        $otp = rand(100000, 999999);
        OtpCode::create([
            'phone' => $data['phone'],
            'code' => $otp,
            'expires_at' => now()->addMinutes(5)
        ]);

        Http::post('http://localhost:5000/api/send-otp', [
            'phone' => $data['phone'],
            'message' => "Kode OTP Anda untuk registrasi: $otp"
        ]);

        return response()->json(['message' => 'OTP dikirim ke WhatsApp']);
    }

    public function verifyOtpAndRegister(Request $request)
    {
        $request->validate([
            'phone' => 'required|string',
            'otp'   => 'required|string',
        ]);

        $otp = OtpCode::where('phone', $request->phone)
            ->where('code', $request->otp)
            ->where('is_used', false)
            ->where('expires_at', '>', now())
            ->first();

        if (!$otp) {
            return response()->json([
                'message' => 'OTP salah atau kadaluarsa'
            ], 400);
        }

        // tandai OTP sebagai sudah dipakai
        $otp->update(['is_used' => true]);

        // Ambil data register sementara dari cache (atau session)
        $data = Cache::get('register_' . $request->phone);

        if (!$data) {
            return response()->json([
                'message' => 'Data registrasi tidak ditemukan, silakan ulangi'
            ], 400);
        }

        // Buat user
        $user = User::create([
            'name'     => $data['name'],
            'username' => $data['username'],
            'phone'    => $data['phone'],
            'password' => bcrypt($data['password']),
        ]);

        Cache::forget('register_' . $request->phone); // bersihkan cache

        // Login user (pakai Sanctum token misalnya)
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Registrasi & verifikasi OTP berhasil',
            'user'    => new UserResource($user),
            'token'   => $token,
        ]);
    }

    public function login(Request $request)
    {
        try {
            $credentials = $request->validate([
                'phone'    => 'required|string',
                'password' => 'required|string',
            ]);

            $user = User::where('phone', $credentials['phone'])->first();

            if (!$user || !Hash::check($credentials['password'], $user->password)) {
                return response()->json([
                    'message' => 'Invalid credentials'
                ], 401);
            }

            $token = $user->createToken('auth_token')->plainTextToken;

            return response()->json([
                'message' => 'Login success',
                'user'    => new UserResource($user),
                'token'   => $token,
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

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Logout success'
        ]);
    }
}
