<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class FileFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'code'          => $this->faker->lexify(),
            'filename'      => $this->faker->text(50),
            'slug'          => $this->faker->text(24),
            'description'   => $this->faker->text(80),
            'user_id'       => $this->faker->numberBetween(1, 2),
            'category_id'       => $this->faker->numberBetween(1, 10),
        ];
    }
}
