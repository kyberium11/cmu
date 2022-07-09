<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateRequestsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('requests', function (Blueprint $table) {
            $table->id('request_id');
            $table->text('purpose');
            $table->dateTime('request_date');
            $table->text('status');
            $table->dateTime('expiration_date');
            $table->text('request_form');
            $table->timestamps();
        });

        Schema::table('requests', function (Blueprint $table) {
            $table->unsignedBigInteger('user_id')->nullable();
            $table->unsignedBigInteger('file_id');
        
            $table->foreign('user_id')->references('user_id')->on('users');
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
        Schema::dropIfExists('requests');
    }
}
