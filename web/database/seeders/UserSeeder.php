<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::query()->delete();

        DB::statement('ALTER TABLE users AUTO_INCREMENT = 1');

        User::create([
            'name' => 'Fardhan Admin',
            'username' => 'fardhanadmin',
            'phone' => '6281234567890',
            'password' => Hash::make('password'),
        ]);

        User::create([
            'name' => 'Raka Teman',
            'username' => 'rakakeren',
            'phone' => '6281222222222',
            'password' => Hash::make('password'),
        ]);

        User::create([
            'name' => 'Ayu Pembuat Split',
            'username' => 'ayusplit',
            'phone' => '6281333333333',
            'password' => Hash::make('password'),
        ]);
    }
}
