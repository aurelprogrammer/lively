<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
class OrderItem extends Model{
    protected $fillable=['order_id','concert_id','ticket_type_id','qty','price','subtotal'];
    public function concert(){ return $this->belongsTo(Concert::class); }
    public function ticketType(){ return $this->belongsTo(TicketType::class); }
}