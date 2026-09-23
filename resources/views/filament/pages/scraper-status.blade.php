<x-filament-panels::page>
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:16px">
        <x-filament::section heading="Növbəti taramalar" icon="heroicon-o-clock">
            <div style="display:flex;flex-direction:column;gap:8px;font-size:14px">
                <div><span style="color:#6b7280">Bakü (günde 3: 09:00, 14:00, 19:00):</span> <b>{{ $next['baku']->format('d.m.Y H:i') }}</b></div>
                <div><span style="color:#6b7280">boss.az (günde 1):</span> <b>{{ $next['boss']->format('d.m.Y H:i') }}</b></div>
                <div><span style="color:#6b7280">Digər şəhərlər (həftə sonu):</span> <b>{{ $next['other']->format('d.m.Y H:i') }}</b></div>
            </div>
        </x-filament::section>

        <x-filament::section heading="Cron cədvəli" icon="heroicon-o-command-line">
            <table style="width:100%;border-collapse:collapse;font-size:14px">
                <tbody>
                @foreach($cron as $c)
                    <tr style="border-top:1px solid rgba(128,128,128,.2)">
                        <td style="padding:6px 8px 6px 0">{{ $c[0] }}</td>
                        <td style="padding:6px 8px">
                            <code style="background:rgba(128,128,128,.15);border-radius:4px;padding:2px 6px">{{ $c[1] }}</code>
                        </td>
                        <td style="padding:6px 0;color:#6b7280;font-size:12px">{{ $c[2] }}</td>
                    </tr>
                @endforeach
                </tbody>
            </table>
        </x-filament::section>
    </div>

    <x-filament::section heading="Trend — son çalışmalarda eklenen ilan">
        <div style="display:flex;align-items:flex-end;gap:6px;height:160px">
            @forelse($trend as $t)
                <div style="flex:1;display:flex;flex-direction:column;align-items:center;justify-content:flex-end;height:100%"
                     title="{{ $t->finished_at?->timezone($tz)->format('d.m H:i') }} — {{ $t->inserted }}">
                    <span style="font-size:10px;color:#6b7280;margin-bottom:2px">{{ $t->inserted }}</span>
                    <div style="width:100%;border-radius:4px 4px 0 0;background:#f59e0b;height:{{ max(2, (int) round(($t->inserted / $trendMax) * 100)) }}%"></div>
                    <span style="font-size:9px;color:#9ca3af;margin-top:2px">{{ $t->finished_at?->timezone($tz)->format('d.m') }}</span>
                </div>
            @empty
                <div style="color:#6b7280">Hələ çalışma qeydi yoxdur.</div>
            @endforelse
        </div>
    </x-filament::section>

    <x-filament::section heading="Günlük eklenen ilan (son 14 gün)">
        <div style="display:flex;align-items:flex-end;gap:3px;height:130px">
            @foreach($dailySeries as $day => $v)
                <div style="flex:1;display:flex;flex-direction:column;align-items:center;justify-content:flex-end;height:100%" title="{{ $day }} — {{ $v }}">
                    <div style="width:100%;border-radius:4px 4px 0 0;background:#10b981;height:{{ max(1, (int) round(($v / $dailyMax) * 100)) }}%"></div>
                    <span style="font-size:9px;color:#9ca3af;margin-top:2px">{{ \Carbon\Carbon::parse($day)->format('d.m') }}</span>
                </div>
            @endforeach
        </div>
    </x-filament::section>

    <x-filament::section heading="Kaynak durumu">
        <div style="overflow-x:auto">
            <table style="width:100%;border-collapse:collapse;font-size:13px">
                <thead>
                    <tr style="text-align:left;color:#6b7280;border-bottom:2px solid rgba(128,128,128,.25)">
                        <th style="padding:8px 10px">Kaynak</th>
                        <th style="padding:8px 10px">Son tarama</th>
                        <th style="padding:8px 10px;text-align:right">Çekilen</th>
                        <th style="padding:8px 10px;text-align:right">Hazır</th>
                        <th style="padding:8px 10px;text-align:right">Eklenen</th>
                        <th style="padding:8px 10px;text-align:right">24s</th>
                        <th style="padding:8px 10px">Trend</th>
                        <th style="padding:8px 10px;text-align:right">Tekrar</th>
                        <th style="padding:8px 10px;text-align:right">Atlanan</th>
                        <th style="padding:8px 10px;text-align:right">Hata</th>
                    </tr>
                </thead>
                <tbody>
                @forelse($sources as $s)
                    @php($key = str_replace('.az', '', $s->source))
                    @php($ser = $perSourceTrend[$s->source] ?? collect())
                    @php($sermax = max(1, (int) ($ser->max() ?? 1)))
                    <tr style="border-bottom:1px solid rgba(128,128,128,.15)">
                        <td style="padding:6px 10px;font-weight:600">{{ $s->label ?? $s->source }}</td>
                        <td style="padding:6px 10px;color:#6b7280">{{ $s->last_run_at?->timezone($tz)->format('d.m.Y H:i') ?? '—' }}</td>
                        <td style="padding:6px 10px;text-align:right">{{ number_format($s->fetched) }}</td>
                        <td style="padding:6px 10px;text-align:right">{{ number_format($s->ready) }}</td>
                        <td style="padding:6px 10px;text-align:right;font-weight:700;color:#10b981">{{ number_format($s->inserted) }}</td>
                        <td style="padding:6px 10px;text-align:right">{{ number_format($perSource24h[$key] ?? 0) }}</td>
                        <td style="padding:6px 10px">
                            <div style="display:flex;align-items:flex-end;gap:2px;height:20px">
                                @foreach($ser as $v)
                                    <div style="width:3px;border-radius:2px;background:#f59e0b;height:{{ max(1, (int) round(($v / $sermax) * 20)) }}px"></div>
                                @endforeach
                            </div>
                        </td>
                        <td style="padding:6px 10px;text-align:right">{{ number_format($s->duplicates) }}</td>
                        <td style="padding:6px 10px;text-align:right">{{ number_format($s->skipped) }}</td>
                        <td style="padding:6px 10px;text-align:right;{{ $s->errors ? 'color:#dc2626;font-weight:700' : '' }}">{{ number_format($s->errors) }}</td>
                    </tr>
                @empty
                    <tr><td colspan="10" style="padding:24px;text-align:center;color:#6b7280">Hələ məlumat yoxdur.</td></tr>
                @endforelse
                </tbody>
            </table>
        </div>
    </x-filament::section>

    <x-filament::section heading="Son çalışmalar">
        <div style="overflow-x:auto">
            <table style="width:100%;border-collapse:collapse;font-size:13px">
                <thead>
                    <tr style="text-align:left;color:#6b7280;border-bottom:2px solid rgba(128,128,128,.25)">
                        <th style="padding:8px 10px">Tarix</th>
                        <th style="padding:8px 10px">Bölgə</th>
                        <th style="padding:8px 10px;text-align:right">Çekilen</th>
                        <th style="padding:8px 10px;text-align:right">Eklenen</th>
                        <th style="padding:8px 10px;text-align:right">Tekrar</th>
                        <th style="padding:8px 10px;text-align:right">Hata</th>
                    </tr>
                </thead>
                <tbody>
                @forelse($runs as $r)
                    <tr style="border-bottom:1px solid rgba(128,128,128,.15)">
                        <td style="padding:6px 10px">{{ ($r->finished_at ?? $r->created_at)?->timezone($tz)->format('d.m.Y H:i') }}</td>
                        <td style="padding:6px 10px">{{ $r->region }}</td>
                        <td style="padding:6px 10px;text-align:right">{{ number_format($r->fetched) }}</td>
                        <td style="padding:6px 10px;text-align:right;font-weight:700;color:#10b981">{{ number_format($r->inserted) }}</td>
                        <td style="padding:6px 10px;text-align:right">{{ number_format($r->duplicates) }}</td>
                        <td style="padding:6px 10px;text-align:right;{{ $r->errors ? 'color:#dc2626' : '' }}">{{ number_format($r->errors) }}</td>
                    </tr>
                @empty
                    <tr><td colspan="6" style="padding:24px;text-align:center;color:#6b7280">Çalışma qeydi yoxdur.</td></tr>
                @endforelse
                </tbody>
            </table>
        </div>
    </x-filament::section>
</x-filament-panels::page>
