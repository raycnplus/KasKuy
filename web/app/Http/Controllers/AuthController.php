<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use App\Http\Resources\UserResource;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        try {
            $data = $request->validate([
                'name'     => 'required|string|max:255',
                'username' => 'required|string|max:255',
                'phone'    => 'required|string|unique:users',
                'password' => 'required|string|min:6',
            ]);

            $user = User::create([
                'name'     => $data['name'],
                'username' => $data['username'],
                'phone'    => $data['phone'],
                'password' => bcrypt($data['password']),
            ]);

            $token = $user->createToken('auth_token')->plainTextToken;

            return response()->json([
                'message' => 'Register success',
                'user'    => new UserResource($user),
                'token'   => $token,
            ], 201);
        } catch (\Throwable $e) {
            return response()->json([
                'message'   => $e->getMessage(),
                'exception' => class_basename($e),
                'line'      => $e->getLine(),
                'file'      => $e->getFile(),
            ], 500);
        }
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
