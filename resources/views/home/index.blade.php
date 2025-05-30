@extends('main')
@section('page')
    <!-- Banner Section -->
    <section class="py-24 bg-gradient-to-t from-orange-200 to-gray-50 bg-cover bg-center bg-no-repeat md:bg-[url('../Images/Static/HomeFormBG.png')] shadow-[0_14px_6px_rgba(253,230,138,0.5)]">
        <div class="max-w-screen-2xl mx-auto mt-20 lg:mt-32 px-1 lg:mx-36 lg:w-2/2 md:mx-16">
            <div class="text-left ml-5 md:ml-0">
                <h3 class="text-3xl font-semibold md:font-normal md:text-4xl md:text-[45px] mb-6">
                    Minlərlə iş elanı bir platformada...
                </h3>
                <p class="text-gray-500">Axtarışa başla, karyera imkanlarını kəşf et</p>
            </div>

            <!-- Job Search Form -->
            <div class="mt-10 bg-white rounded-lg shadow-lg p-6 w-full mx-auto">
                <div class="flex flex-col md:flex-row items-center gap-4">
                    <!-- Job Title Input -->
                    <div class="relative flex-1 w-full md:w-auto">
                    <span class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                        <i class="fas fa-search"></i>
                    </span>
                        <input type="text" id="keyword" placeholder="Başlıq, şirkət adı və ya şəhər"
                               class="w-full pl-10 pr-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-gray-50 border border-custom" />
                    </div>

                    <!-- Location Input -->
                    <div class="relative flex-1 w-full md:w-auto">
                    <span class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                        <i class="fas fa-map-marker-alt"></i>
                    </span>
                        <select id="city-select"
                                class="w-full pl-10 pr-8 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 appearance-none bg-gray-50 border border-custom">

                        </select>
                        <span class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">
                        <i class="fas fa-chevron-down"></i>
                    </span>
                    </div>

                    <!-- Category Select -->
                    <div class="relative flex-1 w-full md:w-auto">
                    <span class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                        <i class="fas fa-briefcase"></i>
                    </span>
                        <select id="category-select"
                                class="w-full pl-10 pr-8 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 appearance-none bg-gray-50 border border-custom">

                        </select>
                        <span class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">
                        <i class="fas fa-chevron-down"></i>
                    </span>
                    </div>

                    <!-- Submit Button -->
                    <div class="w-full md:w-auto">
                        <button type="button" id="filter-jobs"
                                class="w-full md:w-auto filled-button-color text-white px-8 py-3 rounded-lg hover:filled-button-color transition focus:outline-none">
                            Axtar
                        </button>
                    </div>
                </div>
            </div>

            <!-- Fun Fact Section -->
            <div class="mt-12  justify-between w-full md:w-1/2 hidden md:flex">
                <div class="flex flex-col items-center">
                    <p class="text-2xl lg:text-3xl mb-2" id="vacancy">0</p>
                    <p class="text-gray-500">Vakansiya</p>
                </div>
                <div class="flex flex-col items-center">
                    <p class="text-2xl lg:text-3xl mb-2" id="company">0</p>
                    <p class="text-gray-500">Şirkət</p>
                </div>
                <!-- <div class="flex flex-col items-center">
                    <p class="text-2xl lg:text-3xl mb-2" id="dailyVisitor">0</p>
                    <p class="text-gray-500">Günlük Ziyarətçi</p>
                </div> -->
                <div class="flex flex-col items-center">
                    <p class="text-2xl lg:text-3xl mb-2" id="visitor">0</p>
                    <p class="text-gray-500">Aylıq Ziyarətçi</p>
                </div>
                <div class="flex flex-col items-center">
                    <p class="text-2xl lg:text-3xl mb-2" id="totalVisitor">0</p>
                    <p class="text-gray-500">Ümumi Ziyarətçi</p>
                </div>
            </div>

        </div>
    </section>

    <section>
        <div class="p-4 bg-gray-50">
            <div class="container mx-auto 2xl:px-32">
                <div class="sec-title mb-8 mt-3 flex flex-col items-center justify-center">
                    <h2 class="text-3xl text-center mb-3">Ən Son Vakansiyalar</h2>
                    <p class="text-gray-500 text-center">Karyera arzularını reallaşdırmağa buradan başla</p>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4" id="home-card-section">

                    <div class="flex items-center justify-center h-40 bg-white  border border-custom rounded-lg">
                        <div class="flex flex-col items-center justify-center w-full max-w-xs mx-auto"> <span
                                class="loader"></span>
                        </div>
                    </div>
                    <div class="flex items-center justify-center h-40 bg-white  border border-custom rounded-lg">
                        <div class="flex flex-col items-center justify-center w-full max-w-xs mx-auto">
                            <span class="loader"></span>
                        </div>
                    </div>
                    <div class="flex items-center justify-center h-40 bg-white  border border-custom rounded-lg">
                        <div class="flex flex-col items-center justify-center w-full max-w-xs mx-auto">
                            <span class="loader"></span>
                        </div>
                    </div>
                    <div class="flex items-center justify-center h-40 bg-white  border border-custom rounded-lg">
                        <div class="flex flex-col items-center justify-center w-full max-w-xs mx-auto">
                            <span class="loader"></span>
                        </div>
                    </div>

                </div>
                <div class="flex items-center justify-center mt-6">
                    <a href="/vakansiyalar" class="rounded-full filled-button-color px-8 py-3 text-white hover:empty-button-color">
                        Daha Çox
                    </a>
                </div>
            </div>
        </div>
    </section>

    <section class="process-section py-12 border border-t-2 flex justify-center items-center"
             style="background-image: url('Images/Static/WhoWeAreBG.png'); height: 400px; background-size: cover; background-position: center;">
        <div class="auto-container mx-auto max-w-7xl text-center">
            <div class="sec-title mb-8">
                <h2 class="text-3xl mb-3">Platforma necə işləyir?</h2>
                <p class="text-gray-500">Bütün iş imkanları üçün tək ünvan</p>
            </div>

            <div class="flex overflow-x-auto justify-between md:flex-row mx-4 lg:mx-1 items-center pb-4">
                <!-- Process Block -->
                <div class="flex flex-col items-center min-w-[180px] md:min-w-[280px]">
                    <div class="icon-box w-36 h-36 flex justify-center items-center mb-1 relative">
                        <img src="/Images/Static/WhoWeAre1.png" alt="Sign Up"
                             class="h-24 transition-transform duration-300 transform hover:-translate-y-4">
                    </div>
                    <h4 class="text-base lg:text-lg font-semibold text-center">Hesab yaratmadan <br> axtarış et</h4>
                </div>
                <!-- Process Block -->
                <div class="flex flex-col items-center min-w-[180px] md:min-w-[280px]">
                    <div class="icon-box w-36 h-36 flex justify-center items-center mb-1 relative">
                        <img src="/Images/Static/WhoWeAre3.png" alt="Search"
                             class="h-24 transition-transform duration-300 transform hover:-translate-y-4">
                    </div>
                    <h4 class="text-base lg:text-lg font-semibold text-center">Bütün iş elanlarını <br> kəşf et</h4>
                </div>
                <!-- Process Block -->
                <div class="flex flex-col items-center min-w-[180px] md:min-w-[280px]">
                    <div class="icon-box w-36 h-36 flex justify-center items-center mb-1 relative">
                        <img src="/Images/Static/WhoWeAre2.png" alt="List"
                             class="h-24 transition-transform duration-300 transform hover:-translate-y-4">
                    </div>
                    <h4 class="text-base lg:text-lg font-semibold text-center">Ən uyğun olanı <br> tap</h4>
                </div>
                <!-- Process Block -->
                <div class="flex flex-col items-center min-w-[180px] md:min-w-[280px]">
                    <div class="icon-box w-36 h-36 flex justify-center items-center mb-1 relative">
                        <img src="/Images/Static/WhoWeAre4.png" alt="List"
                             class="h-24 transition-transform duration-300 transform hover:-translate-y-4">
                    </div>
                    <h4 class="text-base lg:text-lg font-semibold text-center">İş elanına <br> keçid et</h4>
                </div>
            </div>
        </div>
    </section>
@endsection
