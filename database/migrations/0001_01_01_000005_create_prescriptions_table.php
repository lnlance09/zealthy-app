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
        Schema::create('prescriptions', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id');
            $table->unsignedBigInteger('medication_id');
            $table->unsignedBigInteger('dosage_id');
            $table->integer('quantity');
            $table->dateTime('refill_on')->nullable();
            $table->string('refill_schedule');
            $table->timestamps();

            $table->foreign('user_id')->references('id')->on('users');
            $table->foreign('medication_id')->references('id')->on('medications');
            $table->foreign('dosage_id')->references('id')->on('dosages');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('prescriptions');
    }
};
