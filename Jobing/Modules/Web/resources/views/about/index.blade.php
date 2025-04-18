@extends('web::main')
@section('body')
    <div class="overflow-hidden mt-20">
    <div class="container mx-auto px-4 sm:px-8 lg:px-24 xl:px-48">
        <div class="flex flex-col lg:flex-row items-center lg:space-x-6">
            <div class="flex-shrink-0 mb-6 lg:mb-0">
                <div class="relative z-10 lg:mr-8">
                    <div class="img1">
                        <img src="{{asset('images/static/about_1_1.png')}}" alt="About" class="w-full max-w-[300px] sm:max-w-[400px] md:max-w-[500px] lg:max-w-[650px]">
                    </div>
                </div>
            </div>
            <div class="flex-1 pt-4 md:pt-0 lg:ps-4 lg:ms-6">
                <div class="mb-8">
                    <h2 class="sec-title text-gray-800 text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
                        <span class="orange-text">Jobing.az</span> - İş Axtarışınızı 2x Sürətləndirdik!
                    </h2>
                </div>
                <p class="mt-[-8px] mb-6 text-gray-700 max-w-full sm:max-w-[500px] md:max-w-[600px] lg:max-w-[720px]">
                    "İş tapma prosesi hələ belə asan olmamışdı" deyəcəyiniz innovativ bir platforma təqdim edirik.
                    Bizim məqsədimiz müxtəlif sahələrdəki iş elanlarını bir məkanda toplamaq və istifadəçilərimizə
                    daha rahat bir iş axtarışı təcrübəsi təqdim etməkdir.

                    İş axtarışınızı asanlaşdırmaq üçün geniş çeşidli iş elanları, filtreləmə imkanları və
                    istifadəçi dostu interfeys təqdim edir.
                </p>
            </div>
        </div>
    </div>
</div>
@endsection
