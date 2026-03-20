<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Dosage;
use App\Http\Resources\DosageCollection;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class DosageController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return DosageCollection
     */
    public function index(Request $request)
    {
        $userId = $request->input('userId', null);

        if ($userId) {
            $dosages = Dosage::whereHas('prescriptions', function ($query) use ($userId) {
                $query->where('user_id', $userId);
            })->get();
        } else {
            $dosages = Dosage::all();
        }

        return new DosageCollection($dosages);
    }
}
