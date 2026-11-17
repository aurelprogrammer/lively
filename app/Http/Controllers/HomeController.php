<?php
namespace App\Http\Controllers;
use App\Models\Concert;
use App\Models\MusicCategory;
class HomeController extends Controller{
    public function index(){
        return view('home', [
            'featured'=>Concert::with('artist')->where('status','upcoming')->take(4)->get(),
            'upcoming'=>Concert::with('artist')->where('status','upcoming')->latest()->paginate(8),
            'categories'=>MusicCategory::all()
        ]);
    }
}