<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\UserAuthRequest;
use App\Http\Resources\UserResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    /**
     * store
     * @param UserAuthRequest $request
     * @return UserResource|JsonResponse
     */
    public function store(UserAuthRequest $request): UserResource|JsonResponse
    {
        $parameters = $request->validated();
        $loginType = filter_var($parameters['username_or_email'], FILTER_VALIDATE_EMAIL) ? 'email' : 'username';

        $userCredentials = [
            $loginType => $parameters['username_or_email'],
            'password' => $parameters['password']
        ];

        if (Auth::attempt($userCredentials, $parameters['remember_me'])) {
            $request->session()->regenerate();

            return new UserResource(Auth::user());
        }

        return response()->json([
            'message' => 'Invalid credentials',
        ], 401);
    }

    /**
     * destroy
     * @param Request $request
     * @return JsonResponse
     */
    public function destroy(Request $request): JsonResponse
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();

        $request->session()->regenerateToken();

        return response()->json([
            'message' => 'Logged out'
        ]);
    }
}
