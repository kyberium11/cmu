<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FileLocation extends Model
{
    use HasFactory;

    protected $table = 'file_locations';

    protected $primaryKey = 'file_location_id';

    protected $fillable = [
        'file_location',
        'file_id',
    ];
}
