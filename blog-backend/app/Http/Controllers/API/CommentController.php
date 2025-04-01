<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Requests\CommentRequest;
use App\Http\Resources\CommentResource;
use App\Models\Comment;
use App\Models\Post;
use Illuminate\Http\JsonResponse;

class CommentController extends Controller
{
    /**
     * Store a newly created comment.
     */
    public function store(CommentRequest $request, Post $post): JsonResponse
    {
        $comment = $post->comments()->create([
            'content' => $request->content,
            'user_id' => auth()->id(),
        ]);

        $comment->load('user:id,name');

        return response()->json([
            'status' => 'success',
            'message' => 'Comment added successfully',
            'data' => new CommentResource($comment),
        ], 201);
    }

    /**
     * Remove the specified comment.
     */
    public function destroy(Comment $comment): JsonResponse
    {
        // Check if user is the owner of the comment
        if (auth()->id() !== $comment->user_id) {
            return response()->json([
                'status' => 'error',
                'message' => 'Unauthorized',
            ], 403);
        }

        $comment->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Comment deleted successfully',
        ]);
    }
}