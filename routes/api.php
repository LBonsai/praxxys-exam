<?php

use App\Http\Controllers\Auth\AuthController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Product\ProductController;

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

Route::prefix('auth')->group(function () {
    Route::group(['middleware' => ['guest']], function () {
        Route::post('login', [AuthController::class, 'store'])->name('login');
    });
    Route::group(['middleware' => ['auth:sanctum']], function () {
        Route::delete('logout', [AuthController::class, 'destroy'])->name('logout');
    });

    Route::apiResource('products', ProductController::class);
})->name('auth.');
