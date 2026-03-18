<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Provider;
use App\Http\Resources\ProviderCollection;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class ProviderController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return ProviderCollection
     */
    public function index(Request $request)
    {
        $providers = Provider::all();
        return new ProviderCollection($providers);
    }
}
