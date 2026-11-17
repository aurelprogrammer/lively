<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
class Artist extends Model{
    protected $fillable=['name','genre','bio','photo'];
    public function concerts(){ return $this->hasMany(Concert::class); }
}