<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Request as Req;
use App\Http\Resources\RequestResource;
use App\Http\Resources\FileRequestReportsResource;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class RequestController extends Controller
{

    private $pagination_no = 10;

    public function index()
    {
        $reqs = Req::leftJoin('files', 'requests.file_id', '=', 'files.file_id')->join('file_locations','files.file_id', '=','file_locations.file_id')
            ->leftJoin('users', 'requests.user_id', '=', 'users.user_id')->get();
        /* ->paginate($this->pagination_no); */

        return RequestResource::collection($reqs);
    }

    public function show($id)
    {

        $file = Req::findOrFail($id);

        $filename = $file->request_form;

        $contents = Storage::url('request/' . $filename);

        $extension = pathinfo(storage_path('request/' . $filename), PATHINFO_EXTENSION);

        $data = array('request_id' => $id, 'filecontent' => $contents, 'filetype' => $extension);

        return response($data);

        //return new RequestResource(Req::findOrFail($id));
    }

    public function search(Request $request)
    {
        $request->validate([
            'keyword'                  =>     'required|string|min:2',
        ]);

        $reqs = Req::where('requests.description', 'like', '%' . $request->keyword . '%')
            ->orWhere('filename', 'like', '%' . $request->keyword . '%')
            ->orWhere('code', 'like', '%' . $request->keyword . '%')
            ->orWhere('name', 'like', '%' . $request->keyword . '%')
            ->leftJoin('files', 'requests.file_id', '=', 'files.file_id')
            ->leftJoin('users', 'requests.user_id', '=', 'users.user_id')
            ->paginate($this->pagination_no);

        return RequestResource::collection($reqs);
    }

    private function validation(Request $request)
    {
        $request->validate([
            'purpose'               =>     'required|string',
            'request_date'          =>     'required|date',
            'request_form'          =>     'required|mimes:pdf|max:2048',
            'expiration_date'       =>     'required|date',
            'status'                =>     'required|alpha_num',
            'file_id'               =>     'required|numeric',
            'user_id'               =>     'numeric',
        ]);
    }

    public function store(Request $request)
    {
        $this->validation($request);

        if ($request->hasFile('request_form')) {


            $request_form = $request->file('request_form');

            $request_name = $request_form->getClientOriginalName();

            $request_form->storePubliclyAs('public/request', $request_name);

            $req = Req::create([
                'file_id' => $request->file_id,
                'request_form' => $request_name,
                'request_date' => $request->request_date,
                'purpose' => $request->purpose,
                'status' => $request->status,
                'expiration_date' => $request->expiration_date,
                'user_id' => $request->user_id,
            ]);

            return new RequestResource($req);
        }





        /* $req = Req::create($request->all());

        return new RequestResource($req); */
    }

    public function update(Request $request, $id)
    {
        //$this->validation($request);

        $req = Req::findOrFail($id);

        $req->status = $request->status;

        $req->expiration_date = $request->expiration_date;
        
        $req->save();

        return new RequestResource($req);
    }

    public function requestReportsDaily()
    {
        $dailyreports = Req::select(DB::raw(
            '
            DATE(request_date) as date,
            COUNT(CASE WHEN status = "Approved" OR status = "Pending"  THEN 1 ELSE NULL END) as "total",
            COUNT(CASE WHEN status = "Approved" THEN 1 ELSE NULL END) as "approved",
            COUNT(CASE WHEN status = "Pending" THEN 1 ELSE NULL END) as "pending",
            COUNT(CASE WHEN status = "Denied" THEN 1 ELSE NULL END) as "denied",
            COUNT(CASE WHEN status = "Expired" THEN 1 ELSE NULL END) as "expired"
            '
        ))->groupBy(DB::raw(
            'DATE(request_date)'
        ))->get();


        return response($dailyreports);
    }

    public function fileRequestReports()
    {
        $filereqreports = Req::select(DB::raw(
            'COUNT(requests.file_id) as totalrequests,
            files.filename as "filename",
            file_category.category as "category"'
            
        ))
        ->join('files','requests.file_id', '=','files.file_id')
        ->join('file_category','files.category_id','=','file_category.category_id')
        ->groupBy("files.filename")
        ->get();
      return new FileRequestReportsResource($filereqreports);
    }

    public function requestReportsWeekly()
    {


        $weeklyreports = Req::all()->groupBy(function ($date) {
            $request_date = Carbon::parse($date->request_date);
            $start = $request_date->startOfWeek()->format('d-m-Y');
            $end = $request_date->endOfWeek()->format('d-m-Y');

            return "{$start} - {$end}";
        });


        return response($weeklyreports);
    }
    public function requestReportsMonthly()
    {
        $monthlyreports = Req::all()->groupBy(function ($date) {
            $request_date = Carbon::parse($date->request_date);
            $month = $request_date->format('F Y');
            return "{$month}";
        });


        return response($monthlyreports);
    }

    public function requestReportsYearly()
    {
        $yearlyreports = Req::all()->groupBy(function ($date) {
            $request_date = Carbon::parse($date->request_date);
            $year = $request_date->format('Y');
            return "{$year}";
        });


        return response($yearlyreports);
    }

    public function destroy($id)
    {
        $req = Req::findOrFail($id);

        if ($req->delete())
            return new RequestResource($req);
    }



    public function destroyRecords(Request $request)
    {
        $ids = $request;
        $req = Req::whereIn('request_id', $ids)->delete();

        /* return response($req); */
        return response($req);
    }
}
