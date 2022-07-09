<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class FileResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array|\Illuminate\Contracts\Support\Arrayable|\JsonSerializable
     */
    public function toArray($request)
    {
        // return parent::toArray($request);
        return [
            'file_id'       => $this->file_id,
            'code'          => $this->code,
            'filename'      => $this->filename,
            'slug'          => $this->slug,
            'description'   => $this->description,
            'created_at'    => $this->created_at,
            'retention_date'=> $this->retention_date,
            'archive'       => $this->archive,
            'file_status'   => $this->file_status,
            'document_type' => $this->document_type,
            'user_id'       => $this->user_id,
            'retention_status' => $this->retention_status,
            'category'   => $this->category,
            'category_id' => $this->category_id
        ];
    }
}
