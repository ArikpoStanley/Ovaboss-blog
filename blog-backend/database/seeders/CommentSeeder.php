<?php

namespace Database\Seeders;

use App\Models\Comment;
use App\Models\Post;
use App\Models\User;
use Illuminate\Database\Seeder;

class CommentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get all posts
        $posts = Post::all();
        $users = User::all();

        // Create comments for each post
        foreach ($posts as $post) {
            // Create 3-7 comments per post
            $commentCount = rand(3, 7);
            
            for ($i = 0; $i < $commentCount; $i++) {
                Comment::create([
                    'post_id' => $post->id,
                    'user_id' => $users->random()->id,
                    'content' => fake()->paragraph(2, true),
                ]);
            }
        }
    }
}