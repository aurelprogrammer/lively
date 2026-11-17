<?php
namespace App\Http\Controllers\Admin;
use App\Http\Controllers\Controller;
use App\Models\{Concert, User, Order, TicketType};
class DashboardController extends Controller{
    public function index(){ return view('admin.dashboard',['totalConcert'=>Concert::count(),'totalUser'=>User::count(),'totalOrder'=>Order::count(),'totalSold'=>TicketType::sum('sold'),'totalRevenue'=>Order::where('status','paid')->sum('total'),'upcoming'=>Concert::where('status','upcoming')->take(5)->get()]); }
}