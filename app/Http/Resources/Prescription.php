<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class Prescription extends JsonResource
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
            // 'user' => new User($this->user_id),
            'medication' => new Medication($this->medication),
            'dosage' => new Dosage($this->dosage),
            'quantity' => $this->quantity,
            'refillOn' => $this->refill_on,
            'refillSchedule' => $this->refill_schedule
        ];
    }
}
