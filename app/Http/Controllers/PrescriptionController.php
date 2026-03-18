<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Prescription;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class PrescriptionController extends Controller
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
            'medicationId' => 'bail|required|exists:medications,id',
            'dosageId' => 'bail|required|exists:dosages,id',
            'quantity' => 'bail|required|numeric|between:1,100',
            'refillOn' => 'required|date_format:yyyy-MM-dd HH:mm:ss',
            'refillSchedule' => function ($rs) {
                return in_array($rs, ['daily', 'weekly', 'monthly']);
            },
        ]);
        $userId = $request->input('userId');
        $medicationId = $request->input('medicationId');
        $dosageId = $request->input('dosageId');
        $quantity = $request->input('quantity');
        $refillOn = $request->input('refillOn');
        $refillSchedule = $request->input('refillSchedule');

        Prescription::create([
            'user_id' => $userId,
            'medication_id' => $medicationId,
            'dosage_id' => $dosageId,
            'quantity' => $quantity,
            'refill_on' => $refillOn,
            'refill_schedule' => $refillSchedule
        ]);

        return response([
            'success' => true
        ]);
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
            'id' => 'bail|required|exists:prescriptions,id',
            // 'userId' => 'bail|required|exists:users,id',
            'medicationId' => 'bail|required|exists:medications,id',
            'dosageId' => 'bail|required|exists:dosages,id',
            'quantity' => 'bail|required',
            'refillOn' => 'required|date_format:yyyy-MM-dd HH:mm:ss',
            'refillSchedule' => function ($rs) {
                return in_array($rs, ['daily', 'weekly', 'monthly']);
            },
        ]);
        $id = $request->input('id');
        // $userId = $request->input('userId');
        $medicationId = $request->input('medicationId');
        $dosageId = $request->input('dosageId');
        $quanitity = $request->input('quantity');
        $refillOn = $request->input('refillOn');
        $refillSchedule = $request->input('refillSchedule');

        $prescription = Prescription::find($id);
        // $prescription->user_id = $userId;
        $prescription->medication_id = $medicationId;
        $prescription->dosage_id = $dosageId;
        $prescription->quantity = $quanitity;
        $prescription->refill_on = $refillOn;
        $prescription->refill_schedule = $refillSchedule;
        $prescription->save();
        $prescription->refresh();

        return response([
            'prescription' => $prescription
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
            'id' => 'bail|required|exists:prescriptions,id',
        ]);
        $id = $request->input('id');
        Prescription::destroy($id);
        return response([
            'success' => true
        ]);
    }
}
