<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create admin user
        User::create([
            'name' => 'Stanley Samuel',
            'email' => 'arikposatnley123@gmail.com',
            'password' => Hash::make('Stanley@123'),
        ]);

        // Create regular users
        User::factory(10)->create();
    }
}