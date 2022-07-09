<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\FileCategoryController;
use App\Http\Controllers\FileController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\RequestController;
use App\Http\Controllers\FileLocationController;
use App\Http\Controllers\MailController;
use App\Http\Controllers\ForgotPasswordController;
use App\Models\FileLocation;
use Illuminate\Routing\Router;

// Public Routes
// Route::resource('files', FileController::class);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [UserController::class, 'store']);

Route::get('/files', [FileController::class, 'index']);
Route::get('/files/{id}', [FileController::class, 'show']);
Route::post('/files/search', [FileController::class, 'search']);

Route::get('/requests', [RequestController::class, 'index']);
Route::get('/requests/{id}', [RequestController::class, 'show']);
Route::post('/requests/search', [RequestController::class, 'search']);

Route::get('/requestreportsdaily', [RequestController::class, 'requestReportsDaily']);
Route::get('/requestreportsweekly', [RequestController::class, 'requestReportsWeekly']);
Route::get('/requestreportsmonthly', [RequestController::class, 'requestReportsMonthly']);
Route::get('/requestreportsyearly', [RequestController::class, 'requestReportsYearly']);

Route::get('/filerequestreports',[RequestController::class,'fileRequestReports']);




Route::get('/filecategory',[FileCategoryController::class, 'index']);
Route::get('/filedisposal',[FileController::class,'getFileDisposal']);


Route::get('/users', [UserController::class, 'index']);
Route::get('/users/{id}', [UserController::class, 'show']);
Route::post('/users/search', [UserController::class, 'search']);

Route::get('/filelocations', [FileLocationController::class, 'index']);
Route::get('/filelocations/{id}', [FileLocationController::class, 'show']);
Route::post('/filelocations/search', [FileLocationController::class, 'search']);

Route::get('/uploadreportsmonthly',[FileLocationController::class, 'uploadReportsMonthly']);
Route::get('/uploadreportsyearly',[FileLocationController::class, 'uploadReportsYearly']);


Route::post('/mail', [MailController::class, 'index']);
Route::post('/mail', [MailController::class, 'sendEmail']);

Route::post('/forgotpassword',[ForgotPasswordController::class,'sendLinkResponse']);
Route::post('/passwordreset',[ForgotPasswordController::class,'sendResetResponse']);

// Protected Routes
Route::group(['middleware' => ['auth:sanctum']], function () {
    Route::get('/user', [AuthController::class,'user']);
    Route::post('/files', [FileController::class, 'store']);
    Route::put('/files/{id}', [FileController::class, 'update']);
    Route::delete('/files/{id}', [FileController::class, 'destroy']);
    Route::post('/destroyfilerecords', [FileController::class, 'destroyRecords']);

    Route::post('/requests', [RequestController::class, 'store']);
    Route::put('/requests/{id}', [RequestController::class, 'update']);
    Route::delete('/requests/{id}', [RequestController::class, 'destroy']);
    Route::post('/destroyrecords', [RequestController::class, 'destroyRecords']);


    Route::post('/filecategory',[FileCategoryController::class,'store']);
    Route::put('/filecategory/{id}',[FileCategoryController::class,'update']);
    Route::delete('/filecategory/{id}',[FileCategoryController::class,'destroy']);



    Route::post('/users', [UserController::class, 'store']);
    Route::put('/users/{id}', [UserController::class, 'update']);
    Route::delete('/users/{id}', [UserController::class, 'destroy']);
    Route::put('/updatecurrentuser/{id}', [UserController::class, 'updateCurrentUser']);
    Route::put('/updatecurrentuserpassword/{id}', [UserController::class, 'updateCurrentUserPassword']);

    Route::post('/filelocations', [FileLocationController::class, 'store']);
    Route::put('/filelocations/{id}', [FileLocationController::class, 'update']);
    Route::delete('/filelocations/{id}', [FileLocationController::class, 'destroy']);
    Route::get('/downloaddocuments/{id}', [FileLocationController::class, 'downloadDocuments']);
    Route::post('/destroyfilelocationrecords', [FileLocationController::class, 'destroyRecords']);

    Route::post('/logout', [AuthController::class, 'logout']);

});

// Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
//     return $request->user();
// });
