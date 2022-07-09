<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use Illuminate\Support\Facades\Password;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Hash;
use Illuminate\Auth\Events\PasswordReset;
use Illuminate\Auth\Notifications\ResetPassword;
//use Illuminate\Support\Str;

class ForgotPasswordController extends Controller
{
    //

    protected function getPasswordReset() {
        
    }

    protected function sendLinkResponse(Request $request)
    {
        $input = $request->only('email');
        $validator = Validator::make($input,[
            'email' => "required|email"
        ]);

        if($validator->fails())
        {
            return response(
                ['errors' =>$validator->errors()->all()],422
            );
        }
        $response =  Password::sendResetLink($input);
        if($response == Password::RESET_LINK_SENT)
        {
            $message = "Mail send successfully";
            $response = ['data' => '','message' => $message];
            return response($response,200);

        }
        else
        {
            $message = "Email could not be sent to this email address. Please enter your registered email address";
            $response = ['data' => '','message' => $message];
            return response($response,422);
        }
       
    }
    protected function sendResetResponse(Request $request)
    {
        $input = $request->only('email','token','password','password_confirmation');

        $validator = Validator::make($input,[
            'token' => 'required',
            'email' => 'required|email',
            'password' => 'required|confirmed|min:8',
        ]);

        if($validator->fails())
        {
            return response([
                'errors' => $validator->errors()->all()
            ],422);
        }

        $response = Password::reset($input, function($user,$password){
            $user->forceFill([
                'password' => Hash::make($password)
            ])->save();

            event(new PasswordReset($user));
        });

        if($response == Password::PASSWORD_RESET)
        {
            $message = 'Password reset successful';
        }else
        {
            $message = 'Could not sent to this email address';
        }

        $response = [
            'data' => '',
            'message' => $message
        ];

        return response($response);


    }
}
