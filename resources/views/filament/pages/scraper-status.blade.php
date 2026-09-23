<x-filament-panels::page>
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div class="rounded-xl bg-white p-5 shadow-sm ring-1 ring-gray-950/5 dark:bg-gray-900 dark:ring-white/10">
            <div class="text-sm text-gray-500">Son tarama</div>
            <div class="mt-1 text-2xl font-bold text-gray-900 dark:text-white">{{ $lastRun?->finished_at?->timezone($tz)->format('d.m.Y H:i') ?? '—' }}</div>
            <div class="mt-1 text-xs text-gray-500">{{ $lastRun?->region ? 'region: '.$lastRun->region : '' }} {{ $lastRun?->mode }}</div>
        </div>
        <div class="rounded-xl bg-white p-5 shadow-sm ring-1 ring-gray-950/5 dark:bg-gray-900 dark:ring-white/10">
            <div class="text-sm text-gray-500">Toplam eklenen ilan</div>
            <div class="mt-1 text-2xl font-bold text-gray-900 dark:text-white">{{ number_format($totals['listings']) }}</div>
            <div class="mt-1 text-xs text-gray-500">{{ $totals['sources'] }} kaynak</div>
        </div>
        <div class="rounded-xl bg-white p-5 shadow-sm ring-1 ring-gray-950/5 dark:bg-gray-900 dark:ring-white/10">
            <div class="text-sm text-gray-500">Son 24 saatte eklenen</div>
            <div class="mt-1 text-2xl font-bold text-emerald-600">{{ number_format($last24h) }}</div>
            <div class="mt-1 text-xs text-gray-500">scraped_vacancies (created_at)</div>
        </div>
        <div class="rounded-xl bg-white p-5 shadow-sm ring-1 ring-gray-950/5 dark:bg-gray-900 dark:ring-white/10">
            <div class="text-sm text-gray-500">Saat dilimi</div>
            <div class="mt-1 text-2xl font-bold text-gray-900 dark:text-white">{{ $tz }}</div>
            <div class="mt-1 text-xs text-gray-500">Şimdi: {{ $now->format('d.m.Y H:i') }}</div>
        </div>
        <div class="rounded-xl bg-white p-5 shadow-sm ring-1 ring-gray-950/5 dark:bg-gray-900 dark:ring-white/10">
            <div class="text-sm text-gray-500">Ortalama çalışma süresi</div>
            @php($avg = (int) round($avgSeconds))
            <div class="mt-1 text-2xl font-bold text-gray-900 dark:text-white">{{ $avg >= 60 ? floor($avg/60).' dəq '.($avg%60).' sn' : $avg.' sn' }}</div>
            <div class="mt-1 text-xs text-gray-500">son çalışmalara görə</div>
        </div>
    </div>

    <div class="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div class="rounded-xl bg-white p-5 shadow-sm ring-1 ring-gray-950/5 dark:bg-gray-900 dark:ring-white/10">
            <h3 class="text-base font-semibold text-gray-900 dark:text-white">Növbəti taramalar</h3>
            <div class="mt-3 grid grid-cols-1 gap-3 text-sm">
                <div><span class="text-gray-500">Bakü (günde 3, 4 saat arayla):</span> <b>{{ $next['baku']->format('d.m.Y') }}</b> 08:00–13:00 rastgele başlangıç</div>
                <div><span class="text-gray-500">boss.az (günde 1):</span> <b>{{ $next['boss']->format('d.m.Y H:i') }}</b></div>
                <div><span class="text-gray-500">Digər şəhərlər (həftə sonu):</span> <b>{{ $next['other']->format('d.m.Y H:i') }}</b></div>
            </div>
        </div>

        <div class="rounded-xl bg-white p-5 shadow-sm ring-1 ring-gray-950/5 dark:bg-gray-900 dark:ring-white/10">
            <h3 class="text-base font-semibold text-gray-900 dark:text-white">Cron cədvəli</h3>
            <table class="mt-3 w-full text-sm">
                <tbody class="divide-y divide-gray-100 dark:divide-white/5">
                    @foreach($cron as $c)
                        <tr>
                            <td class="py-2 pr-3 text-gray-700 dark:text-gray-300">{{ $c[0] }}</td>
                            <td class="py-2 pr-3"><code class="rounded bg-gray-100 px-2 py-0.5 dark:bg-gray-800">{{ $c[1] }}</code></td>
                            <td class="py-2 text-xs text-gray-500">{{ $c[2] }}</td>
                        </tr>
                    @endforeach
                </tbody>
            </table>
        </div>
    </div>

    <div class="mt-6 rounded-xl bg-white p-5 shadow-sm ring-1 ring-gray-950/5 dark:bg-gray-900 dark:ring-white/10">
        <h3 class="text-base font-semibold text-gray-900 dark:text-white">Trend — son çalışmalarda eklenen ilan</h3>
        <div class="mt-4 flex items-end gap-2 h-40">
            @foreach($trend as $t)
                <div class="flex-1 flex flex-col items-center justify-end h-full" title="{{ $t->finished_at?->timezone($tz)->format('d.m H:i') }} — {{ $t->inserted }}">
                    <span class="text-[10px] text-gray-500 mb-1">{{ $t->inserted }}</span>
                    <div class="w-full rounded-t bg-primary-500" style="height: {{ max(2, (int) round(($t->inserted / $trendMax) * 100)) }}%"></div>
                    <span class="text-[9px] text-gray-400 mt-1">{{ $t->finished_at?->timezone($tz)->format('d.m') }}</span>
                </div>
            @endforeach
            @if($trend->isEmpty())
                <div class="text-sm text-gray-500">Hələ çalışma qeydi yoxdur.</div>
            @endif
        </div>
    </div>

    <div class="mt-6 rounded-xl bg-white p-5 shadow-sm ring-1 ring-gray-950/5 dark:bg-gray-900 dark:ring-white/10">
        <h3 class="text-base font-semibold text-gray-900 dark:text-white">Günlük eklenen ilan (son 14 gün)</h3>
        <div class="mt-4 flex items-end gap-1 h-32">
            @foreach($dailySeries as $day => $v)
                <div class="flex-1 flex flex-col items-center justify-end h-full" title="{{ $day }} — {{ $v }}">
                    <div class="w-full rounded-t bg-emerald-500" style="height: {{ max(1, (int) round(($v / $dailyMax) * 100)) }}%"></div>
                    <span class="text-[9px] text-gray-400 mt-1">{{ \Carbon\Carbon::parse($day)->format('d.m') }}</span>
                </div>
            @endforeach
        </div>
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
                        <th class="text-right px-3 py-2">24s</th>
                        <th class="text-left px-3 py-2">Trend</th>
                        <th class="text-right px-3 py-2">Tekrar</th>
                        <th class="text-right px-3 py-2">Atlanan</th>
                        <th class="text-right px-5 py-2">Hata</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-gray-100 dark:divide-white/5">
                    @forelse($sources as $s)
                        @php($key = str_replace('.az', '', $s->source))
                        <tr>
                            <td class="px-5 py-2 font-medium text-gray-900 dark:text-white">{{ $s->label ?? $s->source }}</td>
                            <td class="px-3 py-2 text-gray-600 dark:text-gray-300">{{ $s->last_run_at?->timezone($tz)->format('d.m.Y H:i') ?? '—' }}</td>
                            <td class="px-3 py-2 text-right">{{ number_format($s->fetched) }}</td>
                            <td class="px-3 py-2 text-right">{{ number_format($s->ready) }}</td>
                            <td class="px-3 py-2 text-right font-semibold text-emerald-600">{{ number_format($s->inserted) }}</td>
                            <td class="px-3 py-2 text-right">{{ number_format($perSource24h[$key] ?? 0) }}</td>
                            @php($ser = $perSourceTrend[$s->source] ?? collect())
                            @php($sermax = max(1, (int) ($ser->max() ?? 1)))
                            <td class="px-3 py-2">
                                <div class="flex items-end gap-0.5 h-5">
                                    @foreach($ser as $v)
                                        <div class="w-1 rounded-sm bg-primary-500" style="height: {{ max(1, (int) round(($v / $sermax) * 20)) }}px"></div>
                                    @endforeach
                                </div>
                            </td>
                            <td class="px-3 py-2 text-right">{{ number_format($s->duplicates) }}</td>
                            <td class="px-3 py-2 text-right">{{ number_format($s->skipped) }}</td>
                            <td class="px-5 py-2 text-right {{ $s->errors ? 'text-red-600 font-semibold' : '' }}">{{ number_format($s->errors) }}</td>
                        </tr>
                    @empty
                        <tr><td colspan="10" class="px-5 py-6 text-center text-gray-500">Hələ məlumat yoxdur.</td></tr>
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
