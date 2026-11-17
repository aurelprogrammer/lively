@extends('layouts.app')

@section('title', 'Home - Lively')

@section('content')
<div class="bg-black text-white rounded-2xl p-10 text-center">
    <h1 class="text-4xl font-bold">Nonton Konser Impianmu 🎤</h1>
    <p class="mt-2 text-gray-300">Cari konser, beli tiket, langsung masuk. Tanpa ribet.</p>
    <a href="/concerts" class="inline-block mt-6 bg-yellow-400 text-black font-bold px-6 py-3 rounded-full">Lihat Semua Konser</a>
</div>

<h2 class="text-2xl font-bold mt-10 mb-4">Konser Populer</h2>
<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
    @forelse($concerts as $c)
        <div class="bg-white rounded-xl overflow-hidden shadow">
            <div class="h-40 bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-5xl">🎶</div>
            <div class="p-4">
                <h3 class="font-bold">{{ $c->title }}</h3>
                <p class="text-sm text-gray-500">{{ $c->artist }} - {{ $c->city }}</p>
                <p class="font-bold mt-2">Rp {{ number_format($c->price, 0, ',', '.') }}</p>
                <a href="/concerts/{{ $c->id }}" class="block text-center mt-3 bg-black text-white py-2 rounded-full text-sm">Lihat Detail</a>
            </div>
        </div>
    @empty
        <p class="text-gray-500">Belum ada konser. Jalankan seeder dulu ya.</p>
    @endforelse
</div>
@endsection