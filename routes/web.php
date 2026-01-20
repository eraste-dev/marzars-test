<?php

use App\Http\Controllers\Admin\RoomController as AdminRoomController;
use App\Http\Controllers\Admin\UserController as AdminUserController;
use App\Http\Controllers\ReservationController;
use App\Http\Controllers\RoomController;
use App\Http\Controllers\UserReservationController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', [RoomController::class, 'index'])->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    Route::post('/rooms/{room}/reserve', [ReservationController::class, 'store'])->name('reservations.store');
    Route::delete('/rooms/{room}/cancel', [ReservationController::class, 'destroy'])->name('reservations.destroy');

    // User reservations
    Route::get('/dashboard/reservations', [UserReservationController::class, 'index'])->name('user.reservations');
    Route::get('/dashboard/history', [UserReservationController::class, 'history'])->name('user.history');

    // Admin routes
    Route::middleware(['admin'])->prefix('admin')->name('admin.')->group(function () {
        Route::get('/rooms', [AdminRoomController::class, 'index'])->name('rooms.index');
        Route::post('/rooms', [AdminRoomController::class, 'store'])->name('rooms.store');
        Route::put('/rooms/{room}', [AdminRoomController::class, 'update'])->name('rooms.update');
        Route::delete('/rooms/{room}', [AdminRoomController::class, 'destroy'])->name('rooms.destroy');

        Route::get('/users', [AdminUserController::class, 'index'])->name('users.index');
        Route::put('/users/{user}', [AdminUserController::class, 'update'])->name('users.update');
        Route::delete('/users/{user}', [AdminUserController::class, 'destroy'])->name('users.destroy');
    });
});

require __DIR__.'/settings.php';
