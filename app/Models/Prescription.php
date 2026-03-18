<?php

namespace App\Models;

use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Prescription extends Model
{
    /** @use HasFactory<UserFactory> */
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'user_id',
        'medication_id',
        'dosage_id',
        'quantity',
        'refill_on',
        'refill_schedule'
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [];

    public function user()
    {
        return $this->hasOne(User::class, 'id', 'user_id');
    }

    public function medication()
    {
        return $this->hasOne(Medication::class, 'id', 'medication_id');
    }

    public function dosage()
    {
        return $this->hasOne(Dosage::class, 'id', 'dosage_id');
    }
}
