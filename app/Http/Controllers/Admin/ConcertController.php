<?php
namespace App\Http\Controllers\Admin;
use App\Http\Controllers\Controller;
use App\Models\{Concert, Artist, MusicCategory};
use Illuminate\Http\Request;
class ConcertController extends Controller{
    public function index(Request $r){ $q=Concert::with('artist'); if($r->search) $q->where('title','like','%'.$r->search.'%'); return view('admin.concerts.index',['concerts'=>$q->paginate(10)]); }
    public function create(){ return view('admin.concerts.create',['artists'=>Artist::all(),'categories'=>MusicCategory::all()]); }
    public function store(Request $r){ $data=$r->validate(['artist_id'=>'required','music_category_id'=>'required','title'=>'required','description'=>'required','date'=>'required|date','time'=>'required','city'=>'required','venue'=>'required','poster'=>'nullable|image|mimes:jpg,png|max:2048']); if($r->hasFile('poster')) $data['poster']=$r->file('poster')->store('posters','public'); $c=Concert::create($data); $c->ticketTypes()->createMany([['name'=>'Regular','price'=>275000,'stock'=>500],['name'=>'VIP','price'=>550000,'stock'=>200],['name'=>'VVIP','price'=>950000,'stock'=>50]]); return redirect()->route('admin.concerts.index'); }
    public function edit(Concert $concert){ return view('admin.concerts.create',['concert'=>$concert,'artists'=>Artist::all(),'categories'=>MusicCategory::all()]); }
    public function update(Request $r, Concert $concert){ $concert->update($r->validate(['title'=>'required','description'=>'required','date'=>'required|date','time'=>'required','city'=>'required','venue'=>'required'])); return redirect()->route('admin.concerts.index'); }
    public function destroy(Concert $concert){ $concert->delete(); return back(); }
}