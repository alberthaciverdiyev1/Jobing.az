@extends('web::main')

@section('body')

    <div class="container mx-auto px-4 md:px-8 lg:px-16 py-12 min-h-screen flex items-center mt-8">
        <div class="bg-white px-6 md:px-8 lg:px-12 py-4 w-full mt-0 rounded-lg shadow-lg">
            <h2 class="text-4xl font-bold text-center mt-3 mb-8 text-gray-800">Yeni Elan</h2>

            <div class="sm:bg-gray-50 sm:p-6 lg:p-10 sm:rounded-lg">
                <div class="space-y-6">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label for="email" class="block mb-2 text-sm font-medium border text-gray-700">Email</label>
                            <input id="email" type="email" placeholder="Emailinizi daxil edin"
                                   class="w-full p-3 border-custom rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 h-14">
                            <span class="error-message text-red-500 text-sm mt-1 hidden">Bu xana doldurulmalıdır</span>
                        </div>
                        <div>
                            <label for="username" class="block mb-2 text-sm font-medium text-gray-700">Əlaqədar
                                Şəxs</label>
                            <input id="username" type="text" placeholder="İstifadəçi adı"
                                   class="w-full p-3 border-custom  h-14 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500">
                            <span class="error-message text-red-500 text-sm mt-1 hidden">Bu xana doldurulmalıdır</span>
                        </div>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label for="phone" class="block mb-2 text-sm font-medium text-gray-700">Telefon
                                Nömrəsi</label>
                            <input id="phone" type="tel" placeholder="Telefon nömrəsi"
                                   class="w-full p-3 border-custom  h-14 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500">
                            <span class="error-message text-red-500 text-sm mt-1 hidden">Bu xana doldurulmalıdır</span>
                        </div>
                        <div>
                            <label for="experience" class="block mb-2 text-sm font-medium text-gray-700">Təhsil</label>
                            <select id="experience"
                                    class="w-full p-3 border-custom  h-14 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500">


                            </select>
                            <span class="error-message text-red-500 text-sm mt-1 hidden">Bu xana doldurulmalıdır</span>
                        </div>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label for="companyName" class="block mb-2 text-sm font-medium text-gray-700">Şirkət
                                Adı</label>
                            <input id="companyName" type="text" placeholder="Şirkət adı"
                                   class="w-full p-3 border-custom  h-14 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500">
                            <span class="error-message text-red-500 text-sm mt-1 hidden">Bu xana doldurulmalıdır</span>
                        </div>
                        <div>
                            <label for="companyImage" class="block mb-2 text-sm font-medium text-gray-700">Şirkət
                                Rəsmi</label>
                            <input id="companyImage" type="file"
                                   class="w-full p-2 border-custom  h-14 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500">
                            <span class="error-message text-red-500 text-sm mt-1 hidden">Bu xana doldurulmalıdır</span>
                        </div>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label for="category"
                                   class="block mb-2 text-sm font-medium text-gray-700">Kategoriya</label>
                            <select id="category"
                                    class="w-full p-3 border-custom  h-14 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500">

                            </select>
                            <span class="error-message text-red-500 text-sm mt-1 hidden">Bu xana doldurulmalıdır</span>
                        </div>
                        <div>
                            <label for="city" class="block mb-2 text-sm font-medium text-gray-700">Şəhər</label>
                            <select id="city"
                                    class="w-full p-3 border-custom  h-14 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500">

                            </select>
                            <span class="error-message text-red-500 text-sm mt-1 hidden">Bu xana doldurulmalıdır</span>
                        </div>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label for="position" class="block mb-2 text-sm font-medium text-gray-700">Vakansiyanın
                                adı</label>
                            <input id="position" type="text" placeholder="Vəzifəni daxil edin"
                                   class="w-full p-3 border-custom  h-14 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500">
                            <span class="error-message text-red-500 text-sm mt-1 hidden">Bu xana doldurulmalıdır</span>
                        </div>
                        <div>
                            <label for="education" class="block mb-2 text-sm font-medium text-gray-700">Təhsil</label>
                            <select id="education"
                                    class="w-full p-3 border-custom  h-14 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500">


                            </select>
                            <span class="error-message text-red-500 text-sm mt-1 hidden">Bu xana doldurulmalıdır</span>
                        </div>
                    </div>

                    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                            <label for="minSalary" class="block mb-2 text-sm font-medium text-gray-700">Minimum
                                Maaş</label>
                            <input id="minSalary" type="number" placeholder="Minimum maaş" min="0" value="345"
                                   class="w-full p-3 border-custom  h-14 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500">
                            <span class="error-message text-red-500 text-sm mt-1 hidden">Bu xana doldurulmalıdır</span>
                        </div>
                        <div>
                            <label for="maxSalary" class="block mb-2 text-sm font-medium text-gray-700">Maksimum
                                Maaş</label>
                            <input id="maxSalary" type="number" placeholder="Maksimum maaş" min="0"
                                   class="w-full p-3 border-custom  h-14 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500">
                            <span class="error-message text-red-500 text-sm mt-1 hidden">Bu xana doldurulmalıdır</span>
                        </div>
                        <div>
                            <label for="minAge" class="block mb-2 text-sm font-medium text-gray-700">Minimum Yaş</label>
                            <input id="minAge" type="number" placeholder="Minimum yaş" min="18" max="90" value="18"
                                   class="w-full p-3 border-custom  h-14 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500">
                            <span class="error-message text-red-500 text-sm mt-1 hidden">Bu xana doldurulmalıdır</span>
                        </div>
                        <div>
                            <label for="maxAge" class="block mb-2 text-sm font-medium text-gray-700">Maksimum
                                Yaş</label>
                            <input id="maxAge" type="number" placeholder="Maksimum yaş" min="18" max="90"
                                   class="w-full p-3 border-custom  h-14 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500">
                            <span class="error-message text-red-500 text-sm mt-1 hidden">Bu xana doldurulmalıdır</span>
                        </div>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">

                        <div>
                            <label for="aboutJob" class="block mb-2 text-sm font-medium text-gray-700">İş Haqqında
                                Məlumat</label>
                            <textarea id="aboutJob" placeholder="İş haqqında məlumat"
                                      class="form-control"></textarea>
                            <span class="error-message text-red-500 text-sm mt-1 hidden" id="about-error">Bu xana doldurulmalıdır</span>
                        </div>
                        <div>
                            <label for="requirements"
                                   class="block mb-2 text-sm font-medium text-gray-700">Tələblər</label>
                            <textarea id="requirements" placeholder="Tələblər"
                                      class="form-control"></textarea>
                            <span class="error-message text-red-500 text-sm mt-1 hidden" id="requirements-error">Bu xana doldurulmalıdır</span>
                        </div>

                    </div>


                    <button type="button" id="addJob"
                            class="w-full bg-orange-500 text-white font-semibold py-3 rounded-lg hover:bg-orange-700 transition duration-200 shadow-md">
                        Paylaş
                    </button>
                </div>
            </div>
        </div>
    </div>

@endsection
