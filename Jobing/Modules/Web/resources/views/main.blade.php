<!DOCTYPE html>
<html lang="en">
<!-- Head -->
@include('web::partials.head')
<body class="bg-gray-100 flex flex-col min-h-screen">
<!-- Mobil Menuu -->
@include('web::partials.mobile_menu')
<!-- Navbar -->
@include('web::partials.navbar')
<!-- body -->
@yield('body')
<!-- Footer -->
@include('web::partials.footer')
<!-- Js -->
@include('web::partials.js')
</body>

</html>
