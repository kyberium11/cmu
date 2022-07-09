<?php

namespace App\Http\Controllers;

use App\Models\File;
use Illuminate\Http\Request;
use App\Http\Resources\FileResource;
use Illuminate\Support\Facades\DB;

class FileController extends Controller
{

    private $pagination_no = 10;
    
    public function index()
    {
        /* $files = File::join('users', 'files.user_id', '=', 'users.user_id')->join('file_category', 'files.category_id', '=', 'file_category.category_id')
        ->select('users.name as name','files.*')
        ->get(); */
        $files = File::leftJoin('file_category', 'files.category_id', '=', 'file_category.category_id')->get();

        return FileResource::collection($files);
    }

    public function show($id)
    { 
        return new FileResource(File::findOrFail($id));
    }

    public function search(Request $request)
    {
        $request->validate([
            'keyword' 		         => 	'required|string|min:2',
        ]);

        $files = File::where('filename', 'like', '%' . $request->keyword . '%')
                ->orWhere('code', 'like', '%' . $request->keyword . '%')
                ->orWhere('slug', 'like', '%' . $request->keyword . '%')
                ->orWhere('description', 'like', '%' . $request->keyword . '%')
                ->leftJoin('users', 'requests.user_id', '=', 'users.user_id')
                ->paginate($this->pagination_no);

        return FileResource::collection($files);
    }

    private function validation(Request $request)
    {
        $request->validate([
            'code' 		         => 	'required|alpha_num',
            'filename' 		     =>     'required|string',
            'slug' 		         => 	'required|string|max:24',
            'description' 		 =>     'required|string',
            'user_id' 		     =>     'required|numeric',
            'category_id' 		 =>     'required|numeric',
        ]);
    }
    public function store(Request $request)
    {
        $this->validation($request);

        $file = File::create($request->all());

        return new FileResource($file);
    }
    
    public function getFileDisposal()
    {
        $filedis = File::select(DB::raw('*'))
        ->where('retention_date', '<=',DB::raw('NOW()'))
        ->where('file_status', '=','Approved')
        ->where('retention_status', '=','Active')
        ->get();

        return response($filedis);
    }
    public function update(Request $request, $id)
    {
        $this->validation($request);

        $file = File::findOrFail($id);
 
        $file->update($request->all());

        return new FileResource($file);
    }
    
    public function destroy($id)
    {
        $file = File::findOrFail($id);

        if($file->delete())
            return new FileResource($file);
    }
    public function destroyRecords(Request $request)
    {
        $ids = $request;
        $file = File::whereIn('file_id',$ids)->delete();
        
        return response($file);

    }

}