<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
class Ticket extends Model{
    protected $fillable=['order_id','order_item_id','ticket_code','qr_code','is_used','used_at'];
    protected $casts=['is_used'=>'boolean','used_at'=>'datetime'];
    public function order(){ return $this->belongsTo(Order::class); }
}