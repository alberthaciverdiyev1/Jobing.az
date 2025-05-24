<head>
    <meta charset="UTF-8"/>
    <meta name="google-site-verification" content="DKxrd6e6GbNPPd0KnuDbbsMtnVgmKDdA2jgk3QC-MJc"/>
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <!-- <title>Ən Son Vakansiyalar - Mühasib, Proqramist və Daha Çox | Jobing.az</title> -->
    <meta name="google-adsense-account" content="ca-pub-6130649958615254">
    <meta name="description" content="Azərbaycanda ən son vakansiyalar! Bütün yeni iş elanlarını Jobing.az-da tapın.">
    <meta name="keywords"
          content="hellojob, vakansiya, boss.az vakansiya, restoran vakansiya, otel vakansiya, iş elanları, ən son vakansiyalar, jobing.az">
    <title>
        <%= title %>
    </title>

    <!-- FontAwesome CDN -->
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" rel="stylesheet"/>

    <!-- CDN Tailwind / remove after complete project -->
    {{--     <script src="https://cdn.tailwindcss.com"></script>--}}
    <!-- CDN Tailwind / remove after complete project -->

    <!--    <link rel="stylesheet" href="/Css/Output.css">-->
    @vite('Modules/Web/resources/assets/css/output.css')
    @vite('Modules/Web/resources/assets/css/custom.css')
    @vite('Modules/Web/resources/assets/css/loader.css')
    @vite('Modules/Web/resources/assets/css/libraries/alertify/alertify.css')
    @vite('Modules/Web/resources/assets/css/libraries/salary_slider.min.css')
    @vite('Modules/Web/resources/assets/css/libraries/ckeditor5.min.css')

    @if(isset($css))
        @foreach($css as $c)
            <link rel="stylesheet" href="@vite('Modules/Web/resources/assets/css/'.$c)">
        @endforeach
    @endif
    <!-- Favicons -->
    <link rel="icon" href="Images/Favicons/favicon.ico" type="image/x-icon">
    <!-- Apple Touch Icon -->
    <link rel="apple-touch-icon" href="/apple-touch-icon.png">
    <!-- Favicon 32x32 ve 16x16 -->
    <link rel="icon" href="Images/Favicons/favicon-32x32.png" type="image/png" sizes="32x32">
    <link rel="icon" href="Images/Favicons/favicon-16x16.png" type="image/png" sizes="16x16">
    <!-- Web App Manifest -->
    <link rel="manifest" href="Images/Favicons/site.webmanifest">
    <!-- Android Chrome Icons -->
    <link rel="icon" href="Images/Favicons/android-chrome-192x192.png" type="image/png" sizes="192x192">
    <link rel="icon" href="Images/Favicons/android-chrome-512x512.png" type="image/png" sizes="512x512">


    <!-- Google tag (gtag.js) -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-2932L7DPW8"></script>
    <script>
        window.dataLayer = window.dataLayer || [];

        function gtag() {
            dataLayer.push(arguments);
        }

        gtag('js', new Date());

        gtag('config', 'G-2932L7DPW8');
    </script>

</head>
