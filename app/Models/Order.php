<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
class Order extends Model{
    protected $fillable=['user_id','order_code','buyer_name','email','phone','subtotal','service_fee','total','status'];
    public function items(){ return $this->hasMany(OrderItem::class); }
    public function payment(){ return $this->hasOne(Payment::class); }
    public function tickets(){ return $this->hasMany(Ticket::class); }
    public function user(){ return $this->belongsTo(User::class); }
}