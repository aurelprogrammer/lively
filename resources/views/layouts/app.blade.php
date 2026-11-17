<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>@yield('title', 'Lively - Tiket Konser')</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-100">
    <nav class="bg-black text-white p-4 flex justify-between items-center">
        <a href="/" class="font-bold text-xl">LIVELY<span class="text-yellow-400">.</span></a>
        <div class="flex gap-4 text-sm">
            <a href="/">Home</a>
            <a href="/concerts">Konser</a>
            <a href="/cart">Keranjang</a>
            <a href="/login">Login</a>
        </div>
    </nav>

    <main class="p-6 max-w-6xl mx-auto">
        @yield('content')
    </main>

    <footer class="text-center text-gray-500 text-sm p-6">
        © 2026 Lively - Kelompok Hebat
    </footer>
</body>
</html>