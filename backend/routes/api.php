<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ArticleController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
| These routes are loaded by the RouteServiceProvider and assigned
| to the "api" middleware group.
| URL prefix: /api
|--------------------------------------------------------------------------
*/

// 🔹 Health check (optional)
Route::get('/ping', function () {
    return response()->json([
        'status' => 'ok',
        'time' => now(),
    ]);
});

// 🔹 Fetch all articles (USED BY REACT FRONTEND)
Route::get('/articles', [ArticleController::class, 'index']);

// 🔹 Create article (Phase 1 – optional)
Route::post('/articles', [ArticleController::class, 'store']);

// 🔹 Update article (Phase 2 – enhancement save)
Route::put('/articles/{id}', [ArticleController::class, 'update']);

// 🔹 Delete single article (optional)
Route::delete('/articles/{id}', [ArticleController::class, 'destroy']);

// 🔥 ADMIN ACTION – RESET DB + FETCH OLDEST 5 ARTICLES
Route::post('/admin/reset-articles', [ArticleController::class, 'resetOldest']);

Route::post('/articles/{id}/enhance', [ArticleController::class, 'enhanceOne']);
Route::post('/articles/enhance-all', [ArticleController::class, 'enhanceAll']);

