<?php
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;

/* Route::get('/', function () {
    return view('homepage/landing');
}); */

/* Route::get('/', function () {
    return view('system/login');
}); */

/* Route::get('/login', function () {
    return view('system/login');
}); */

Route::get('{any}', function () {
    return view('homepage/index');
})->where('any','.*');

Auth::routes();

/* Route::get('/home', [App\Http\Controllers\HomeController::class, 'index'])->name('home'); */
