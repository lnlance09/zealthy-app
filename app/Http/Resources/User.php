<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class User extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'email' => $this->email,
            'name' => [
                'first' => $this->first_name,
                'middle' => $this->middle_name,
                'last' => $this->last_name,
            ],
            'appointmentCount' => $this->appointments_count,
            'prescriptionCount' => $this->prescriptions_count,
            'appointments' => new AppointmentCollection($this->appointments),
            'prescriptions' => new PrescriptionCollection($this->prescriptions),
            'prescriptionsFiltered' => new PrescriptionCollection($this->prescriptions)
        ];
    }
}
