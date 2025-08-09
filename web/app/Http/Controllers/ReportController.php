<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Transaction;
use App\Http\Resources\ReportResource;
use Carbon\Carbon;

class ReportController extends Controller
{
    public function balance(Request $request)
    {
        try {
            $user = $request->user();
            $month = $request->integer('month');
            $year  = $request->integer('year');

            $query = Transaction::where('user_id', $user->id);
            if ($month) $query->whereMonth('date', (int)$month);
            if ($year)  $query->whereYear('date', (int)$year);

            $transactions = $query->get();
            $totalIncome = $transactions->where('type', 'Pemasukan')->sum('amount');
            $totalExpense = $transactions->where('type', 'Pengeluaran')->sum('amount');
            $balance = $totalIncome - $totalExpense;

            return response()->json(['balance' => $balance]);
        } catch (\Throwable $e) {
            return response()->json([
                'message' => $e->getMessage(),
                'exception' => class_basename($e),
                'line' => $e->getLine(),
                'file' => $e->getFile(),
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
                'date' => $today,
                'total_income' => $income,
                'total_expense' => $expense,
                'transactions' => $transactions,
            ]);
        } catch (\Throwable $e) {
            return response()->json([
                'message' => $e->getMessage(),
                'exception' => class_basename($e),
                'line' => $e->getLine(),
                'file' => $e->getFile(),
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
                'date' => now()->format('W'),
                'total_income' => $income,
                'total_expense' => $expense,
                'transactions' => $transactions,
            ]);
        } catch (\Throwable $e) {
            return response()->json([
                'message' => $e->getMessage(),
                'exception' => class_basename($e),
                'line' => $e->getLine(),
                'file' => $e->getFile(),
            ], 500);
        }
    }

    public function monthly(Request $request)
    {
        try {
            $user = $request->user();
            $month = (int) $request->query('month', now()->month);
            $year  = (int) $request->query('year', now()->year);

            $transactions = Transaction::where('user_id', $user->id)
                ->whereMonth('date', $month)
                ->whereYear('date', $year)
                ->get();

            $income = $transactions->where('type', 'Pemasukan')->sum('amount');
            $expense = $transactions->where('type', 'Pengeluaran')->sum('amount');
            $label = Carbon::create($year, $month, 1)->format('F Y');

            return new ReportResource([
                'date' => $label,
                'total_income' => $income,
                'total_expense' => $expense,
                'transactions' => $transactions,
            ]);
        } catch (\Throwable $e) {
            return response()->json([
                'message' => $e->getMessage(),
                'exception' => class_basename($e),
                'line' => $e->getLine(),
                'file' => $e->getFile(),
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
                'date' => $year,
                'total_income' => $income,
                'total_expense' => $expense,
                'transactions' => $transactions,
            ]);
        } catch (\Throwable $e) {
            return response()->json([
                'message' => $e->getMessage(),
                'exception' => class_basename($e),
                'line' => $e->getLine(),
                'file' => $e->getFile(),
            ], 500);
        }
    }

    public function latestTransactions(Request $request)
    {
        try {
            $user = $request->user();
            $month = $request->integer('month');
            $year  = $request->integer('year');

            $query = Transaction::where('user_id', $user->id);
            if ($month) $query->whereMonth('date', (int)$month);
            if ($year)  $query->whereYear('date', (int)$year);

            $transactions = $query
                ->orderBy('date', 'desc')
                ->orderBy('created_at', 'desc')
                ->get();

            return response()->json([
                'total' => $transactions->count(),
                'transactions' => $transactions
            ]);
        } catch (\Throwable $e) {
            return response()->json([
                'message' => $e->getMessage(),
                'exception' => class_basename($e),
                'line' => $e->getLine(),
                'file' => $e->getFile(),
            ], 500);
        }
    }

    public function monthlyCompare(Request $request)
    {
        try {
            $user = $request->user();
            $month = (int) $request->query('month', now()->month);
            $year  = (int) $request->query('year', now()->year);

            $cur = Transaction::where('user_id', $user->id)
                ->whereMonth('date', $month)
                ->whereYear('date', $year)
                ->get();

            $prevDate = Carbon::create($year, $month, 1)->subMonth();
            $pm = $prevDate->month;
            $py = $prevDate->year;

            $prev = Transaction::where('user_id', $user->id)
                ->whereMonth('date', $pm)
                ->whereYear('date', $py)
                ->get();

            $curIncome = $cur->where('type', 'Pemasukan')->sum('amount');
            $curExpense = $cur->where('type', 'Pengeluaran')->sum('amount');
            $curBalance = $curIncome - $curExpense;

            $prevIncome = $prev->where('type', 'Pemasukan')->sum('amount');
            $prevExpense = $prev->where('type', 'Pengeluaran')->sum('amount');
            $prevBalance = $prevIncome - $prevExpense;

            $pct = function ($now, $old) {
                if ($old == 0) return null;
                return round((($now - $old) / $old) * 100, 1);
            };

            return response()->json([
                'month' => $month,
                'year' => $year,
                'label' => Carbon::create($year, $month, 1)->format('F Y'),
                'current' => [
                    'income' => (float) $curIncome,
                    'expense' => (float) $curExpense,
                    'balance' => (float) $curBalance,
                ],
                'previous' => [
                    'income' => (float) $prevIncome,
                    'expense' => (float) $prevExpense,
                    'balance' => (float) $prevBalance,
                ],
                'change_pct' => [
                    'income' => $pct($curIncome, $prevIncome),
                    'expense' => $pct($curExpense, $prevExpense),
                    'balance' => $pct($curBalance, $prevBalance),
                ],
            ]);
        } catch (\Throwable $e) {
            return response()->json([
                'message' => $e->getMessage(),
                'exception' => class_basename($e),
                'line' => $e->getLine(),
                'file' => $e->getFile(),
            ], 500);
        }
    }
}
