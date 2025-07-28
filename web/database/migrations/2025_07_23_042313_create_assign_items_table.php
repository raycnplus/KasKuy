<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('assign_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('receipt_item_id')->constrained('receipt_items')->onDelete('cascade');
            $table->foreignId('participant_id')->constrained('split_bill_participants')->onDelete('cascade');
            $table->timestamps();

            $table->unique('receipt_item_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('assign_items');
    }
};
