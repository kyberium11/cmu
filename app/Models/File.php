<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class File extends Model
{
    use HasFactory;

    protected $primaryKey = 'file_id';

    protected $fillable = [
        'code',
        'filename',
        'slug',
        'description',
        'user_id',
        'retention_date',
        'file_status',
        'document_type',
        'retention_status',
        'category_id',
        'archive'
    ];

}
