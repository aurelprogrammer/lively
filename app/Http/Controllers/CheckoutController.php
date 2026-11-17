<?php
namespace App\Http\Controllers;
use App\Models\{Cart, TicketType, Order, Payment, Ticket};
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
class CheckoutController extends Controller{
    public function index(){ $cart=Cart::where('user_id',auth()->id())->with('items.ticketType')->first(); return view('checkout.index',['cart'=>$cart]); }
    public function store(Request $r){
        $r->validate(['buyer_name'=>'required','email'=>'required|email','phone'=>'required','payment_method'=>'required']);
        return DB::transaction(function() use($r){
            $cart=Cart::where('user_id',auth()->id())->with('items')->firstOrFail();
            $subtotal=0;
            foreach($cart->items as $item){ $t=TicketType::where('id',$item->ticket_type_id)->lockForUpdate()->first(); if($t->stock < $item->qty) abort(422,'Stok tidak cukup'); $subtotal += $t->price * $item->qty; }
            $fee=$subtotal*0.05; $total=$subtotal+$fee;
            $order=Order::create(['user_id'=>auth()->id(),'order_code'=>'LV-'.strtoupper(Str::random(8)),'buyer_name'=>$r->buyer_name,'email'=>$r->email,'phone'=>$r->phone,'subtotal'=>$subtotal,'service_fee'=>$fee,'total'=>$total,'status'=>'pending']);
            foreach($cart->items as $item){ $t=TicketType::where('id',$item->ticket_type_id)->lockForUpdate()->first(); $t->decrement('stock',$item->qty); $t->increment('sold',$item->qty); $oi=$order->items()->create(['concert_id'=>$item->concert_id,'ticket_type_id'=>$t->id,'qty'=>$item->qty,'price'=>$t->price,'subtotal'=>$t->price*$item->qty]); for($i=0;$i<$item->qty;$i++){ $code='TIX-'.strtoupper(Str::random(10)); Ticket::create(['order_id'=>$order->id,'order_item_id'=>$oi->id,'ticket_code'=>$code,'qr_code'=>$code]); } }
            Payment::create(['order_id'=>$order->id,'method'=>$r->payment_method,'amount'=>$total,'status'=>'pending']);
            $cart->items()->delete();
            return redirect()->route('orders.show',$order);
        });
    }
}