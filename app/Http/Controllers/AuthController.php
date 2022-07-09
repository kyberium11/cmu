<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{

    
    public function login(Request $request)
    {
        $fields = $request->validate([
            'email'         => 'required|string|email',
            'password'      => 'required|string'
        ]);

        $user = User::where('email', $fields['email'])->first();

        if(!$user || !Hash::check($fields['password'], $user->password)){
            return response([
                'message'   => 'Credentials not Found'
            ], 401);
        }

        $token = $user->createToken('cmudas')->plainTextToken;

        $response = [
            'user'          => $user,
            'token'         => $token
        ];

        return response($response, 201);
    }
    
    public function user(Request $request) {
        return $request->user();
    }
    
    public function logout()
    {
        auth()->user()->tokens()->delete();

        return [
            'message'       => 'Logged out'
        ];
    }

}
