<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Carbon\Carbon;
use App\Models\Transaction;
use App\Http\Resources\ReportResource;

class ReportController extends Controller
{

    private function generateReportPayload($transactions, array $meta = [])
    {
        $income = $transactions->where('type', 'Pemasukan')->sum('amount');
        $expense = $transactions->where('type', 'Pengeluaran')->sum('amount');

        $base = [
            'total_income'  => $income,
            'total_expense' => $expense,
            'transactions'  => $transactions,
        ];

        return array_merge($meta, $base);
    }

    public function balance(Request $request)
    {
        try {
            $user = $request->user();

            $transactions = Transaction::where('user_id', $user->id)->get();

            $totalIncome = $transactions->where('type', 'Pemasukan')->sum('amount');
            $totalExpense = $transactions->where('type', 'Pengeluaran')->sum('amount');

            $balance = $totalIncome - $totalExpense;

            return response()->json([
                'balance' => $balance,
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
            $today = Carbon::now()->toDateString();

            $transactions = Transaction::where('user_id', $user->id)
                ->whereDate('date', $today)
                ->get(['id', 'title', 'type', 'amount', 'date', 'description']);

            $payload = $this->generateReportPayload($transactions, [
                'date' => $today,
            ]);

            return new ReportResource($payload);
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

            $startOfWeek = Carbon::now()->startOfWeek();
            $endOfWeek = Carbon::now()->endOfWeek();

            $transactions = Transaction::where('user_id', $user->id)
                ->whereBetween('date', [$startOfWeek->toDateString(), $endOfWeek->toDateString()])
                ->get(['id', 'title', 'type', 'amount', 'date', 'description']);

            $payload = $this->generateReportPayload($transactions, [
                'date_range' => $startOfWeek->toDateString() . ' - ' . $endOfWeek->toDateString(),
            ]);

            return new ReportResource($payload);
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
            $monthName = Carbon::now()->format('F');
            $monthNumber = Carbon::now()->month;

            $transactions = Transaction::where('user_id', $user->id)
                ->whereMonth('date', $monthNumber)
                ->get(['id', 'title', 'type', 'amount', 'date', 'description']);

            $payload = $this->generateReportPayload($transactions, [
                'date' => $monthName,
            ]);

            return new ReportResource($payload);
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
            $year = Carbon::now()->year;

            $transactions = Transaction::where('user_id', $user->id)
                ->whereYear('date', $year)
                ->get(['id', 'title', 'type', 'amount', 'date', 'description']);

            $payload = $this->generateReportPayload($transactions, [
                'date' => $year,
            ]);

            return new ReportResource($payload);
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
        $month = $request->integer('month');
        $year  = $request->integer('year');

        $query = Transaction::where('user_id', $user->id);
        if ($month) $query->whereMonth('date', (int)$month);
        if ($year)  $query->whereYear('date', (int)$year);

        $transactions = $query
            ->with(['category:id,name,icon'])
            ->orderBy('date', 'desc')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'total' => $transactions->count(),
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

    public function incomeHistory(Request $request)
    {
        try {
            $user = $request->user();

            $incomes = Transaction::where('user_id', $user->id)
                ->where('type', 'Pemasukan')
                ->orderBy('date', 'desc')
                ->get(['id', 'title', 'type', 'amount', 'date', 'description']);

            return response()->json([
                'type'  => 'Pemasukan',
                'total' => $incomes->sum('amount'),
                'count' => $incomes->count(),
                'data'  => $incomes,
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
                ->get(['id', 'title', 'type', 'amount', 'date', 'description']);

            return response()->json([
                'type'  => 'Pengeluaran',
                'total' => $expenses->sum('amount'),
                'count' => $expenses->count(),
                'data'  => $expenses,
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

    public function monthlyCompare(Request $request)
    {
        $user = $request->user();
        $month = (int) $request->query('month', now()->month);
        $year  = (int) $request->query('year', now()->year);

        $cur = Transaction::where('user_id', $user->id)
            ->whereMonth('date', $month)
            ->whereYear('date', $year)
            ->get();

        $prevDate = Carbon::create($year, $month, 1)->subMonth();
        $pm = $prevDate->month; $py = $prevDate->year;

        $prev = Transaction::where('user_id', $user->id)
            ->whereMonth('date', $pm)
            ->whereYear('date', $py)
            ->get();

        $curIncome = (float) $cur->where('type', 'Pemasukan')->sum('amount');
        $curExpense = (float) $cur->where('type', 'Pengeluaran')->sum('amount');
        $curBalance = $curIncome - $curExpense;

        $prevIncome = (float) $prev->where('type', 'Pemasukan')->sum('amount');
        $prevExpense = (float) $prev->where('type', 'Pengeluaran')->sum('amount');
        $prevBalance = $prevIncome - $prevExpense;

        $pct = fn($now, $old) => $old == 0 ? null : round((($now - $old) / $old) * 100, 1);

        return response()->json([
            'month' => $month,
            'year' => $year,
            'label' => Carbon::create($year, $month, 1)->format('F Y'),
            'current' => [
                'income' => $curIncome,
                'expense' => $curExpense,
                'balance' => $curBalance,
            ],
            'previous' => [
                'income' => $prevIncome,
                'expense' => $prevExpense,
                'balance' => $prevBalance,
            ],
            'change_pct' => [
                'income' => $pct($curIncome, $prevIncome),
                'expense' => $pct($curExpense, $prevExpense),
                'balance' => $pct($curBalance, $prevBalance),
            ],
        ]);
    }
}
