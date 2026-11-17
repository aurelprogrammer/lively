<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
class Wishlist extends Model{
    protected $fillable=['user_id','concert_id'];
    public function concert(){ return $this->belongsTo(Concert::class); }
}