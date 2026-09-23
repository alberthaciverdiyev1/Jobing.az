<x-filament-panels::page>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="rounded-xl bg-white p-5 shadow-sm ring-1 ring-gray-950/5 dark:bg-gray-900 dark:ring-white/10">
            <div class="text-sm text-gray-500">Son tarama</div>
            <div class="mt-1 text-2xl font-bold text-gray-900 dark:text-white">
                {{ $lastRun?->finished_at?->timezone($tz)->format('d.m.Y H:i') ?? '—' }}
            </div>
            <div class="mt-1 text-xs text-gray-500">{{ $lastRun?->region ? 'region: '.$lastRun->region : '' }} {{ $lastRun?->mode }}</div>
        </div>
        <div class="rounded-xl bg-white p-5 shadow-sm ring-1 ring-gray-950/5 dark:bg-gray-900 dark:ring-white/10">
            <div class="text-sm text-gray-500">Toplam eklenen ilan</div>
            <div class="mt-1 text-2xl font-bold text-gray-900 dark:text-white">{{ number_format($totals['listings']) }}</div>
            <div class="mt-1 text-xs text-gray-500">{{ $totals['sources'] }} kaynak</div>
        </div>
        <div class="rounded-xl bg-white p-5 shadow-sm ring-1 ring-gray-950/5 dark:bg-gray-900 dark:ring-white/10">
            <div class="text-sm text-gray-500">Saat dilimi</div>
            <div class="mt-1 text-2xl font-bold text-gray-900 dark:text-white">{{ $tz }}</div>
            <div class="mt-1 text-xs text-gray-500">Şimdi: {{ $now->format('d.m.Y H:i') }}</div>
        </div>
    </div>

    <div class="mt-6 rounded-xl bg-white p-5 shadow-sm ring-1 ring-gray-950/5 dark:bg-gray-900 dark:ring-white/10">
        <h3 class="text-base font-semibold text-gray-900 dark:text-white">Növbəti taramalar</h3>
        <div class="mt-3 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div><span class="text-gray-500">Bakü (günde 3, 4 saat arayla):</span> <b>{{ $next['baku']->format('d.m.Y') }}</b> 08:00–13:00 arası rastgele başlangıç</div>
            <div><span class="text-gray-500">boss.az (günde 1):</span> <b>{{ $next['boss']->format('d.m.Y H:i') }}</b></div>
            <div><span class="text-gray-500">Digər şəhərlər (həftə sonu):</span> <b>{{ $next['other']->format('d.m.Y H:i') }}</b></div>
        </div>
        @if(!empty($schedule))
            <div class="mt-2 text-xs text-gray-500">Zamanlama: {{ json_encode($schedule, JSON_UNESCAPED_UNICODE) }}</div>
        @endif
    </div>

    <div class="mt-6 rounded-xl bg-white shadow-sm ring-1 ring-gray-950/5 dark:bg-gray-900 dark:ring-white/10 overflow-hidden">
        <div class="p-5 text-base font-semibold text-gray-900 dark:text-white">Kaynak durumu</div>
        <div class="overflow-x-auto">
            <table class="w-full text-sm">
                <thead class="bg-gray-50 text-gray-500 dark:bg-gray-800">
                    <tr>
                        <th class="text-left px-5 py-2">Kaynak</th>
                        <th class="text-left px-3 py-2">Son tarama</th>
                        <th class="text-right px-3 py-2">Çekilen</th>
                        <th class="text-right px-3 py-2">Hazır</th>
                        <th class="text-right px-3 py-2">Eklenen</th>
                        <th class="text-right px-3 py-2">Tekrar</th>
                        <th class="text-right px-3 py-2">Atlanan</th>
                        <th class="text-right px-5 py-2">Hata</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-gray-100 dark:divide-white/5">
                    @forelse($sources as $s)
                        <tr>
                            <td class="px-5 py-2 font-medium text-gray-900 dark:text-white">{{ $s->label ?? $s->source }}</td>
                            <td class="px-3 py-2 text-gray-600 dark:text-gray-300">{{ $s->last_run_at?->timezone($tz)->format('d.m.Y H:i') ?? '—' }}</td>
                            <td class="px-3 py-2 text-right">{{ number_format($s->fetched) }}</td>
                            <td class="px-3 py-2 text-right">{{ number_format($s->ready) }}</td>
                            <td class="px-3 py-2 text-right font-semibold text-emerald-600">{{ number_format($s->inserted) }}</td>
                            <td class="px-3 py-2 text-right">{{ number_format($s->duplicates) }}</td>
                            <td class="px-3 py-2 text-right">{{ number_format($s->skipped) }}</td>
                            <td class="px-5 py-2 text-right {{ $s->errors ? 'text-red-600 font-semibold' : '' }}">{{ number_format($s->errors) }}</td>
                        </tr>
                    @empty
                        <tr><td colspan="8" class="px-5 py-6 text-center text-gray-500">Hələ məlumat yoxdur. Scraper işlədikdən sonra dolacaq.</td></tr>
                    @endforelse
                </tbody>
            </table>
        </div>
    </div>

    <div class="mt-6 rounded-xl bg-white shadow-sm ring-1 ring-gray-950/5 dark:bg-gray-900 dark:ring-white/10 overflow-hidden">
        <div class="p-5 text-base font-semibold text-gray-900 dark:text-white">Son çalışmalar</div>
        <div class="overflow-x-auto">
            <table class="w-full text-sm">
                <thead class="bg-gray-50 text-gray-500 dark:bg-gray-800">
                    <tr>
                        <th class="text-left px-5 py-2">Tarix</th>
                        <th class="text-left px-3 py-2">Bölgə</th>
                        <th class="text-right px-3 py-2">Çekilen</th>
                        <th class="text-right px-3 py-2">Eklenen</th>
                        <th class="text-right px-3 py-2">Tekrar</th>
                        <th class="text-right px-5 py-2">Hata</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-gray-100 dark:divide-white/5">
                    @forelse($runs as $r)
                        <tr>
                            <td class="px-5 py-2">{{ ($r->finished_at ?? $r->created_at)?->timezone($tz)->format('d.m.Y H:i') }}</td>
                            <td class="px-3 py-2">{{ $r->region }}</td>
                            <td class="px-3 py-2 text-right">{{ number_format($r->fetched) }}</td>
                            <td class="px-3 py-2 text-right text-emerald-600 font-semibold">{{ number_format($r->inserted) }}</td>
                            <td class="px-3 py-2 text-right">{{ number_format($r->duplicates) }}</td>
                            <td class="px-5 py-2 text-right {{ $r->errors ? 'text-red-600' : '' }}">{{ number_format($r->errors) }}</td>
                        </tr>
                    @empty
                        <tr><td colspan="6" class="px-5 py-6 text-center text-gray-500">Çalışma qeydi yoxdur.</td></tr>
                    @endforelse
                </tbody>
            </table>
        </div>
    </div>
</x-filament-panels::page>
