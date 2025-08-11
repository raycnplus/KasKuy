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

            $transactions = Transaction::where('user_id', $user->id)
                ->orderBy('date', 'desc')
                ->orderBy('created_at', 'desc')
                ->get(['id', 'title', 'type', 'amount', 'date', 'description', 'created_at']);

            if ($transactions->isEmpty()) {
                return response()->json([
                    'message' => 'Belum ada transaksi.'
                ], 404);
            }

            return response()->json([
                'total'        => $transactions->count(),
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
}
