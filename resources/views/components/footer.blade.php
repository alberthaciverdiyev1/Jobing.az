@php
    $siteSetting = \App\Modules\Setting\Models\SiteSetting::current();
    $locales = config('app.available_locales');
    $currentLocale = app()->getLocale();

    $socialUrl = fn (string $field) => $siteSetting->{$field} ?: config('site.social_fallbacks.' . $field);

    $socialLinks = array_filter([
        ['url' => $socialUrl('facebook_url'), 'icon' => 'fa-facebook-f', 'label' => 'Facebook'],
        ['url' => $socialUrl('instagram_url'), 'icon' => 'fa-instagram', 'label' => 'Instagram'],
        ['url' => $socialUrl('linkedin_url'), 'icon' => 'fa-linkedin-in', 'label' => 'LinkedIn'],
        ['url' => $socialUrl('telegram_url'), 'icon' => 'fa-telegram-plane', 'label' => 'Telegram'],
        ['url' => $socialUrl('twitter_url'), 'icon' => 'fa-x-twitter', 'label' => 'X'],
        ['url' => $socialUrl('youtube_url'), 'icon' => 'fa-youtube', 'label' => 'YouTube'],
    ], fn ($s) => ! empty($s['url']));

    $cleanPhone = $siteSetting->phone ? preg_replace('/[^0-9+]/', '', $siteSetting->phone) : null;

    $footerDesc = $siteSetting->getTrans('footer_description', null, __('The ideal platform for job seekers and employers in Northern Cyprus. Start your career growth with us.'));

    $linkClass = 'text-sm text-gray-500 hover:text-primary transition-colors';
    $headingClass = 'text-sm font-semibold text-gray-900 mb-4';
@endphp

<footer {{ $attributes->merge(['class' => 'bg-white border-t border-gray-200 mt-auto']) }}>
    <div class="container mx-auto px-4 sm:px-6 lg:px-8">

        
        <div class="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8 py-10 border-b border-gray-100">
            <div class="max-w-xl">
                <a href="{{ url('/') }}" class="inline-flex items-center mb-4">
                    <img src="{{ asset('images/logo/kariyer-kibriskare-wordmark.png') }}" alt="{{ config('app.full_name') }}" class="h-9 w-auto">
                </a>

                <p class="text-sm text-gray-500 leading-relaxed mb-5">{{ $footerDesc }}</p>

                <div class="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6">
                    @if($siteSetting->phone)
                    <a href="tel:{{ $cleanPhone }}" class="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-primary transition-colors">
                        <i class="fas fa-phone text-xs text-primary"></i>
                        <span>{{ $siteSetting->phone }}</span>
                    </a>
                    @endif

                    @if($siteSetting->email)
                    <a href="mailto:{{ $siteSetting->email }}" class="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-primary transition-colors">
                        <i class="far fa-envelope text-xs text-primary"></i>
                        <span>{{ $siteSetting->email }}</span>
                    </a>
                    @endif
                </div>
            </div>

            <div class="flex flex-col gap-5 lg:items-end">
                @if($socialLinks)
                <div class="flex items-center gap-2">
                    @foreach($socialLinks as $social)
                    <a href="{{ $social['url'] }}" target="_blank" rel="noopener"
                       aria-label="{{ $social['label'] }}"
                       class="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-primary hover:text-white transition-colors text-sm">
                        <i class="fab {{ $social['icon'] }}"></i>
                    </a>
                    @endforeach
                </div>
                @endif

                @if(!empty($locales))
                <div class="flex flex-wrap items-center gap-1">
                    @foreach($locales as $code => $data)
                    <a href="{{ route('lang.switch', $code) }}"
                       class="text-sm px-2 py-1 rounded transition-colors {{ $currentLocale === $code ? 'text-primary font-semibold' : 'text-gray-500 hover:text-primary' }}">
                        {{ $data['name'] }}
                    </a>
                    @endforeach
                </div>
                @endif
            </div>
        </div>

        {{-- Orta sıra: link sütunları --}}
        <div class="grid grid-cols-2 md:grid-cols-3 gap-8 py-10 border-b border-gray-100">
            <div>
                <h4 class="{{ $headingClass }}">{{ __('For Candidates') }}</h4>
                <ul class="space-y-3">
                    <li><a href="{{ route('jobs.index') }}" class="{{ $linkClass }}">{{ __('Vacancies') }}</a></li>
                    <li><a href="{{ route('job-seekers.index') }}" class="{{ $linkClass }}">{{ __("I'm Hiring Myself") }}</a></li>
                    <li><a href="{{ route('resumes.index') }}" class="{{ $linkClass }}">{{ __('Resume Database') }}</a></li>
                    <li><a href="{{ route('favorites.index') }}" class="{{ $linkClass }}">{{ __('Favorites') }}</a></li>
                </ul>
            </div>

            <div>
                <h4 class="{{ $headingClass }}">{{ __('For Companies') }}</h4>
                <ul class="space-y-3">
                    <li><a href="{{ route('jobs.create') }}" class="{{ $linkClass }}">{{ __('Post an ad') }}</a></li>
                    <li><a href="{{ route('companies.index') }}" class="{{ $linkClass }}">{{ __('Companies') }}</a></li>
                    <li><a href="{{ route('resumes.index') }}" class="{{ $linkClass }}">{{ __('Resume Database') }}</a></li>
                    <li><a href="{{ route('job-seekers.create') }}" class="{{ $linkClass }}">{{ __('Job seeking listing') }}</a></li>
                </ul>
            </div>

            <div>
                <h4 class="{{ $headingClass }}">{{ config('app.full_name') }}</h4>
                <ul class="space-y-3">
                    <li><a href="{{ route('about') }}" class="{{ $linkClass }}">{{ __('About Us') }}</a></li>
                    <li><a href="{{ route('blog.index') }}" class="{{ $linkClass }}">{{ __('Career Blog') }}</a></li>
                    <li><a href="{{ route('faq.index') }}" class="{{ $linkClass }}">{{ __('Frequently Asked Questions') }}</a></li>
                    <li><a href="{{ route('contact.index') }}" class="{{ $linkClass }}">{{ __('Contact') }}</a></li>
                </ul>
            </div>
        </div>

        
        <div class="flex flex-col sm:flex-row items-center justify-between gap-3 py-6 text-xs text-gray-500">
            <p>
                &copy; {{ date('Y') }} {{ $siteSetting->copyright_text ?: config('app.full_name') }}. {{ __('All Rights Reserved') }}.
            </p>

            <div class="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
                <a href="{{ route('faq.index') }}" class="hover:text-primary transition-colors">{{ __('Frequently Asked Questions') }}</a>
                <a href="{{ route('contact.index') }}" class="hover:text-primary transition-colors">{{ __('Contact') }}</a>
            </div>
        </div>
    </div>
</footer>
