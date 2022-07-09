<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class UserTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        //
        DB::table('users')->insert([
            'name' => 'RMU CHIEF',
            'email' => 'rmuchief@gmail.com',
            'user_type' => 'Chief',
            'phone_no' => '090909090909',
            'address' => 'Bukidnon City',
            'password' => Hash::make('123')
        ]);

        DB::table('users')->insert([
            'name' => 'jerome',
            'email' => 'brojeromealtarejos@gmail.com',
            'user_type' => 'Client',
            'phone_no' => '090909090909',
            'address' => 'Bukidnon City',
            'password' => Hash::make('123')
        ]);
    }
}
