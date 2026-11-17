<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
class CartItem extends Model{
    protected $fillable=['cart_id','concert_id','ticket_type_id','qty'];
    public function concert(){ return $this->belongsTo(Concert::class); }
    public function ticketType(){ return $this->belongsTo(TicketType::class); }
}