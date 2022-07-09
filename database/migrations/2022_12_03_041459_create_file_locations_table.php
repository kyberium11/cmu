<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateFileLocationsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('file_locations', function (Blueprint $table) {
            $table->id('file_location_id');
            $table->text('file_location');
            $table->timestamps();
        });

        Schema::table('file_locations', function (Blueprint $table) {
            $table->unsignedBigInteger('file_id');
        
            $table->foreign('file_id')->references('file_id')->on('files');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('file_locations');
    }
}
