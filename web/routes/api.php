<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\TransactionController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\FriendshipController;
use App\Http\Controllers\SearchController;
use App\Http\Controllers\ReceiptController;
use App\Http\Controllers\ParticipantController;
use App\Http\Controllers\AssignItemController;
use App\Http\Controllers\ReceiptItemController;
use App\Http\Controllers\ProfileController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::post('/register', [AuthController::class, 'sendOtpForRegister'])->middleware('throttle:3,1');
Route::post('/resend-otp', [AuthController::class, 'resendOtp']);
Route::post('/register/verify', [AuthController::class, 'verifyOtpAndRegister']);
Route::post('/login',    [AuthController::class, 'login']);
Route::post('/forgot-pw/request', [AuthController::class, 'requestResetOtp']);
Route::post('/forgot-pw/verify', [AuthController::class, 'verifyResetOtp']);

Route::middleware('auth:sanctum', 'token.expired')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::post('/change-password', [AuthController::class, 'changePassword']);
    Route::get('/profile', [AuthController::class, 'showProfile']);

    Route::apiResource('category', CategoryController::class)->only([
        'index',
        'store',
        'update',
        'destroy'
    ]);
    Route::get('/category/IncomeCategory', [CategoryController::class, 'IncomeCategories']);
    Route::get('/category/ExpenseCategory', [CategoryController::class, 'ExpenseCategories']);

    Route::apiResource('transaction', TransactionController::class)->only([
        'index',
        'store',
        'show',
        'update',
        'destroy'
    ]);

    Route::get('/reports/balance', [ReportController::class, 'balance']);
    Route::get('/reports/daily',    [ReportController::class, 'daily']);
    Route::get('/reports/weekly',   [ReportController::class, 'weekly']);
    Route::get('/reports/monthly',  [ReportController::class, 'monthly']);
    Route::get('/reports/yearly',  [ReportController::class, 'yearly']);
    Route::get('/reports/latest-transaction', [ReportController::class, 'latestTransactions']);
    Route::get('/reports/IncomeHistory', [ReportController::class, 'incomeHistory']);
    Route::get('/reports/ExpenseHistory', [ReportController::class, 'expenseHistory']);
Route::get('/reports/monthly-compare', [ReportController::class, 'monthlyCompare']);


    Route::post('/friend-request', [FriendshipController::class, 'sendRequest']);
    Route::post('/friend-request/respond', [FriendshipController::class, 'respondRequest']);
    Route::get('/friend-requests/incoming', [FriendshipController::class, 'incomingRequests']);
    Route::get('/friends', [FriendshipController::class, 'friends']);
    Route::delete('/friends/{username}', [FriendshipController::class, 'removeFriend']);

    Route::post('/user/profile-picture', [ProfileController::class, 'updateProfilePicture']);

    Route::get('/friends/search', [SearchController::class, 'searchFriends']);
    Route::get('/search', [SearchController::class, 'searchUser']);

    Route::post('/ocr', [ReceiptController::class, 'ocr']);
    Route::post('/saveOcr', [ReceiptController::class, 'saveOcr']);
    Route::put('/receipts/{id}', [ReceiptController::class, 'updateOcr']);
    Route::patch('/receipt-items/{id}', [ReceiptController::class, 'update']);

    Route::get('/receipt-items/{receiptId}', [ReceiptItemController::class, 'showItemsByReceipt']);
    Route::post('/receipt-items', [ReceiptItemController::class, 'store']);
    Route::put('/receipt-items/{id}', [ReceiptItemController::class, 'update']);
    Route::delete('/receipt-items/{id}', [ReceiptItemController::class, 'destroy']);

    Route::get('/receipt/{receipt}/participants', [ParticipantController::class, 'showParticipantsByReceipt']);
    Route::post('/receipt/{receipt}/participants', [ParticipantController::class, 'store']);
    Route::delete('/receipt/{receipt}/participants/{participant}', [ParticipantController::class, 'destroy']);

    Route::post('/receipt/{receipt}/assignments', [AssignItemController::class, 'store']);
    Route::get('/receipts/summary/{receipt}', [ReceiptController::class, 'summary']);
});
