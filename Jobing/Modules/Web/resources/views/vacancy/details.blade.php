@extends('web::main')

@section('body')

    <section class=" bg-gray-50">
        <div
            class="py-4 px-4 mx-auto 2xl:px-28  pt-32 container max-w-7xl  grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            <!-- Main Content -->
            <div class="lg:col-span-2 bg-white shadow-lg rounded-xl py-8 pl-3 pr-8 sm:pl-8 ">
                <div class="space-y-6">
                    <!-- Job Header -->
                    <div class="flex gap-4 sm:gap-6 items-start">
                        <img src="<%= data.companyImage ? data.companyImage : '/Images/DefaultCompany.png' %>"
                             alt="Company Logo" class="h-24 w-24 mt-1 border-custom rounded-xl border sm:h-28 sm:w-28">

                        <div class="border-custom-bottom-1px flex-1 mt-1 sm:mt-0 sm:w-80">
                            <div class="flex items-center justify-between">
                                <h4 class="text-xl font-bold text-gray-800 truncate w-52 md:w-80">
                                    <%= data.title %>
                                </h4>

                                <% if (data.minSalary || data.maxSalary) { %>
                                <span class=" items-center text-xl font-bold hidden md:flex">
                                    <% if (data.minSalary) { %>
                                        <%= data.minSalary %>
                                            <% } %>
                                                <% if (data.maxSalary) { %> - <%= data.maxSalary %>
                                                        <i class="fa-solid fa-manat-sign ml-1"
                                                           style="font-size: 1.25rem;"></i>
                                                        <% } %>
                                </span>

                                <% } else { %>
                                <span class="text-base font-bold  hidden md:flex">Razılaşma yolu ilə</span>
                                <% } %>
                            </div>
                            <div class="text-base items-center text-gray-600 mt-6 space-x-4 hidden md:flex">
                                <!-- Location Field -->
                                <span class="flex items-center">
                                <i class="fa-solid fa-location-dot mr-2 text-gray-500"></i>
                                <%= data.location %>
                            </span>
                                <span class="flex items-center">
                                <i class="fa-solid fa-building mr-2 text-gray-500"></i>
                                <%= data.companyName %>
                            </span>
                            </div>
                            <div class="text-base md:flex items-center text-gray-600 mt-3 mb-1 md:space-x-4">
                            <span class="flex items-center">
                                <i class="fa-solid fa-school mr-2 text-gray-500"></i>
                                <%= data.education %>
                            </span>
                                <span class="flex items-center truncate w-52 md:w-96">
                                <i class="fa-solid fa-business-time mr-2 text-gray-500"></i>
                                <%= data.experience %>
                            </span>

                            </div>
                        </div>

                    </div>
                    <div class="default-html mx-3">
                        <h4 class="text-lg font-bold text-gray-800">Vakansiyanın təsviri:</h4>
                        <p class="text-gray-700 mt-4 ml-4">
                            <%- data.description %>
                        </p>
                    </div>
                </div>
                <div class="text-center flex items-center justify-center mt-8 gap-3">
                    <button
                        class="block filled-button-color text-center hover:bg-orange-700 text-white font-medium py-3 sm:px-8 h-12 w-24 xl:px-16 rounded-lg sm:w-full">
                        İrəli Çək
                    </button>
                    <button
                        class="block filled-button-color text-center hover:bg-orange-700 text-white font-medium py-3 sm:px-8 h-12 w-24 xl:px-16 rounded-lg sm:w-full">
                        Premium
                    </button>
                    <button
                        class="block filled-button-color hover:bg-orange-700 text-white font-medium py-3 sm:px-8 h-12 w-24 xl:px-16 rounded-lg sm:w-full">
                        VİP
                    </button>
                </div>


            </div>
            <!-- Sidebar -->
            <aside class="space-y-2">
                <div class="bg-white shadow-lg rounded-xl p-6 mx-auto">
                    <div class="flex items-center space-x-4 pb-6 mb-6">
                        <img src="<%= data.companyImage ? data.companyImage : '/Images/DefaultCompany.png' %>"
                             alt="Company Logo" class="h-14 w-14 border-custom rounded-xl border shadow-sm">
                        <div>
                            <h5 class="text-xl font-bold text-gray-800 hover:text-blue-600 transition duration-200">
                                <%= data.companyName %>
                            </h5>
                            <a href="https://jobing.az/vakansiyalar?categoryId=all&cityId=all&keyword=<%= data.companyName %>&maxSalary=5000"
                               class="text-blue-500 text-sm hover:underline mt-1 inline-block">Şirkətin bütün
                                vakansiyaları</a>
                        </div>
                    </div>

                    <div>
                        <ul class="space-y-4 text-gray-800">
                            <li class="flex items-center justify-between border-custom-bottom-1px pb-3">
                                <span class="font-semibold text-gray-600">Kategoriya:</span>
                                <span class="text-gray-700 font-medium">
                                <%= data.category.length> 20
                                    ? `${data.category.slice(0, 20)}...`
                                    : data.category %>
                            </span>
                            </li>

                            <li class="flex items-center justify-between border-custom-bottom-1px pb-3">
                                <span class="font-semibold text-gray-600">Maaş:</span>
                                <% if (data.minSalary || data.maxSalary) { %>
                                <span class=" items-center text-gray-700 font-medium">
                                    <% if (data.minSalary) { %>
                                        <%= data.minSalary %>
                                            <% if (data.minSalary) { %><i class="fa-solid fa-manat-sign mx-1"></i>
                                                <% } %>
                                                    <% } %>
                                                        <% if (data.maxSalary) { %> - <%= data.maxSalary %>
                                                                <i class="fa-solid fa-manat-sign ml-1"></i>
                                                                <% } %>
                                </span>

                                <% } else { %>
                                <span class="items-center text-gray-700 font-medium">Razılaşma yolu ilə</span>
                                <% } %>
                            </li>
                            <li class="flex items-center justify-between border-custom-bottom-1px pb-3">
                                <span class="font-semibold text-gray-600">Telefon:</span>
                                <span class="text-gray-700 font-medium">
                                <%= data.phone %>
                            </span>
                            </li>
                            <li class="flex items-center justify-between border-custom-bottom-1px pb-3">
                                <span class="font-semibold text-gray-600">Email:</span>
                                <span class="text-gray-700 font-medium">
                                <%= data.email.length> 23
                                    ? `${data.email.slice(0, 23)}...`
                                    : data.email %>
                            </span>
                            </li>
                            <li class="flex items-center justify-between border-custom-bottom-1px pb-3">
                                <span class="font-semibold text-gray-600">Şəhər:</span>
                                <span class="text-gray-700 font-medium">
                                <%= data.location %>
                            </span>
                            </li>
                            <li class="flex items-center justify-between border-custom-bottom-1px pb-3">
                                <span class="font-semibold text-gray-600">Yaş:</span>
                                <span class="text-gray-700 font-medium">
                                <%= data.minAge && data.maxAge ? `${data.minAge}-${data.maxAge} arası` : data.minAge ?
                                    `${data.minAge}+` : data.maxAge ? `-${data.maxAge}` : '' %>
                            </span>
                            </li>
                            <li class="flex items-center justify-between border-custom-bottom-1px pb-3">
                                <span class="font-semibold text-gray-600">Əlaqədar şəxs:</span>
                                <span class="text-gray-700 font-medium">
                                <%= data.userName %>
                            </span>
                            </li>
                            <li class="flex items-center justify-between border-custom-bottom-1px pb-3">
                                <span class="font-semibold text-gray-600">Təhsil:</span>
                                <span class="text-gray-700 font-medium">
                                <%= data.education%>
                            </span>
                            </li>
                            <li class="flex items-center justify-between border-custom-bottom-1px pb-3">
                                <span class="font-semibold text-gray-600">Təcrübə:</span>
                                <span class="text-gray-700 font-medium">
                                <%= data.experience %>
                            </span>
                            </li>
                            <li class="flex items-center justify-between border-custom-bottom-1px pb-3">
                                <span class="font-semibold text-gray-600">Tarix:</span>
                                <span class="text-gray-700 font-medium">
                                <%= new Date(data.postedAt).toLocaleString('az-AZ', { day: '2-digit' , month: '2-digit'
                                    , year: 'numeric' , hour: '2-digit' , minute: '2-digit' , hour12: false }) %>
                            </span>
                            </li>
                            <li class="flex items-center justify-between border-custom-bottom-1px pb-3">
                                <span class="font-semibold text-gray-600">Bitiş Tarixi:</span>
                                <span class="text-gray-700 font-medium">
                                <%= new Date(new Date(data.postedAt).setDate(new Date(data.postedAt).getDate() +
                                    30)).toLocaleString('az-AZ', { day: '2-digit' , month: '2-digit' , year: 'numeric' ,
                                    hour: '2-digit' , minute: '2-digit' , hour12: false }) %>
                            </span>
                            </li>
                            <li class="flex items-center justify-between pb-3">
                                <span class="font-semibold text-gray-600">Paylaş:</span>
                                <div class="flex items-center space-x-6">
                                    <a href="https://www.facebook.com/sharer/sharer.php?u=<%=data.redirectUrl%>"
                                       target="_blank" class="text-2xl transition-colors duration-300">
                                        <i class="fab fa-facebook-f text-[#1877f2] hover:text-gray-900"></i>
                                    </a>
                                    <a href="https://www.linkedin.com/sharing/share-offsite/?url=<%=data.redirectUrl%>"
                                       target="_blank" class="text-2xl transition-colors duration-300">
                                        <i class="fab fa-linkedin-in text-[#0A66C2] hover:text-gray-900"></i>
                                    </a>
                                    <button id="copyLinkButton" class="text-2xl transition-colors duration-300">
                                        <i class="fa-regular fa-copy text-gray-600 hover:text-gray-900"></i>
                                    </button>
                                </div>
                            </li>

                        </ul>

                    </div>

                </div>
                <div
                    class="bg-white shadow-md rounded-xl p-6 text-center hover:shadow-lg transition-shadow duration-200">
                    <a href="mailto:<%= data.email %>"
                       class="block filled-button-color hover:bg-orange-700 text-white font-medium py-3 px-6 rounded-lg">
                        Apply For Job
                    </a>
                </div>
            </aside>
        </div>
        <input type="hidden" id="categoryId" value="<%= data.categoryId %>">
    </section>
    <section>
        <div class="p-4 bg-gray-50">
            <div class="container mx-auto 2xl:px-28">
                <div class="sec-title mb-8 mt-3 flex flex-col items-center justify-center">
                    <h2 class="text-3xl text-center mb-3">Oxşar Vakansiyalar</h2>
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
                    <a href="/vakansiyalar"
                       class="rounded-full filled-button-color px-8 py-3 text-white hover:empty-button-color">
                        Daha Çox
                    </a>
                </div>
            </div>
        </div>
    </section>
@endsection
