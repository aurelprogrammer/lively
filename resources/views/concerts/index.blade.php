@extends('layouts.app')

@section('title', 'Semua Konser - Lively')

@section('content')
<h1 class="text-3xl font-bold">Semua Konser</h1>
<p class="text-gray-500 mt-1">Pilih konser favoritmu.</p>

<div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
    @forelse($concerts as $c)
        <div class="bg-white rounded-xl overflow-hidden shadow">
            <div class="h-40 bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-5xl">🎸</div>
            <div class="p-4">
                <h3 class="font-bold">{{ $c->title }}</h3>
                <p class="text-sm text-gray-500">{{ $c->artist }} - {{ $c->city }} | {{ $c->event_date }}</p>
                <p class="font-bold mt-2">Rp {{ number_format($c->price, 0, ',', '.') }}</p>
                <a href="/concerts/{{ $c->id }}" class="block text-center mt-3 bg-black text-white py-2 rounded-full text-sm">Lihat Detail</a>
            </div>
        </div>
    @empty
        <p class="text-gray-500">Belum ada konser.</p>
    @endforelse
</div>
@endsection