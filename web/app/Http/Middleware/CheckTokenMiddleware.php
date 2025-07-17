<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class CheckTokenMiddleware
{
    public function handle(Request $request, Closure $next)
    {
        $token = $request->bearerToken();

        if (!$token) {
            return $next($request);
        }

        $tokenModel = \Laravel\Sanctum\PersonalAccessToken::findToken($token);

        if ($tokenModel && $tokenModel->expires_at && $tokenModel->expires_at->isPast()) {
            $tokenModel->delete();

            return response()->json([
                'message' => 'Token has expired. Please login again.'
            ], 401);
        }

        return $next($request);
    }
}
