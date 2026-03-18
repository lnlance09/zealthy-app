<?php

namespace Database\Seeders;

use App\Models\Appointment;
use App\Models\Dosage;
use App\Models\Medication;
use App\Models\Prescription;
use App\Models\Provider;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $data = json_decode(file_get_contents(__DIR__ . '/imports/defaultData.json'));

        $medications = $data->medications;
        foreach ($medications as $m) {
            Medication::factory()->create([
                'name' => $m
            ]);
        }

        $dosages = $data->dosages;
        foreach ($dosages as $d) {
            $amount = substr($d, 0, -2);
            $unit = substr($d, -2);
            Dosage::factory()->create([
                'amount' => $amount,
                'unit' => $unit
            ]);
        }

        $users = $data->users;
        foreach ($users as $u) {
            $id = $u->id;
            $name = formatFullName($u->name);
            $email = $u->email;
            $password = $u->password;

            User::factory()->create([
                'id' => $id,
                'first_name' => $name['first'],
                'middle_name' => $name['middle'],
                'last_name' => $name['last'],
                'email' => $email,
                'password' => $password
            ]);

            $appointments = $u->appointments;
            foreach ($appointments as $a) {
                $provider = Provider::firstOrCreate([
                    'name' => $a->provider
                ]);
                Appointment::create([
                    'provider_id' => $provider->id,
                    'user_id' => $id,
                    'datetime' => $a->datetime,
                    'repeat' => $a->repeat
                ]);
            }

            $prescriptions = $u->prescriptions;
            foreach ($prescriptions as $p) {
                $medication = Medication::firstOrCreate([
                    'name' => $p->medication
                ]);
                $dosage = Dosage::firstOrCreate([
                    'amount' => $p->dosage
                ]);
                Prescription::create([
                    'user_id' => $id,
                    'medication_id' => $medication->id,
                    'dosage_id' => $dosage->id,
                    'quantity' => $p->quantity,
                    'refill_on' => $p->refill_on,
                    'refill_schedule' => $p->refill_schedule
                ]);
            }
        }
    }
}
