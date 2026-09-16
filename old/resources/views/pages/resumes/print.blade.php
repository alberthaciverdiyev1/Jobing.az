<!DOCTYPE html>
<html lang="az">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ $resume->full_name }} — {{ $resume->title ?: 'CV' }}</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');

        body {
            font-family: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
            background-color: #f1f5f9;
            color: #0f172a;
            line-height: 1.5;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
        }

        @media print {
            .no-print {
                display: none !important;
            }
            body {
                background-color: #ffffff !important;
                padding: 0 !important;
                margin: 0 !important;
            }
            .cv-paper {
                box-shadow: none !important;
                border: none !important;
                max-width: 100% !important;
                width: 100% !important;
                padding: 0 !important;
            }
            .page-break-inside-avoid {
                page-break-inside: avoid;
            }
        }
    </style>
</head>
<body class="py-8 px-4 sm:px-6">

    <!-- Top Action Bar (Hidden when Printing) -->
    <div class="no-print max-w-4xl mx-auto mb-6 flex items-center justify-between bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <button onclick="window.history.back()" class="inline-flex items-center gap-2 text-xs font-bold text-slate-700 hover:text-slate-900 cursor-pointer">
            <i class="fas fa-arrow-left text-xs"></i>
            <span>Geriyə Qayıt</span>
        </button>

        <button onclick="window.print()" class="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs shadow-sm transition cursor-pointer">
            <i class="fas fa-print text-xs"></i>
            <span>Çap Et / PDF Olaraq Saxla</span>
        </button>
    </div>

    <!-- Authentic PDF Template CV Sheet -->
    <div class="cv-paper max-w-4xl mx-auto bg-white border border-slate-300 shadow-md p-8 sm:p-12 space-y-6">
        
        <!-- Header Section -->
        <div class="flex flex-col sm:flex-row items-center sm:items-start gap-6 pb-6 border-b-2 border-slate-700">
            
            @if(!empty($resume->photo))
            <div class="shrink-0">
                <img src="{{ asset('storage/' . $resume->photo) }}" alt="{{ $resume->full_name }}" 
                     class="w-36 h-36 rounded-full object-cover border-2 border-slate-300 shadow-sm">
            </div>
            @endif

            <div class="flex-1 space-y-2 text-center sm:text-left">
                <h1 class="text-3xl sm:text-4xl font-black text-slate-900 tracking-wider uppercase leading-none">
                    {{ $resume->full_name }}
                </h1>
                
                @if($resume->title)
                <p class="text-lg font-bold text-slate-800">
                    {{ $resume->title }}
                </p>
                @endif

                <!-- Contact Grid (2 columns) -->
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1.5 text-xs font-medium text-slate-800 pt-2">
                    @if($resume->phone)
                    <div class="flex items-center justify-center sm:justify-start gap-2">
                        <i class="fas fa-phone text-slate-900 text-xs"></i>
                        <span>{{ $resume->phone }}</span>
                    </div>
                    @endif

                    @if($resume->whatsapp)
                    <div class="flex items-center justify-center sm:justify-start gap-2">
                        <i class="fab fa-whatsapp text-emerald-700 text-xs"></i>
                        <span>{{ $resume->whatsapp }} (WhatsApp)</span>
                    </div>
                    @endif

                    @if($resume->email)
                    <div class="flex items-center justify-center sm:justify-start gap-2">
                        <i class="fas fa-envelope text-slate-900 text-xs"></i>
                        <a href="mailto:{{ $resume->email }}" class="text-blue-700 hover:underline font-semibold">{{ $resume->email }}</a>
                    </div>
                    @endif

                    @if($resume->github_url)
                    <div class="flex items-center justify-center sm:justify-start gap-2">
                        <i class="fab fa-github text-slate-900 text-xs"></i>
                        <a href="{{ $resume->github_url }}" target="_blank" class="text-blue-700 hover:underline font-semibold">{{ str_replace(['https://', 'http://', 'github.com/'], '', $resume->github_url) }}</a>
                    </div>
                    @endif

                    @if($resume->linkedin_url)
                    <div class="flex items-center justify-center sm:justify-start gap-2">
                        <i class="fab fa-linkedin text-blue-700 text-xs"></i>
                        <a href="{{ $resume->linkedin_url }}" target="_blank" class="text-blue-700 hover:underline font-semibold">LinkedIn Profil</a>
                    </div>
                    @endif

                    @if($resume->location)
                    <div class="flex items-center justify-center sm:justify-start gap-2 sm:col-span-2">
                        <i class="fas fa-map-marker-alt text-slate-900 text-xs"></i>
                        <span>{{ $resume->location }}</span>
                    </div>
                    @endif
                </div>
            </div>
        </div>

        <!-- Profile Section -->
        @if($resume->summary)
        <div class="space-y-2">
            <h2 class="text-xl sm:text-2xl font-bold text-slate-900 text-center tracking-wide uppercase pt-2">
                Profile
            </h2>
            <p class="text-xs text-slate-800 leading-relaxed text-justify">
                {{ $resume->summary }}
            </p>
        </div>
        @endif

        <!-- Skills Section -->
        @if(!empty($resume->skills) && count($resume->skills) > 0)
        <div class="space-y-2 pt-2">
            <h2 class="text-xl sm:text-2xl font-bold text-slate-900 text-center tracking-wide uppercase">
                Skills
            </h2>
            <ul class="list-disc list-inside space-y-1 text-xs text-slate-900 font-medium">
                @foreach($resume->skills as $sk)
                <li>
                    <strong class="text-slate-900">{{ $sk['skill'] ?? '' }}:</strong>
                    @if(!empty($sk['level']))
                    <span class="text-slate-700">{{ match($sk['level']) { 'beginner' => 'Başlanğıc', 'intermediate' => 'Orta', 'advanced' => 'Yüksək', 'expert' => 'Uzman', default => $sk['level'] } }}</span>
                    @endif
                </li>
                @endforeach
            </ul>
        </div>
        @endif

        <!-- Work Experience Section -->
        @if(!empty($resume->work_experiences) && count($resume->work_experiences) > 0)
        <div class="space-y-4 pt-2">
            <h2 class="text-xl sm:text-2xl font-bold text-slate-900 text-center tracking-wide uppercase">
                Work Experience
            </h2>

            <div class="space-y-4">
                @foreach($resume->work_experiences as $exp)
                <div class="space-y-2 page-break-inside-avoid">
                    <!-- Underlined Header Line -->
                    <div class="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-900 pb-1 text-xs font-bold text-slate-900">
                        <div class="text-sm">
                            <span class="font-extrabold uppercase">{{ $exp['company'] ?? '' }}</span>
                            @if(!empty($exp['position']))
                            <span> • {{ $exp['position'] }}</span>
                            @endif
                        </div>
                        <div class="font-mono text-slate-900 shrink-0 font-bold">
                            {{ !empty($exp['start_date']) ? \Carbon\Carbon::parse($exp['start_date'])->format('F Y') : '' }} — 
                            {{ !empty($exp['is_current']) ? 'Present' : (!empty($exp['end_date']) ? \Carbon\Carbon::parse($exp['end_date'])->format('F Y') : '') }}
                        </div>
                    </div>

                    @if(!empty($exp['description']))
                    <ul class="list-disc list-inside space-y-1 text-xs text-slate-800 pl-1 leading-relaxed">
                        @foreach(explode("\n", $exp['description']) as $line)
                            @if(trim($line))
                            <li>{{ trim($line) }}</li>
                            @endif
                        @endforeach
                    </ul>
                    @endif
                </div>
                @endforeach
            </div>
        </div>
        @endif

        <!-- Education Section -->
        @if(!empty($resume->education) && count($resume->education) > 0)
        <div class="space-y-3 pt-2">
            <h2 class="text-xl sm:text-2xl font-bold text-slate-900 text-center tracking-wide uppercase">
                Education
            </h2>

            <div class="space-y-2">
                @foreach($resume->education as $edu)
                <div class="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-400 pb-1 text-xs text-slate-900 page-break-inside-avoid">
                    <div>
                        <strong class="text-slate-900 font-extrabold">{{ $edu['field_of_study'] ?? ($edu['institution'] ?? '') }}</strong>
                        @if(!empty($edu['institution']) && !empty($edu['field_of_study']))
                        <span> • {{ $edu['institution'] }}</span>
                        @endif
                        @if(!empty($edu['degree']))
                        <span class="text-slate-700"> ({{ match($edu['degree']) { 'bachelor' => 'Bakalavr', 'master' => 'Magistr', 'phd' => 'Doktora (PhD)', default => $edu['degree'] } }})</span>
                        @endif
                    </div>
                    <div class="font-mono text-slate-700 text-[11px] font-semibold shrink-0">
                        {{ !empty($edu['start_date']) ? \Carbon\Carbon::parse($edu['start_date'])->format('m/Y') : '' }} — 
                        {{ !empty($edu['is_current']) ? 'Present' : (!empty($edu['end_date']) ? \Carbon\Carbon::parse($edu['end_date'])->format('m/Y') : '') }}
                    </div>
                </div>
                @endforeach
            </div>
        </div>
        @endif

        <!-- Languages Section -->
        @if(!empty($resume->languages) && count($resume->languages) > 0)
        <div class="space-y-3 pt-2">
            <h2 class="text-xl sm:text-2xl font-bold text-slate-900 text-center tracking-wide uppercase">
                Languages
            </h2>

            <div class="max-w-xs space-y-1.5 text-xs">
                @foreach($resume->languages as $lang)
                <div class="flex items-center justify-between border-b border-slate-900 pb-1">
                    <strong class="text-slate-900">{{ match($lang['language'] ?? '') { 
                        'Azerbaijani' => 'Azerbaijani',
                        'Turkish' => 'Turkish',
                        'English' => 'English',
                        'Russian' => 'Russian',
                        'German' => 'German',
                        'French' => 'French',
                        'Spanish' => 'Spanish',
                        default => $lang['language'] ?? ''
                    } }}</strong>
                    @if(!empty($lang['level']))
                    <span class="text-slate-800 font-semibold">• {{ match($lang['level']) { 'native' => 'C2 (Ana dili)', 'fluent' => 'C1-C2', 'intermediate' => 'B1-B2', 'basic' => 'A1-A2', default => $lang['level'] } }}</span>
                    @endif
                </div>
                @endforeach
            </div>
        </div>
        @endif

        <!-- Projects Section -->
        @if(!empty($resume->projects) && count($resume->projects) > 0)
        <div class="space-y-3 pt-2">
            <h2 class="text-xl sm:text-2xl font-bold text-slate-900 text-center tracking-wide uppercase">
                Projects
            </h2>

            <div class="space-y-3">
                @foreach($resume->projects as $proj)
                <div class="space-y-1 page-break-inside-avoid">
                    <div class="flex items-center justify-between border-b border-slate-400 pb-1 text-xs">
                        <strong class="text-slate-900 text-sm font-extrabold">{{ $proj['name'] ?? '' }} @if(!empty($proj['role'])) • {{ $proj['role'] }}@endif</strong>
                        <div class="space-x-3 text-xs font-semibold">
                            @if(!empty($proj['github_url']))
                            <a href="{{ $proj['github_url'] }}" target="_blank" class="text-blue-700 hover:underline">GitHub</a>
                            @endif
                            @if(!empty($proj['demo_url']))
                            <a href="{{ $proj['demo_url'] }}" target="_blank" class="text-blue-700 hover:underline">Live Demo</a>
                            @endif
                        </div>
                    </div>
                    @if(!empty($proj['technologies']))<p class="text-xs text-slate-700 font-medium">Technologies: {{ $proj['technologies'] }}</p>@endif
                    @if(!empty($proj['description']))<p class="text-xs text-slate-700 leading-relaxed">{{ $proj['description'] }}</p>@endif
                </div>
                @endforeach
            </div>
        </div>
        @endif

        <!-- Certificates & Awards Section -->
        @if((!empty($resume->certificates) && count($resume->certificates) > 0) || (!empty($resume->awards) && count($resume->awards) > 0))
        <div class="space-y-3 pt-2">
            <h2 class="text-xl sm:text-2xl font-bold text-slate-900 text-center tracking-wide uppercase">
                Certificates & Awards
            </h2>

            <div class="space-y-2 text-xs">
                @if(!empty($resume->certificates) && count($resume->certificates) > 0)
                @foreach($resume->certificates as $cert)
                <div class="flex items-center justify-between border-b border-slate-400 pb-1">
                    <div>
                        <strong class="text-slate-900">{{ $cert['name'] ?? '' }}</strong>
                        @if(!empty($cert['issuer']))<span class="text-slate-700"> — {{ $cert['issuer'] }}</span>@endif
                    </div>
                    <div class="font-mono text-slate-700 text-[11px] font-medium">
                        @if(!empty($cert['date'])){{ \Carbon\Carbon::parse($cert['date'])->format('m/Y') }}@endif
                        @if(!empty($cert['url'])) • <a href="{{ $cert['url'] }}" target="_blank" class="text-blue-700 underline font-semibold">Təsdiq</a>@endif
                    </div>
                </div>
                @endforeach
                @endif

                @if(!empty($resume->awards) && count($resume->awards) > 0)
                @foreach($resume->awards as $aw)
                <div class="flex items-center justify-between border-b border-slate-400 pb-1">
                    <div>
                        <strong class="text-slate-900">{{ $aw['title'] ?? '' }}</strong>
                        @if(!empty($aw['issuer']))<span class="text-slate-700"> — {{ $aw['issuer'] }}</span>@endif
                    </div>
                    @if(!empty($aw['date']))
                    <span class="font-mono text-slate-700 text-[11px] font-medium">{{ \Carbon\Carbon::parse($aw['date'])->format('m/Y') }}</span>
                    @endif
                </div>
                @endforeach
                @endif
            </div>
        </div>
        @endif

    </div>

    @if($autoPrint)
    <script>
        window.addEventListener('load', function() {
            setTimeout(function() {
                window.print();
            }, 400);
        });
    </script>
    @endif

</body>
</html>
