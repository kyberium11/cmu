<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Request extends Model
{
    use HasFactory;

    protected $primaryKey = 'request_id';

    protected $fillable = [
        'purpose',
        'request_date',
        'status',
        'user_id',
        'file_id',
        'request_form',
        'expiration_date'
    ];

}
