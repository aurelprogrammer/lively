<?php
namespace App\Http\Controllers;
use App\Models\Ticket;
class TicketController extends Controller{
    public function show(Ticket $ticket){ if($ticket->order->user_id!==auth()->id()) abort(403); return view('tickets.show',compact('ticket')); }
    public function download(Ticket $ticket){ return view('tickets.show',compact('ticket')); }
}