<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use App\Models\Transaction;
use App\Http\Resources\ReportResource;


class ReportController extends Controller
{
    public function daily(Request $request)
    {
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
    }

    public function weekly(Request $request)
    {
        $user = $request->user();
        $today = now()->toDateString();

        $transactions = Transaction::where('user_id', $user->id)
            ->whereBetween('date', [Carbon::now()->startOfWeek(), Carbon::now()->endOfWeek()])
            ->get();

        $income = $transactions->where('type', 'income')->sum('amount');
        $expense = $transactions->where('type', 'expense')->sum('amount');

        return new ReportResource([
            'date'          => $today,
            'total_income'  => $income,
            'total_expense' => $expense,
            'transactions'  => $transactions,
        ]);
    }

    public function monthly(Request $request)
    {
        $user = $request->user();
        $today = now()->toDateString();

        $transactions = Transaction::where('user_id', $user->id)
            ->whereMonth('date', Carbon::now()->month)
            ->get();

        $income = $transactions->where('type', 'income')->sum('amount');
        $expense = $transactions->where('type', 'expense')->sum('amount');

        return new ReportResource([
            'date'          => $today,
            'total_income'  => $income,
            'total_expense' => $expense,
            'transactions'  => $transactions,
        ]);
    }
}
