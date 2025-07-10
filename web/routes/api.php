<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\TransactionController;
use App\Http\Controllers\ReportController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::post('/register', [AuthController::class, 'sendOtpForRegister'])->middleware('throttle:3,1');
Route::post('/register/verify', [AuthController::class, 'verifyOtpAndRegister']);
Route::post('/login',    [AuthController::class, 'login']);

Route::middleware('auth:sanctum', 'token.expired')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);

    Route::apiResource('category', CategoryController::class)->only([
        'index',
        'store',
        'update',
        'destroy'
    ]);

    Route::apiResource('transaction', TransactionController::class)->only([
        'index',
        'store',
        'show',
        'update',
        'destroy'
    ]);

    Route::get('/reports/daily',    [ReportController::class, 'daily']);
    Route::get('/reports/weekly',   [ReportController::class, 'weekly']);
    Route::get('/reports/monthly',  [ReportController::class, 'monthly']);
    Route::get('/reports/yearly',  [ReportController::class, 'yearly']);
});
