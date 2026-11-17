<?php
namespace App\Http\Controllers;
use App\Models\Concert;
use App\Models\MusicCategory;
use Illuminate\Http\Request;
class ConcertController extends Controller{
    public function index(Request $r){
        $q=Concert::with(['artist','category','ticketTypes']);
        if($r->search) $q->where('title','like','%'.$r->search.'%');
        if($r->category) $q->where('music_category_id',$r->category);
        if($r->city) $q->where('city',$r->city);
        return view('concerts.index',['concerts'=>$q->paginate(12),'categories'=>MusicCategory::all()]);
    }
    public function show(Concert $concert){
        return view('concerts.show',['concert'=>$concert->load(['artist','ticketTypes'])]);
    }
}