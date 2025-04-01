<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Requests\UserUpdateRequest;
use App\Http\Resources\UserResource;
use Illuminate\Http\JsonResponse;

class UserController extends Controller
{
    /**
     * Display the authenticated user.
     */
    public function show(): JsonResponse
    {
        return response()->json([
            'status' => 'success',
            'data' => new UserResource(auth()->user()),
        ]);
    }

    /**
     * Update the authenticated user.
     */
    public function update(UserUpdateRequest $request): JsonResponse
    {
        $user = auth()->user();
        $user->update($request->validated());

        return response()->json([
            'status' => 'success',
            'message' => 'User updated successfully',
            'data' => new UserResource($user),
        ]);
    }
}