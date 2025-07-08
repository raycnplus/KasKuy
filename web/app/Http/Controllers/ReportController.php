<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use App\Models\Transaction;
use App\Http\Resources\ReportResource;
use Carbon\Month;

class ReportController extends Controller
{
    public function daily(Request $request)
    {
        try {
            $user = $request->user();
            $today = now()->toDateString();

            $transactions = Transaction::where('user_id', $user->id)
                ->whereDate('date', $today)
                ->get();

            $income = $transactions->where('type', 'income')->sum('amount');
            $expense = $transactions->where('type', 'expense')->sum('amount');

            return new ReportResource([
                'date'          => $today,
                'total_income'  => $income,
                'total_expense' => $expense,
                'transactions'  => $transactions,
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

    public function weekly(Request $request)
    {
        try {
            $user = $request->user();

            $transactions = Transaction::where('user_id', $user->id)
                ->whereBetween('date', [now()->startOfWeek(), now()->endOfWeek()])
                ->get();

            $income = $transactions->where('type', 'income')->sum('amount');
            $expense = $transactions->where('type', 'expense')->sum('amount');

            return new ReportResource([
                'date'          => now()->format('W'), // week number
                'total_income'  => $income,
                'total_expense' => $expense,
                'transactions'  => $transactions,
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

    public function monthly(Request $request)
    {
        try {
            $user = $request->user();
            $month = now()->format('F');

            $transactions = Transaction::where('user_id', $user->id)
                ->whereMonth('date', now()->month)
                ->get();

            $income = $transactions->where('type', 'income')->sum('amount');
            $expense = $transactions->where('type', 'expense')->sum('amount');

            return new ReportResource([
                'date'          => $month,
                'total_income'  => $income,
                'total_expense' => $expense,
                'transactions'  => $transactions,
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


    public function yearly(Request $request)
    {
        try {
            $user = $request->user();
            $year = now()->year;

            $transactions = Transaction::where('user_id', $user->id)
                ->whereYear('date', $year)
                ->get();

            $income = $transactions->where('type', 'income')->sum('amount');
            $expense = $transactions->where('type', 'expense')->sum('amount');

            return new ReportResource([
                'date'          => $year,
                'total_income'  => $income,
                'total_expense' => $expense,
                'transactions'  => $transactions,
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
}
