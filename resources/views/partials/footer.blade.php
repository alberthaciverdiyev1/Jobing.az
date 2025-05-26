<nav class="bg-white fixed w-full z-10 shadow-md">
    <div class="container mx-auto flex justify-between items-center py-3 px-8">
        <!-- Logo Section -->
        <div class="flex items-center">
            <a href="/">
                <!-- Desktop logo -->
                <img src="/Images/Static/Logo.png" alt="Logo" class="hidden lg:block w-56 h-12 object-cover">

                <!-- Mobile logo -->
                <img src="/Images/Static/LogoMobile.png" alt="Logo Mobile" class="block lg:hidden h-8 object-cover">
            </a>
        </div>


        <!-- Navigation Links -->
        <div class="desktop-menu space-x-4 hidden md:flex">
            <a href="/"
               class="text-gray-800 font-semibold hover:filled-button-color hover:text-white px-3 py-2 rounded transition duration-300">Ana Səhifə</a>
            <a href="/vakansiyalar"
               class="text-gray-800 font-semibold hover:filled-button-color hover:text-white px-3 py-2 rounded transition duration-300">Vakansiyalar</a>
            <a href="/blogs"
               class="text-gray-800 font-semibold hover:filled-button-color hover:text-white px-3 py-2 rounded transition duration-300">Bloqlar</a>
            <a href="/contact"
               class="text-gray-800 font-semibold hover:filled-button-color hover:text-white px-3 py-2 rounded transition duration-300">Əlaqə</a>
            <a href="/about-us"
               class="text-gray-800 font-semibold hover:filled-button-color hover:text-white px-3 py-2 rounded transition duration-300">Haqqımızda</a>
            <a href="/add-job"
               class="filled-button-color text-white px-6 py-2 rounded ml-2 hover:filled-button-color duration-300">Elan Yerləşdir</a>
        </div>
        
        <!-- Mobile Menu Toggle -->
        <div class="md:hidden">
            <button id="menuToggle" class="text-gray-800 focus:outline-none">
                <i class="fas fa-bars fa-2x"></i>
            </button>
        </div>
    </div>
</nav>
