<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class RequestFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'purpose' => $this->faker->text(50),
        'request_date' => $this->faker->unixTime(),
        'status' => 'Approved',
        'user_id'  => $this->faker->numberBetween(1, 2),
        'file_id' => $this->faker->numberBetween(6, 15),
        'request_form' => $this->faker->text(50),
        'expiration_date' => $this->faker->unixTime()
        ];
    }
}
