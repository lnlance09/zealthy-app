<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Http\Resources\User as UserResource;
use App\Http\Resources\UserCollection;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Illuminate\Validation\Rules\Password;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return UserCollection
     */
    public function index(Request $request)
    {
        $users = User::with(['appointments' => function ($query) {
            $query->orderBy('appointments.id', 'desc');
        }, 'prescriptions' => function ($query) {
            $query->orderBy('prescriptions.id', 'desc');
        }])
            ->withCount(['appointments', 'prescriptions'])
            ->get();
        return new UserCollection($users);
    }

    /**
     * Display an instance of the resource.
     *
     * @return UserResource
     */
    public function show($id)
    {
        $user = User::where('id', $id)
            ->with(['appointments' => function ($query) {
                $query->orderBy('appointments.id', 'desc');
            }, 'prescriptions' => function ($query) {
                $query->orderBy('prescriptions.id', 'desc');
            }])
            ->withCount(['appointments', 'prescriptions'])
            ->first();
        if (empty($user)) {
            return response([
                'message' => 'That user does not exist'
            ], 404);
        }
        return new UserResource($user);
    }

    /**
     * Create
     * 
     * @param  Request  $request
     * @return Response
     */
    public function create(Request $request)
    {
        $request->validate([
            'name' => 'bail|required|max:40|min:4|regex:/^[a-zA-Z ]+$/',
            'email' => 'bail|required|email|unique:users'
        ]);

        $name = $request->input('name');
        $email = $request->input('email');
        $fullName = formatFullName($name);

        $user = User::create([
            'first_name' => $fullName['first'],
            'middle_name' => $fullName['middle'],
            'last_name' => $fullName['last'],
            'email' => $email,
            'password' => sha1(Str::random(10)),
            'remember_token' => Str::random(10),
            'verification_code' => mt_rand(1000, 9999),
            'api_token' => bin2hex(random_bytes(32)),
        ]);
        $user->refresh();

        return response([
            'bearer' => $user->api_token,
            'user' => new UserResource($user)
        ]);
    }

    /**
     * Edit the resource
     * 
     * @param  Request  $request
     * @return UserResource
     */
    public function edit(Request $request)
    {
        $request->validate([
            'id' => 'bail|required|exists:users,id',
            'name' => 'bail|required|string|max:255',
            'email' => 'bail|required|email',
        ]);
        $id = $request->input('id');
        $name = $request->input('name');
        $email = $request->input('email');
        $names = explode(' ', $name);

        $user = User::find($id);
        $user->first_name = $names[0];
        $user->middle_name = count($names) > 2 ? $names[1] : null;
        $user->last_name = end($names);
        $user->email = $email;
        $user->save();
        $user->refresh();

        return new UserResource($user);
    }

    /**
     * Login
     * 
     * @param  Request  $request
     * @return Response
     */
    public function login(Request $request): Response
    {
        $request->validate([
            'email' => 'bail|required|email',
            'password' => ['bail', 'required', Password::min(8)],
        ]);
        $email = $request->input('email');
        $password = $request->input('password');

        $user = User::where([
            'email' => $email,
            'password' => sha1($password)
        ])
            ->with(['appointments', 'prescriptions'])
            ->withCount(['appointments', 'prescriptions'])
            ->first();
        if (empty($user)) {
            return response([
                'message' => 'Incorrect password'
            ], 401);
        }

        return response([
            'bearer' => $user->api_token,
            'user' => new UserResource($user)
        ]);
    }
}
