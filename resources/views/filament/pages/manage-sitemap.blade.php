<x-filament-panels::page>
    <div class="space-y-6">
        <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
            <div class="max-w-3xl">
                <h3 class="text-lg font-bold text-gray-900 dark:text-white">{{ __('Create New Sitemap') }}</h3>
                <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Bu alət vakansiyaları, şirkətləri, bloq yazılarını və iş arayan elanlarını sitemap.xml faylına əlavə edir.
                    Hər faylda maksimum 10.000 keçid ola bilər; limit aşılarsa avtomatik olaraq sitemap_1.xml, sitemap_2.xml və sitemap indeks faylı yaradılır.
                </p>
            </div>
            <x-filament::button wire:click="generateSitemap" size="lg" color="warning" icon="heroicon-o-cpu-chip" class="flex-shrink-0">
                Sitemap XML-ləri Yarat
            </x-filament::button>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
            <div class="px-6 py-4 border-b border-gray-100 dark:border-gray-700">
                <h3 class="text-md font-bold text-gray-900 dark:text-white">{{ __('Existing Sitemap Files') }}</h3>
            </div>

            @if(empty($sitemaps))
                <div class="p-8 text-center text-gray-500 dark:text-gray-400">
                    <span>Hazırda heç bir sitemap.xml faylı yoxdur. Yuxarıdakı düymə ilə yaradın.</span>
                </div>
            @else
                <div class="overflow-x-auto">
                    <table class="w-full text-left border-collapse">
                        <thead>
                            <tr class="bg-gray-50 dark:bg-gray-700/50 text-gray-500 dark:text-gray-400 text-xs font-semibold uppercase border-b border-gray-100 dark:border-gray-700">
                                <th class="px-6 py-3">{{ __('File Name') }}</th>
                                <th class="px-6 py-3">{{ __('Type') }}</th>
                                <th class="px-6 py-3">{{ __('Link Count') }}</th>
                                <th class="px-6 py-3">{{ __('Size') }}</th>
                                <th class="px-6 py-3">{{ __('Last Updated') }}</th>
                                <th class="px-6 py-3">{{ __('Link') }}</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-100 dark:divide-gray-700">
                            @foreach($sitemaps as $sitemap)
                                <tr class="hover:bg-gray-50 dark:hover:bg-gray-700/30 text-sm text-gray-700 dark:text-gray-300">
                                    <td class="px-6 py-4 font-medium text-gray-900 dark:text-white">{{ $sitemap['name'] }}</td>
                                    <td class="px-6 py-4">
                                        @if($sitemap['is_index'])
                                            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">{{ __('Index File') }}</span>
                                        @else
                                            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400">{{ __('Links') }}</span>
                                        @endif
                                    </td>
                                    <td class="px-6 py-4 font-semibold">{{ number_format($sitemap['count']) }}</td>
                                    <td class="px-6 py-4">{{ $sitemap['size'] }}</td>
                                    <td class="px-6 py-4">{{ $sitemap['modified_at'] }}</td>
                                    <td class="px-6 py-4">
                                        <a href="{{ $sitemap['url'] }}" target="_blank" class="inline-flex items-center gap-1 text-xs font-bold text-orange-600 hover:text-orange-500 dark:text-orange-400">
                                            Aç
                                        </a>
                                    </td>
                                </tr>
                            @endforeach
                        </tbody>
                    </table>
                </div>
            @endif
        </div>
    </div>
</x-filament-panels::page>
