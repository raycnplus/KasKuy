<?php

namespace App\Http\Controllers;

use App\Models\Transaction;
use Illuminate\Http\Request;
use App\Http\Resources\TransactionResource;
use Illuminate\Support\Facades\Auth;

class TransactionController extends Controller
{
    public function index()
    {
        $transactions = Transaction::with('category') // biar langsung ambil kategori
            ->where('user_id', Auth::id())
            ->latest()
            ->get();

        return TransactionResource::collection($transactions);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'type'        => 'required|in:Pemasukan,Pengeluaran',
            'amount'      => 'required|numeric',
            'category_id' => 'required|exists:categories,id',
            'description' => 'nullable|string',
            'date'        => 'required|date',
        ]);

        $transaction = Transaction::create([
            'user_id'     => Auth::id(),
            'type'        => $data['type'],
            'amount'      => $data['amount'],
            'category_id' => $data['category_id'],
            'description' => $data['description'] ?? null,
            'date'        => $data['date'],
        ]);

        return new TransactionResource($transaction);
    }

    public function show(Transaction $transaction)
    {
        if ($transaction->user_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        return new TransactionResource($transaction->load('category'));
    }

    public function update(Request $request, Transaction $transaction)
    {
        if ($transaction->user_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $data = $request->validate([
            'type'        => 'sometimes|required|in:Pemasukan,Pengeluaran',
            'amount'      => 'sometimes|required|numeric',
            'category_id' => 'sometimes|required|exists:categories,id',
            'description' => 'nullable|string',
            'date'        => 'sometimes|required|date',
        ]);

        $transaction->update($data);

        return new TransactionResource($transaction->load('category'));
    }

    public function destroy(Transaction $transaction)
    {
        if ($transaction->user_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $transaction->delete();

        return response()->json(['message' => 'Transaction deleted successfully.']);
    }
}
