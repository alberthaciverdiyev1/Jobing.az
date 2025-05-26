<!DOCTYPE html>
<html lang="en">
<!-- Head -->
@include('partials.head')
<body class="bg-gray-100 flex flex-col min-h-screen">
<!-- Mobil Menuu -->
@include('partials.mobile_menu')
<!-- Navbar -->
@include('partials.navbar')
<!-- body -->
@yield('page')
<!-- Footer -->
@include('partials.footer')
<!-- Js -->
@include('partials.js')
</body>

</html>
