<?php

namespace App\Http\Controllers;

use App\Http\Resources\FileCategoryResource;
use App\Models\FileCategory;
use Illuminate\Http\Request;

class FileCategoryController extends Controller
{


    public function validation(Request $request) {
        return $request->validate([

            'category'      => 'required|string',

        ]);
        
    }

    public function index()
    {

        $category = FileCategory::all();

        return FileCategoryResource::collection($category);
    }


    public function create()
    {
       


    }


    public function store(Request $request)
    {
        $fields = $this->validation($request);

        $category = FileCategory::create([
            'category' => $fields['category']
        ]);
        return response(new FileCategoryResource($category),201);

    }


    public function show($id)
    {
        
    }


    public function edit($id)
    {
        
    }

    public function update(Request $request, $id)
    {
        $this->validation($request);

        $category = FileCategory::findOrFail($id);
        $category->update($request->all());

        return response(new FileCategoryResource($category),200);

    }

    public function destroy($id)
    {
        $category = FileCategory::findOrFail($id);

        if($category->delete()) {
            return new FileCategoryResource($category);
        }
    }
}
