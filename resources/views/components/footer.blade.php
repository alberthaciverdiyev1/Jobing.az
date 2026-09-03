@php($siteSetting = \App\Modules\Setting\Models\SiteSetting::current())

<footer {{ $attributes->merge(['class' => 'bg-white pt-16 pb-8 border-t border-gray-200 mt-auto']) }}>
    <div class="container mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12 mb-12">
            <!-- Brand Col -->
            <div class="lg:col-span-2">
                <a href="{{ route('home') }}" class="flex items-center gap-2 mb-6">
                    <div class="w-8 h-8 bg-primary text-white rounded flex items-center justify-center font-bold">J</div>
                    <span class="font-bold text-xl text-dark tracking-tight">{{ config('app.brand_name') }}<span class="text-primary">{{ config('app.brand_suffix') }}</span></span>
                </a>
                <p class="text-gray-500 mb-6 max-w-sm text-sm leading-relaxed">
                    {{ $siteSetting->getTrans('footer_description', null, __('Azərbaycanda iş axtaranlar və işəgötürənlər üçün ən ideal platforma. Karyera yüksəlişinizə bizimlə başlayın.')) }}
                </p>
                <div class="flex space-x-3">
                    @if($siteSetting->facebook_url)
                    <a href="{{ $siteSetting->facebook_url }}" target="_blank" rel="noopener" class="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-primary hover:text-white transition-colors text-sm">
                        <i class="fab fa-facebook-f"></i>
                    </a>
                    @endif
                    @if($siteSetting->instagram_url)
                    <a href="{{ $siteSetting->instagram_url }}" target="_blank" rel="noopener" class="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-primary hover:text-white transition-colors text-sm">
                        <i class="fab fa-instagram"></i>
                    </a>
                    @endif
                    @if($siteSetting->linkedin_url)
                    <a href="{{ $siteSetting->linkedin_url }}" target="_blank" rel="noopener" class="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-primary hover:text-white transition-colors text-sm">
                        <i class="fab fa-linkedin-in"></i>
                    </a>
                    @endif
                    @if($siteSetting->telegram_url)
                    <a href="{{ $siteSetting->telegram_url }}" target="_blank" rel="noopener" class="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-primary hover:text-white transition-colors text-sm">
                        <i class="fab fa-telegram-plane"></i>
                    </a>
                    @endif
                </div>
            </div>

            <!-- Links Col 1 -->
            <div>
                <h4 class="font-bold text-gray-900 mb-4 text-sm">{{ __('Namizədlər üçün') }}</h4>
                <ul class="space-y-2.5 text-xs">
                    <li><a href="{{ route('jobs.index') }}" class="text-gray-500 hover:text-primary transition-colors">{{ __('Vakansiya axtarışı') }}</a></li>
                    <li><a href="{{ route('jobs.index') }}" class="text-gray-500 hover:text-primary transition-colors">{{ __('Uzaktan (Remote) Pozisyon') }}</a></li>
                    <li><a href="{{ route('jobs.index') }}" class="text-gray-500 hover:text-primary transition-colors">{{ __('Tam Zamanlı') }}</a></li>
                    <li><a href="{{ route('jobs.index', ['sort' => 'featured']) }}" class="text-gray-500 hover:text-primary transition-colors">{{ __('Öne Çıkan Fırsatlar') }}</a></li>
                </ul>
            </div>

            <!-- Links Col 2 -->
            <div>
                <h4 class="font-bold text-gray-900 mb-4 text-sm">{{ __('Şirkətlər üçün') }}</h4>
                <ul class="space-y-2.5 text-xs">
                    <li><a href="{{ route('jobs.create') }}" class="text-gray-500 hover:text-primary transition-colors">{{ __('Elan yerləşdir') }}</a></li>
                    <li><a href="{{ route('companies.index') }}" class="text-gray-500 hover:text-primary transition-colors">{{ __('Şirkətlər') }}</a></li>
                    <li><a href="{{ route('resumes.index') }}" class="text-gray-500 hover:text-primary transition-colors">{{ __('CV Bazası') }}</a></li>
                    <li><a href="{{ config('site.panels.admin') }}" target="_blank" class="text-gray-500 hover:text-primary transition-colors">{{ __('Yönetim Paneli') }}</a></li>
                </ul>
            </div>

            <!-- Links Col 3 -->
            <div>
                <h4 class="font-bold text-gray-900 mb-4 text-sm">{{ config('app.full_name') }}</h4>
                <ul class="space-y-2.5 text-xs">
                    <li><a href="{{ route('home') }}" class="text-gray-500 hover:text-primary transition-colors">{{ __('Ana Sayfa') }}</a></li>
                    <li><a href="{{ route('about') }}" class="text-gray-500 hover:text-primary transition-colors">{{ __('Haqqımızda') }}</a></li>
                    <li><a href="{{ route('jobs.index') }}" class="text-gray-500 hover:text-primary transition-colors">{{ __('Kategoriler') }}</a></li>
                    <li><a href="{{ route('blog.index') }}" class="text-gray-500 hover:text-primary transition-colors">{{ __('Kariyer Bloğu') }}</a></li>
                    <li><a href="{{ route('faq.index') }}" class="text-gray-500 hover:text-primary transition-colors">{{ __('Sıkça Sorulan Sorular') }}</a></li>
                    <li><a href="{{ route('contact.index') }}" class="text-gray-500 hover:text-primary transition-colors">{{ __('İletişim') }}</a></li>
                    <li><a href="{{ config('site.panels.admin') }}" target="_blank" class="text-gray-500 hover:text-primary transition-colors">Admin Portal</a></li>
                </ul>
            </div>
        </div>

        <div class="border-t border-gray-200 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500">
            <p>
                &copy; {{ date('Y') }} {{ $siteSetting->copyright_text ?: config('app.full_name') }}. {{ __('Tüm Hakları Saklıdır') }}.
            </p>
            <div class="flex items-center gap-2">
                Made with <i class="fas fa-heart text-red-500"></i> in Azerbaijan
            </div>
        </div>
    </div>
</footer>
