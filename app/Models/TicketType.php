<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
class TicketType extends Model{
    protected $fillable=['concert_id','name','price','stock','sold'];
    public function concert(){ return $this->belongsTo(Concert::class); }
}