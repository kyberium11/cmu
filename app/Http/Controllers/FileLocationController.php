<?php

namespace App\Http\Controllers;

use App\Models\FileLocation;
use App\Models\File;
use Illuminate\Http\Request;
use App\Http\Resources\FileLocationResource;
use Carbon\Carbon;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Storage;
use League\CommonMark\Extension\CommonMark\Node\Inline\Strong;
use Illuminate\Support\Facades\DB;

class FileLocationController extends Controller
{

    private $pagination_no = 10;

    public function index()
    {
        $files = FileLocation::leftJoin('files', 'files.file_id', '=', 'file_locations.file_id')
        ->join('file_category','file_category.category_id','=','files.category_id')
        ->get();
        /*         ->join('users','users.user_id', '=', 'files.user_id')
        ->select('users.name as name','files.*') */
        /*         ->paginate($this->pagination_no); */

        return FileLocationResource::collection($files);
    }

    public function show($id)
    {
        $file = FileLocation::findOrFail($id);
        $filename = $file->file_location;
        $contents = Storage::url($filename);
        $extension = pathinfo(storage_path($filename), PATHINFO_EXTENSION);
        $data = array('filecontent' => $contents, 'filetype' => $extension);
        return response($data);
    }

    public function search(Request $request)
    {
        $request->validate([
            'keyword'                  =>     'required|string|min:2',
        ]);

        $files = FileLocation::where('filename', 'like', '%' . $request->keyword . '%')
            ->orWhere('file_location', 'like', '%' . $request->keyword . '%')
            ->leftJoin('files', 'files.file_id', '=', 'file_locations.file_id')
            ->paginate($this->pagination_no);

        return FileLocationResource::collection($files);
    }

    private function validation(Request $request)
    {
        $request->validate([
            'file_location'         =>     'required|mimes:png,jpg,jpeg,pdf|max:2048',
            'file_id'                 =>  'required|numeric',
        ]);
    }

    public function store(Request $request)
    {
        $this->validation($request);
        //$file = FileLocation::create($request->all());

        if ($request->hasFile('file_location')) {

            $filelocation = $request->file('file_location');

            $filename = $filelocation->getClientOriginalName();

            $filelocation->storePubliclyAs('public', $filename);

            $file = FileLocation::create([

                'file_id' => $request->file_id,

                'file_location' => $filename

            ]);

            return new FileLocationResource($file);
        }
    }

    public function update(Request $request, $id)
    {
        $this->validation($request);

        $file = FileLocation::findOrFail($id);


        //$file->update($request->all());
        if ($request->hasFile('file_location')) {

            unlink(storage_path('app/public/' . $request->filename));

            $filelocation = $request->file('file_location');

            $filename = $filelocation->getClientOriginalName();

            /* $filelocation->storePubliclyAs('public',$filename); */
            $filelocation->storePubliclyAs('public', $filename);

            $file->file_id = $request->file_id;

            $file->file_location = $filename;

            $file->save();

            return new FileLocationResource($file);
        }
    }
    public function uploadReportsMonthly()
    {

       /*  $monthlyuploadreports = FileLocation::leftJoin('files', 'files.file_id', '=', 'file_locations.file_id')->get()->groupBy(function ($date) {
            $date_upload = Carbon::parse($date->created_at);
            $month = $date_upload->format('F Y');
            return "{$month}";
        }); */

        $monthlyreports = File::select(DB::raw(
            'MONTHNAME(created_at) as date,
            COUNT(CASE WHEN file_status = "Approved" THEN 1 ELSE NULL END) as "total_uploaded",
            COUNT(CASE WHEN retention_status = "Dispose" THEN 1 ELSE NULL END) as "total_dispose",
            COUNT(CASE WHEN archive = "Archive" THEN 1 ELSE NULL END) as "total_archive"'
        ))
        ->groupBy(DB::raw('MONTH(created_at)'))
        ->get();




        return response($monthlyreports);
    }
    public function uploadReportsYearly()
    {

        /* $yearlyreports = FileLocation::leftJoin('files', 'files.file_id', '=', 'file_locations.file_id')->get()->groupBy(function ($date) {
            $date_upload = Carbon::parse($date->created_at);
            $month = $date_upload->format('Y');
            return "{$month}";
        }); */

        $yearlyreports = File::select(DB::raw(
            '
            YEAR(created_at) as date,
            COUNT(CASE WHEN file_status = "Approved" THEN 1 ELSE NULL END) as "total_uploaded",
            COUNT(CASE WHEN retention_status = "Dispose" THEN 1 ELSE NULL END) as "total_dispose",
            COUNT(CASE WHEN archive = "Archive" THEN 1 ELSE NULL END) as "total_archive"'
        ))
        ->groupBy(DB::raw('YEAR(created_at)'))
        ->get();


        return response($yearlyreports);
    }

    public function downloadDocuments($id) {
        $file = FileLocation::findOrFail($id);
        $path = Storage::url($file->file_location);

        return Storage::download($path);
    }
    public function destroy($id)
    {
        $file = FileLocation::findOrFail($id);
        if ($file->delete())
            unlink(storage_path('app/public/' . $file->file_location));
        return new FileLocationResource($file);
    }

    public function destroyRecords(Request $request)
    {
        $ids = $request;
        $req = FileLocation::whereIn('file_location_id', $ids)->delete();

        return response($req);
    }
}
