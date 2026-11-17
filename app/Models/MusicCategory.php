<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
class MusicCategory extends Model{
    protected $fillable=['name','slug'];
    public function concerts(){ return $this->hasMany(Concert::class); }
}