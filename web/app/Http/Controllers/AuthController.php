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
        $data = $request->validate(
            [
                'name'     => 'required|string|max:255',
                'username' => 'required|string|max:255|unique:users,username',
                'phone'    => 'required|string|unique:users',
                'password' => 'required|string|min:6',
            ],
            [
                'phone.unique'    => 'Nomor telepon sudah terdaftar',
                'username.unique' => 'Username sudah digunakan',
                'name.required'   => 'Nama harus diisi',
                'username.required' => 'Username harus diisi',
                'phone.required'  => 'Nomor telepon harus diisi',
                'password.required' => 'Password harus diisi',
                'password.min'    => 'Password minimal 6 karakter',
                'name.max'        => 'Nama maksimal 255 karakter',
            ]
        );

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

        $user->tokens()->latest()->first()->update([
            'expires_at' => now()->addMinutes(60)
        ]);

        return response()->json([
            'message' => 'Login success',
            'user'    => new UserResource($user),
            'token'   => $token,
        ]);
    }

    public function resendOtp(Request $request)
    {
        $request->validate([
            'phone' => 'required|string',
        ]);

        $cachedData = Cache::get('register_' . $request->phone);

        if (!$cachedData) {
            return response()->json([
                'message' => 'Data registrasi tidak ditemukan. Silakan daftar ulang.'
            ], 400);
        }

        $lastOtp = OtpCode::where('phone', $request->phone)
            ->latest()
            ->first();

        if ($lastOtp && $lastOtp->created_at > now()->subMinute()) {
            return response()->json([
                'message' => 'Tunggu sebentar sebelum meminta OTP lagi.'
            ], 429);
        }

        $otp = rand(100000, 999999);

        OtpCode::create([
            'phone' => $request->phone,
            'code' => $otp,
            'expires_at' => now()->addMinutes(5),
        ]);

        Http::post('http://localhost:5000/api/send-otp', [
            'phone' => $request->phone,
            'message' => "Kode OTP Anda untuk registrasi (ulang): $otp"
        ]);

        return response()->json([
            'message' => 'Kode OTP baru berhasil dikirim ke WhatsApp.'
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
                    'message' => 'Akun Tidak Ditemukan'
                ], 401);
            }

            $token = $user->createToken('auth_token')->plainTextToken;

            $user->tokens()->latest()->first()->update([
                'expires_at' => now()->addMinutes(60)
            ]);

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

    public function changePassword(Request $request)
    {
        try {
            $request->validate([
                'current_password'      => 'required|string',
                'new_password'          => 'required|string|min:6|confirmed',
            ], [
                'current_password.required' => 'Password saat ini harus diisi',
                'new_password.required'     => 'Password baru harus diisi',
                'new_password.min'          => 'Password baru minimal 6 karakter',
                'new_password.confirmed'    => 'Konfirmasi password tidak cocok',
            ]);
            $user = $request->user();

            if (!Hash::check($request->current_password, $user->password)) {
                return response()->json([
                    'message' => 'Password saat ini salah'
                ], 422);
            }

            $user->update([
                'password' => bcrypt($request->new_password),
            ]);

            return response()->json([
                'message' => 'Password berhasil diubah'
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

    public function requestResetOtp(Request $request)
    {
        try {
            $data = $request->validate([
                'phone' => 'required|string|exists:users,phone',
            ]);

            $otp = rand(100000, 999999);

            OtpCode::create([
                'phone' => $data['phone'],
                'code' => $otp,
                'expires_at' => now()->addMinutes(5),
            ]);

            Http::post('http://localhost:5000/api/send-otp', [
                'phone' => $data['phone'],
                'message' => "OTP lupa password: $otp"
            ]);

            return response()->json(['message' => 'OTP dikirim.']);
        } catch (\Throwable $e) {
            return response()->json([
                'message'   => $e->getMessage(),
                'exception' => class_basename($e),
                'line'      => $e->getLine(),
                'file'      => $e->getFile(),
            ], 500);
        }
    }

    public function verifyResetOtp(Request $request)
    {
        try {
            $request->validate([
                'phone' => 'required|string',
                'otp'   => 'required|string',
                'password' => 'required|string|min:6|confirmed',
            ]);

            $otp = OtpCode::where('phone', $request->phone)
                ->where('code', $request->otp)
                ->where('is_used', false)
                ->where('expires_at', '>', now())
                ->first();

            if (!$otp) {
                return response()->json(['message' => 'OTP salah atau kadaluarsa'], 400);
            }

            $user = User::where('phone', $request->phone)->first();
            $user->password = bcrypt($request->password);
            $user->save();

            $otp->update(['is_used' => true]);

            return response()->json(['message' => 'Password berhasil direset']);
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
