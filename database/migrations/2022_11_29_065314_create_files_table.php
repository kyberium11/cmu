<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateFilesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('files', function (Blueprint $table) {
            $table->id('file_id');
            $table->string('code');
            $table->string('filename');
            $table->string('slug');
            $table->text('description');
            $table->text('archive');
            $table->text('file_status');
            $table->text('document_type');
            $table->text('retention_status');
            $table->dateTime('retention_date');
            $table->timestamps();
        });

        Schema::table('files', function (Blueprint $table) {
            $table->unsignedBigInteger('user_id');
            $table->foreign('user_id')->references('user_id')->on('users');
            $table->unsignedBigInteger('category_id');
            $table->foreign('category_id')->references('category_id')->on('file_category');
            
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('files');
    }
}
