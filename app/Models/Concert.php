<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
class Concert extends Model{
    protected $fillable=['artist_id','music_category_id','title','description','date','time','city','venue','poster','status'];
    protected $casts=['date'=>'date'];
    public function artist(){ return $this->belongsTo(Artist::class); }
    public function category(){ return $this->belongsTo(MusicCategory::class,'music_category_id'); }
    public function ticketTypes(){ return $this->hasMany(TicketType::class)
    }