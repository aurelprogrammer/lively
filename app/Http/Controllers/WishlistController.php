<?php
namespace App\Http\Controllers;
use App\Models\Wishlist;
use App\Models\Concert;
class WishlistController extends Controller{
    public function index(){ return view('wishlist.index',['items'=>Wishlist::where('user_id',auth()->id())->with('concert.artist')->get()]); }
    public function toggle(Concert $concert){ $w=Wishlist::where('user_id',auth()->id())->where('concert_id',$concert->id)->first(); if($w) $w->delete(); else Wishlist::create(['user_id'=>auth()->id(),'concert_id'=>$concert->id]); return back(); }
}