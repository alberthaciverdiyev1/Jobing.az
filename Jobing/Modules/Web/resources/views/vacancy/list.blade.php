@extends('web::main')

@section('body')
    <section>
        <div class="container flex flex-col lg:flex-row mt-24 mx-auto h-auto lg:h-screen w-11/12 lg:w-9/12">
            <div
                class="lg:w-1/4 bg-white px-7 py-6 rounded-xl mb-6 lg:mb-0 lg:mr-3 overflow-y-scroll scroll-smooth custom-scroll hidden sm:block"
                id="filter-section">
                <!-- Filter Header -->
                <div class="flex justify-between py-1   font-semibold text-base rounded-md">
                    <span class="text-gray-800">Bütün Filterlər</span>
                </div>
                <!-- Search -->
                <div class="mt-3 flex relative">
                    <input type="text" id="search" class="border-2 h-8 w-full pr-8 rounded-lg border-custom">
                    <button id="search-btn">
                        <i class="fa-solid fa-magnifying-glass absolute right-2 top-1/2 transform -translate-y-1/2"></i>
                    </button>
                </div>
                <!-- Search end -->

                <!-- Department Filters -->
                <div class="mt-3">
                    <div
                        class="color flex justify-between border-t border-gray-400 py-3  text-sm text-gray-800 items-center">
                        <p class="font-semibold text-base">Kateqoriyalar</p>
                    </div>

                    <div class="ml-3">
                        <!-- Checkbox List -->

                        <div class="space-y-2 mb-2">
                            <div class="flex items-center">
                                <input type="radio" name="category" id="all" class="custom-checkbox"/>
                                <label for="all" class="text-gray-800">
                                    Bütün Kateqoriyalar
                                </label>
                            </div>
                        </div>
                        <div class="space-y-2" id="categoryList"></div>

                        <span class="ml-2 mt-4 block text-blue-400 hover:underline cursor-pointer"
                              id="show-more-categories">Daha Çox</span>
                    </div>
                    <div class="border-b border-gray-400 mt-3"></div>
                </div>
                <!-- Location Filters -->
                <div class="mt-3">
                    <div class="color flex justify-between   text-gray-800 items-center">
                        <p class="font-semibold text-base">Şəhər</p>

                    </div>

                    <div class="py-4 ml-3">
                        <!-- Checkbox List -->
                        <div class="mb-1">
                            <div class="flex items-center">
                                <input type="radio" name="city" id="city-all" class="custom-checkbox"/>
                                <label for="city-all" class="text-gray-800">
                                    Bütün Şəhərlər
                                </label>
                            </div>
                        </div>
                        <div class="space-y-2" id="cityList">

                        </div>
                        <span class="ml-2 mt-4 block text-blue-400 hover:underline cursor-pointer"
                              id="show-more-cities">Daha Çox</span>

                    </div>
                    <div class="border-b border-gray-400 mt-3"></div>
                </div>
                <!-- Min max salary slider -->
                <div class="mt-3">
                    <div class="color flex justify-between   text-gray-800 items-center">
                        <p class="font-semibold text-base">Maaş</p>
                    </div>
                    <div class="min-max-slider relative mx-auto mt-3">
                        <div class="absolute inset-x-0 top-0">
                            <div class="flex justify-between mt-7">
                                <span id="min-value" class="value lower block font-semibold text-gray-800">145</span>
                                <span id="max-value" class="value upper block font-semibold text-gray-800">4999</span>
                            </div>
                        </div>

                        <div id="slider" class="absolute inset-0 border-2 rounded-lg h-4 border-red-400"></div>
                    </div>
                </div>
                <!-- Education Filters -->
                <div class="border-b border-gray-400 mt-5"></div>

                <div class="mt-12">
                    <% if (false) { %>
                    <div class="color flex justify-between   text-gray-800 items-center">
                        <p class="font-semibold text-base">Work Mode</p>
                    </div>

                    <div class="py-4 ml-3">
                        <!-- Checkbox List -->
                        <div class="space-y-2">
                            <div class="flex items-center">
                                <input type="checkbox" id="loc1" class="custom-checkbox"/>
                                <label for="loc1" class="text-gray-800">Hybrid <span
                                        class="text-gray-400">(145)</span></label>
                            </div>
                            <div class="flex items-center">
                                <input type="checkbox" id="loc2" class="custom-checkbox"/>
                                <label for="loc2" class="text-gray-800">Office
                                    <span class="text-gray-400">(78)</span></label>
                            </div>
                            <div class="flex items-center">
                                <input type="checkbox" id="loc3" class="custom-checkbox"/>
                                <label for="loc3" class="text-gray-800">Remote <span
                                        class="text-gray-400">(95)</span></label>
                            </div>
                        </div>
                    </div>
                    <div class="border-b border-gray-400 mt-3"></div>
                    <% } %>
                </div>

                <div class="mt-3">
                    <div class="color flex justify-between   text-gray-800 items-center">
                        <p class="font-semibold text-base">Təhsil</p>
                    </div>

                    <div class="py-3 ml-3">
                        <!-- Checkbox List -->
                        <div class="space-y-2" id="educationList">

                        </div>
                    </div>
                    <div class="border-b border-gray-400 mt-3"></div>
                </div>

                <!-- Experience Filters -->
                <div class="mt-3">
                    <div class="color flex justify-between px-1   text-base text-gray-800 items-center">
                        <p class="font-semibold">Təcrübə</p>

                    </div>

                    <div class="py-3 ml-3">
                        <!-- Checkbox List -->
                        <div class="space-y-2" id="experienceList">
                        </div>
                    </div>
                    <div class="border-b border-gray-400 mt-3"></div>
                </div>
            </div>

            <!-- Cards Section -->

            <div
                class="w-full  lg:w-3/4 bg-gray-100 rounded-xl px-5 pb-6 overflow-y-scroll scroll-smooth custom-scroll">
                <!-- Tabs Section -->
                <div class="text-sm font-medium text-gray-500 border-b border-gray-200 sm:ml-7">
                    <ul class="flex sm:justify-start justify-center w-full">
                        <li class="me-2 text-center">
                            <button
                                class="inline-block sm:p-4 p-3 w-32 text-gray-50 border-b-2 border-transparent rounded-t-lg filled-button-color text-md"
                                id="getall_jobs">
                                Bütün Elanlar
                            </button>
                        </li>
                        <li class="me-2 text-center">
                            <button
                                class="inline-block sm:p-4 p-3 w-32 text-gray-900 border-b-2 border-transparent rounded-t-lg  text-md"
                                id="onlyJobing">
                                Yalnız Jobing
                            </button>
                        </li>

                    </ul>
                </div>


                <!-- Content Section -->
                <div id="card-section">
                    <div class="flex items-center justify-center min-h-screen bg-white border border-custom rounded-lg"
                         id="mobile-scroll">
                        <div class="flex flex-col items-center justify-center w-full max-w-xs mx-auto">
                            <span class="loader"></span>
                        </div>
                    </div>
                </div>
            </div>

        </div>

        <button class="fixed bottom-4 right-4 w-14 h-14 z-10 filled-button-color rounded-full sm:hidden"
                id="mobile-filter-btn">
            <i class="fa-solid fa-filter text-gray-100"></i>
        </button>

    </section>
@endsection
