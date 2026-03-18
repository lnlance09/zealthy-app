<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Appointment;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class AppointmentController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request) {}

    /**
     * Create an instance of the resource
     * 
     * @param  Request  $request
     * @return Response
     */
    public function create(Request $request): Response
    {
        $request->validate([
            'userId' => 'bail|required|exists:users,id',
            'providerId' => 'bail|required|exists:providers,id',
            'datetime' => 'required|date_format:yyyy-MM-dd HH:mm:ss',
            'repeat' => function ($rs) {
                return in_array($rs, ['daily', 'weekly', 'monthly']);
            }
        ]);
        $userId = $request->input('userId');
        $providerId = $request->input('providerId');
        $datetime = $request->input('datetime');
        $repeat = $request->input('repeat');

        Appointment::create([
            'user_id' => $userId,
            'provider_id' => $providerId,
            'datetime' => $datetime,
            'repeat' => $repeat
        ]);

        return response([]);
    }

    /**
     * Edit the resource
     * 
     * @param  Request  $request
     * @return Response
     */
    public function edit(Request $request): Response
    {
        $request->validate([
            'id' => 'bail|required|exists:appointments,id',
            'datetime' => 'required|date_format:yyyy-MM-dd HH:mm:ss',
            'repeat' => function ($rs) {
                return in_array($rs, ['daily', 'weekly', 'monthly']);
            }
        ]);
        $id = $request->input('id');
        $datetime = $request->input('datetime');
        $repeat = $request->input('repeat');

        $appointment = Appointment::find($id);
        $appointment->datetime = $datetime;
        $appointment->repeat = $repeat;
        $appointment->save();
        $appointment->refresh();

        return response([
            'appointment' => $appointment
        ]);
    }

    /**
     * Delete the resource
     * 
     * @param  Request  $request
     * @return Response
     */
    public function delete(Request $request): Response
    {
        $request->validate([
            'id' => 'bail|required|exists:appointments,id',
        ]);
        $id = $request->input('id');
        Appointment::destroy($id);
        return response([
            'success' => true
        ]);
    }
}
