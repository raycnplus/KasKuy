<?php

namespace App\Http\Controllers;

use App\Models\Transaction;
use Illuminate\Http\Request;
use App\Http\Resources\TransaksiResource;
use Illuminate\Support\Facades\Auth;

class TransaksiController extends Controller
{

    public function index()
    {
        $transactions = Transaction::where('user_id', Auth::id())
            ->latest()
            ->get();

        return TransaksiResource::collection($transactions);
    }

    public function store(Request $request)
    {
        try {
            $data = $request->validate([
                'type'        => 'required|in:Pemasukan,Pengeluaran',
                'amount'      => 'required|numeric',
                'category_id' => 'required|exists:categories,id',
                'description' => 'nullable|string',
                'date'        => 'required|date',
            ]);

            $transaksi = Transaction::create([
                'user_id'     => Auth::id(),
                'type'        => $data['type'],
                'amount'      => $data['amount'],
                'category_id' => $data['category_id'],
                'description' => $data['description'] ?? null,
                'date'        => $data['date'],
            ]);

            return new TransaksiResource($transaksi);
        } catch (\Throwable $e) {
            return response()->json([
                'message'   => $e->getMessage(),
                'exception' => class_basename($e),
                'line'      => $e->getLine(),
                'file'      => $e->getFile(),
            ], 500);
        }
    }

    public function show(Transaction $transaksi)
    {
        if (Auth::id() !== $transaksi->user_id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        return new TransaksiResource($transaksi);
    }

    public function update(Request $request, Transaction $transaksi)
    {
        if ($transaksi->user_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $data = $request->validate([
            'type'        => 'sometimes|required|in:income,expense',
            'amount'      => 'sometimes|required|numeric',
            'category_id' => 'sometimes|required|exists:categories,id',
            'description' => 'nullable|string',
            'date'        => 'sometimes|required|date',
        ]);

        $transaksi->update($data);

        return new TransaksiResource($transaksi);
    }

    public function destroy(Transaction $transaksi)
    {
        if (Auth::id() !== $transaksi->user_id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $transaksi->delete();

        return response()->json(['message' => 'Transaction deleted successfully.']);
    }
}
