@extends('web::main')
@section('body')
<div class="lg:w-1/2 mx-auto lg:mt-28 mt-20 mb-16 px-10">
    <div class="border border-gray-300 rounded-2xl shadow-xl bg-white p-6">
        <h2 class="text-3xl font-bold text-gray-800 mb-6 border-b-2 border-gray-300 pb-3 text-center">Tez-tez verilən suallar</h2>
        <div class="space-y-4">
            <div class="border-custom rounded-xl overflow-hidden shadow-sm">
                <button class="w-full text-left p-5 font-semibold flex justify-between items-center  hover:hover-card-color transition-all duration-300" onclick="toggleFAQ(this)">
                    <span>Jobing.az-da necə iş tapa bilərəm?</span>
                    <span class="icon text-lg">+</span>
                </button>
                <div class="p-5 hidden text-gray-700 bg-white border-t border-gray-200">Axtarış bölməsindən istifadə edərək uyğun vakansiyaları tapa bilərsiniz. Açar sözlər və kateqoriyalar üzrə filtrləmə aparın.</div>
            </div>
            <div class="border-custom rounded-xl overflow-hidden shadow-sm">
                <button class="w-full text-left p-5 font-semibold flex justify-between items-center hover:hover-card-color transition-all duration-300" onclick="toggleFAQ(this)">
                    <span>Pulsuz iş elanlarını necə yerləşdirə bilərəm?</span>
                    <span class="icon text-lg">+</span>
                </button>
                <div class="p-5 hidden text-gray-700 bg-white border-t border-gray-200">Saytdan qeydiyyatdan keçməyə ehtiyac yoxdur. Birbaşa “Elan Yerləşdir" bölməsinə keçid edin. Vakansiya məlumatlarını doldurun və elanınızı dərc edin.</div>
            </div>
            <div class="border-custom rounded-xl overflow-hidden shadow-sm">
                <button class="w-full text-left p-5 font-semibold flex justify-between items-center hover:hover-card-color transition-all duration-300" onclick="toggleFAQ(this)">
                    <span>Jobing.az ödənişsizdir?</span>
                    <span class="icon text-lg">+</span>
                </button>
                <div class="p-5 hidden text-gray-700 bg-white border-t border-gray-200">İş axtaranlar üçün platformadan istifadə tamamilə pulsuzdur. İşəgötürənlər isə həm pulsuz iş elanı yerləşdirə, həm də müəyyən ödənişli xidmətlərdən faydalana bilərlər.</div>
            </div>
            <div class="border-custom rounded-xl overflow-hidden shadow-sm">
                <button class="w-full text-left p-5 font-semibold flex justify-between items-center hover:hover-card-color transition-all duration-300" onclick="toggleFAQ(this)">
                    <span>Jobing.az-dakı vakansiyalar nə qədər aktualdır?</span>
                    <span class="icon text-lg">+</span>
                </button>
                <div class="p-5 hidden text-gray-700 bg-white border-t border-gray-200">Bütün vakansiyalar mütəmadi olaraq yenilənir. Hər bir iş elanı yerləşdirildikdən sonra müəyyən müddət aktiv qalır.</div>
            </div>
            <div class="border-custom rounded-xl overflow-hidden shadow-sm">
                <button class="w-full text-left p-5 font-semibold flex justify-between items-center hover:hover-card-color transition-all duration-300" onclick="toggleFAQ(this)">
                    <span>İş elanlarını sosial mediada paylaşmaq mümkündürmü?</span>
                    <span class="icon text-lg">+</span>
                </button>
                <div class="p-5 hidden text-gray-700 bg-white border-t border-gray-200">Bəli, hər bir vakansiyanın səhifəsində sosial media paylaşma düymələri var. Vakansiyanı Facebook, LinkedIn, Twitter və WhatsApp-da paylaşa bilərsiniz.</div>
            </div>
        </div>
    </div>
</div>

<script>
    function toggleFAQ(button) {
        const content = button.nextElementSibling;
        const icon = button.querySelector('.icon');

        if (content.classList.contains('hidden')) {
            content.classList.remove('hidden');
            content.classList.add('block');
            icon.textContent = '-';
        } else {
            content.classList.add('hidden');
            content.classList.remove('block');
            icon.textContent = '+';
        }
    }
</script>

@endsection
