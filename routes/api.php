<?php

use App\Http\Controllers\AppointmentController;
use App\Http\Controllers\DosageController;
use App\Http\Controllers\MedicationController;
use App\Http\Controllers\PrescriptionController;
use App\Http\Controllers\ProviderController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::get('/dosage', [DosageController::class, 'index']);
Route::get('/medication', [MedicationController::class, 'index']);
Route::get('/provider', [ProviderController::class, 'index']);

Route::post('/prescription/create', [PrescriptionController::class, 'create']);
Route::put('/prescription/update', [PrescriptionController::class, 'edit']);
Route::delete('/prescription/delete', [PrescriptionController::class, 'delete']);

Route::post('/appointment/create', [AppointmentController::class, 'create']);
Route::put('/appointment/update', [AppointmentController::class, 'edit']);
Route::delete('/appointment/delete', [AppointmentController::class, 'delete']);

Route::get('/user', [UserController::class, 'index']);
Route::get('/user/{id}', [UserController::class, 'show']);
Route::put('/user/{id}', [UserController::class, 'edit']);
Route::post('/user/login', [UserController::class, 'login']);
Route::post('/user/register', [UserController::class, 'create']);
