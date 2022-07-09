<?php

namespace Database\Seeders;

use App\Models\File;
use App\Models\FileCategory;
use App\Models\Request;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        // FileCategory::factory()
        //         ->count(5)
        //         ->create();
        // File::factory()
        //         ->count(10)
        //         ->create();
                
                Request::factory()
                ->count(10)
                ->create();
        
    }
}
