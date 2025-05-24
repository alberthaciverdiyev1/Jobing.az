<nav class="bg-white fixed w-full z-10 shadow-md">
    <div class="container mx-auto flex justify-between items-center py-3 px-8">
        <!-- Logo Section -->
        <div class="flex items-center">
            <a href="/">
                <!-- Desktop logo -->
                <img src="{{asset('images/static/Logo.png')}}" alt="Logo" class="hidden lg:block w-56 h-12 object-cover">

                <!-- Mobile logo -->
                <img src="{{asset('images/static/LogoMobile.png')}}" alt="Logo Mobile" class="block lg:hidden h-8 object-cover">
            </a>
        </div>


        <!-- Navigation Links -->
        <div class="desktop-menu space-x-4 hidden md:flex">
            <a href="{{route('home')}}"
                class="text-gray-800 font-semibold hover:filled-button-color hover:text-white px-3 py-2 rounded transition duration-300">Ana Səhifə</a>
            <a href="{{route('vacancies')}}"
                class="text-gray-800 font-semibold hover:filled-button-color hover:text-white px-3 py-2 rounded transition duration-300">Vakansiyalar</a>
            <a href="{{route('blogs')}}"
                class="text-gray-800 font-semibold hover:filled-button-color hover:text-white px-3 py-2 rounded transition duration-300">Bloqlar</a>
            <a href="{{route('contact')}}"
               class="text-gray-800 font-semibold hover:filled-button-color hover:text-white px-3 py-2 rounded transition duration-300">Əlaqə</a>
            <a href="{{route('about')}}"
                class="text-gray-800 font-semibold hover:filled-button-color hover:text-white px-3 py-2 rounded transition duration-300">Haqqımızda</a>

            @if(false)
                <select id="language" name="language" class="w-14 border rounded">
                    <option value="en">English</option>
                    <option value="az">Azerbaijani</option>
                    <option value="ru">Russian</option>
                </select>
            @endif
                <a href="{{route('add_vacancy')}}"
                class="filled-button-color text-white px-6 py-2 rounded ml-2 hover:filled-button-color duration-300">Elan Yerləşdir</a>
        </div>


        <!-- Login Button -->
        @if(false)
            <div class="hidden md:block">
                <a href="/auth"
                    class="filled-button-color text-white px-6 py-2 rounded-full ml-2 hover:filled-button-color duration-300">Login</a>
            </div>
        @endif

                <!-- Mobile Menu Toggle -->
                <div class="md:hidden">
                    <button id="menuToggle" class="text-gray-800 focus:outline-none">
                        <i class="fas fa-bars fa-2x"></i>
                    </button>
                </div>
    </div>
</nav>
