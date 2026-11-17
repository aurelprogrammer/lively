<?php
namespace App\Http\Controllers;
use App\Models\Order;
class OrderController extends Controller{
    public function index(){ return view('orders.index',['orders'=>Order::where('user_id',auth()->id())->latest()->paginate(10)]); }
    public function show(Order $order){ if($order->user_id!==auth()->id()) abort(403); return view('orders.show',['order'=>$order->load('items.concert','items.ticketType','payment','tickets')]); }
}