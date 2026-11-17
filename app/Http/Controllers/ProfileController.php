<?php
namespace App\Http\Controllers;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
class ProfileController extends Controller{
    public function edit(){ return view('profile.edit',['user'=>auth()->user()]); }
    public function update(Request $r){
        $u=auth()->user();
        $r->validate(['name'=>'required','email'=>'required|email','phone'=>'nullable']);
        $data=$r->only('name','email','phone');
        if($r->password) $data['password']=Hash::make($r->password);
        $u->update($data);
        return back()->with('success','Profil disimpan');
    }
}