<?php
namespace App\Http\Controllers;
use App\Models\Cart;
use App\Models\CartItem;
use Illuminate\Http\Request;
class CartController extends Controller{
    public function index(){ $cart=Cart::firstOrCreate(['user_id'=>auth()->id()]); return view('cart.index',['cart'=>$cart->load('items.concert','items.ticketType')]); }
    public function store(Request $r){
        $r->validate(['concert_id'=>'required','ticket_type_id'=>'required','qty'=>'required|min:1']);
        $cart=Cart::firstOrCreate(['user_id'=>auth()->id()]);
        CartItem::updateOrCreate(['cart_id'=>$cart->id,'ticket_type_id'=>$r->ticket_type_id],['concert_id'=>$r->concert_id,'qty'=>$r->qty]);
        return redirect()->route('cart.index');
    }
    public function update(Request $r, CartItem $item){ $item->update(['qty'=>$r->qty]); return back(); }
    public function destroy(CartItem $item){ $item->delete(); return back(); }
}