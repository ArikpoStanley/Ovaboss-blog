<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Requests\CreatePostRequest;
use App\Http\Requests\UpdatePostRequest;
use App\Http\Resources\PostDetailResource;
use App\Http\Resources\PostResource;
use App\Models\Post;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class PostController extends Controller
{
    /**
     * Display a listing of the posts.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Post::with('user:id,name')
            ->withCount('comments');

        // Search by title
        if ($request->has('search')) {
            $query->where('title', 'like', '%' . $request->search . '%');
        }

        // Filter by author
        if ($request->has('author')) {
            $query->whereHas('user', function ($q) use ($request) {
                $q->where('id', $request->author);
            });
        }

        // Get posts with pagination
        $posts = $query->latest()->paginate(10);

        return response()->json([
            'status' => 'success',
            'data' => PostResource::collection($posts),
            'meta' => [
                'current_page' => $posts->currentPage(),
                'last_page' => $posts->lastPage(),
                'per_page' => $posts->perPage(),
                'total' => $posts->total(),
            ],
        ]);
    }

    /**
     * Store a newly created post.
     */
    public function store(CreatePostRequest $request): JsonResponse
    {
        $data = $request->validated();
        $data['user_id'] = auth()->id();

        // Handle image upload
        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('posts', 'public');
            $data['image_path'] = $path;
        }

        $post = Post::create($data);
        $post->load('user:id,name');

        return response()->json([
            'status' => 'success',
            'message' => 'Post created successfully',
            'data' => new PostResource($post),
        ], 201);
    }

    /**
     * Display the specified post.
     */
    public function show(Post $post): JsonResponse
    {
        $post->load('user:id,name', 'comments.user:id,name');

        return response()->json([
            'status' => 'success',
            'data' => new PostDetailResource($post),
        ]);
    }

    /**
     * Update the specified post.
     */
    public function update(UpdatePostRequest $request, Post $post): JsonResponse
    {
        $data = $request->validated();

        // Handle image upload
        if ($request->hasFile('image')) {
            // Delete old image if exists
            if ($post->image_path) {
                Storage::disk('public')->delete($post->image_path);
            }

            $path = $request->file('image')->store('posts', 'public');
            $data['image_path'] = $path;
        }

        $post->update($data);
        $post->load('user:id,name');

        return response()->json([
            'status' => 'success',
            'message' => 'Post updated successfully',
            'data' => new PostResource($post),
        ]);
    }

    /**
     * Remove the specified post.
     */
    public function destroy(Post $post): JsonResponse
    {
        // Check if user is the owner of the post
        if (auth()->id() !== $post->user_id) {
            return response()->json([
                'status' => 'error',
                'message' => 'Unauthorized',
            ], 403);
        }

        // Delete image if exists
        if ($post->image_path) {
            Storage::disk('public')->delete($post->image_path);
        }

        $post->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Post deleted successfully',
        ]);
    }
}