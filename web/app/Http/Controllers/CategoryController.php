<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;
use App\Http\Resources\CategoryResource;
use Illuminate\Support\Facades\Auth;

class CategoryController extends Controller
{
    public function index()
    {
        $categories = Category::where('user_id', Auth::id())->get();

        return CategoryResource::collection($categories);
    }

    public function store(Request $request)
    {
        try {
            $data = $request->validate([
                'name' => 'required|string|max:255',
                'icon' => 'required',
                'type' => 'required|in:Pemasukan,Pengeluaran',
                'priority' => 'required|in:Low,Medium,High'
            ]);

            $category = Category::create([
                'user_id' => Auth::id(),
                'name'    => $data['name'],
                'icon'    => $data['icon'],
                'type'  => $data['type'],
                'priority' => $data['priority']
            ]);

            return new CategoryResource($category);
        } catch (\Throwable $e) {
            return response()->json([
                'message'   => $e->getMessage(),
                'exception' => class_basename($e),
                'line'      => $e->getLine(),
                'file'      => $e->getFile(),
            ], 500);
        }
    }

    public function update(Request $request, Category $category)
    {
        try {
            if ($category->user_id !== Auth::id()) {
                return response()->json(['message' => 'Unauthorized'], 403);
            }

            $data = $request->validate([
                'name' => 'sometimes|required|string|max:255',
                'type' => 'sometimes|required|in:Pemasukan,Pengeluaran',
                'icon' => 'sometimes|required',
                'priority' => 'sometimes|required|in:Low,Medium,High'
            ]);

            $category->update($data);

            return new CategoryResource($category);
        } catch (\Throwable $e) {
            return response()->json([
                'message'   => $e->getMessage(),
                'exception' => class_basename($e),
                'line'      => $e->getLine(),
                'file'      => $e->getFile(),
            ], 500);
        }
    }

    public function destroy(Category $category)
    {
        if ($category->user_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $category->delete();

        return response()->json(['message' => 'Category deleted.']);
    }

    public function IncomeCategories()
    {
        $userId = Auth::id();

        $pemasukan = Category::where('user_id', $userId)
            ->where('type', 'Pemasukan')
            ->get();

        if ($pemasukan->isEmpty()) {
            return response()->json(['message' => 'Anda tidak memiliki kategori pemasukan.'], 404);
        }

        return response()->json([
            'Pemasukan' => CategoryResource::collection($pemasukan),
        ]);
    }

    public function ExpenseCategories()
    {
        $userId = Auth::id();

        $pengeluaran = Category::where('user_id', $userId)
            ->where('type', 'Pengeluaran')
            ->get();

        if ($pengeluaran->isEmpty()) {
            return response()->json(['message' => 'Anda tidak memiliki kategori pengeluaran.'], 404);
        }

        return response()->json([
            'Pengeluaran' => CategoryResource::collection($pengeluaran),
        ]);
    }
}
