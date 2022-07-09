<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Mail;

class MailController extends Controller
{
 
    public function validation(Request $request)
    {
        return $request->validate([
            'name' => 'required|string',
            'email' => 'required|string|email',
            'subject' => 'required|string',
            'message' => 'required|string'
        ]);
    }
    public function index()
    {
        //
    }
    public function sendEmail(Request $request)
    {
        $fields = $this->validation($request);
        $data = [
            'name' => $request->name,
            'email' => $request->email,
            'subject' => $request->subject,
            'message' => $request->message
        ];
        Mail::send('email_template', ['data' => $data], function($message) use ($data) {
            $message->to($data['email'])
            ->subject($data['subject']);
        });
        return response("Message Successfully sent");
    }
}
