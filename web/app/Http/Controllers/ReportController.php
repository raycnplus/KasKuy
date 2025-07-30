<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use App\Models\Transaction;
use App\Http\Resources\ReportResource;
use Carbon\Month;

class ReportController extends Controller
{
    public function balance(Request $request)
    {
        try {
            $user = $request->user();

            $transactions = Transaction::where('user_id', $user->id)->get();

            $totalIncome = $transactions->where('type', 'Pemasukan')->sum('amount');
            $totalExpense = $transactions->where('type', 'Pengeluaran')->sum('amount');

            $balance = $totalIncome - $totalExpense;

            return response()->json([
                'balance'       => $balance,
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


    public function daily(Request $request)
    {
        try {
            $user = $request->user();
            $today = now()->toDateString();

            $transactions = Transaction::where('user_id', $user->id)
                ->whereDate('date', $today)
                ->get();

            $income = $transactions->where('type', 'Pemasukan')->sum('amount');
            $expense = $transactions->where('type', 'Pengeluaran')->sum('amount');

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

            $income = $transactions->where('type', 'Pemasukan')->sum('amount');
            $expense = $transactions->where('type', 'Pengeluaran')->sum('amount');

            return new ReportResource([
                'date'          => now()->format('W'),
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

            $income = $transactions->where('type', 'Pemasukan')->sum('amount');
            $expense = $transactions->where('type', 'Pengeluaran')->sum('amount');

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

            $income = $transactions->where('type', 'Pemasukan')->sum('amount');
            $expense = $transactions->where('type', 'Pengeluaran')->sum('amount');

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

    public function latestTransactions(Request $request)
    {
        try {
            $user = $request->user();

            $transactions = Transaction::where('user_id', $user->id)
                ->orderBy('date', 'desc')
                ->orderBy('created_at', 'desc')
                ->get();

            if ($transactions->isEmpty()) {
                return response()->json([
                    'message' => 'Belum ada transaksi.'
                ], 404);
            }

            return response()->json([
                'total'       => $transactions->count(),
                'transactions' => $transactions
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


    public function incomeHistory(Request $request)
    {
        try {
            $user = $request->user();

            $incomes = Transaction::where('user_id', $user->id)
                ->where('type', 'Pemasukan')
                ->orderBy('date', 'desc')
                ->get();

            return response()->json([
                'type'      => 'Pemasukan',
                'total'     => $incomes->sum('amount'),
                'count'     => $incomes->count(),
                'data'      => $incomes,
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

    public function expenseHistory(Request $request)
    {
        try {
            $user = $request->user();

            $expenses = Transaction::where('user_id', $user->id)
                ->where('type', 'Pengeluaran')
                ->orderBy('date', 'desc')
                ->get();

            return response()->json([
                'type'      => 'Pengeluaran',
                'total'     => $expenses->sum('amount'),
                'count'     => $expenses->count(),
                'data'      => $expenses,
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
