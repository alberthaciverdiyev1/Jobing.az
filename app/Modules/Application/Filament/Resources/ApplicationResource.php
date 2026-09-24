<?php

namespace App\Modules\Application\Filament\Resources;

use App\Modules\Application\Filament\Resources\ApplicationResource\Pages;
use App\Modules\Application\Models\Application;
use Filament\Facades\Filament;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\Auth;

/**
 * Admin paneline özel, global başvuru yönetimi.
 * (Company: CompanyApplicationResource, User: MyApplicationsResource.)
 */
class ApplicationResource extends Resource
{
    protected static ?string $model = Application::class;

    protected static ?string $navigationIcon = 'heroicon-o-document-text';
    protected static ?string $navigationGroup = null;

    public static function getNavigationGroup(): string
    {
        return __('Candidate & Application Management');
    }
    protected static ?string $modelLabel = null;

    public static function getModelLabel(): string
    {
        return __('Application');
    }
    protected static ?string $pluralModelLabel = null;

    public static function getPluralModelLabel(): string
    {
        return __('Job Applications');
    }
    protected static ?int $navigationSort = 1;

    public static function getEloquentQuery(): Builder
    {
        return parent::getEloquentQuery();
    }

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Section::make(__('Candidate Information'))
                    ->schema([
                        Forms\Components\Select::make('vacancy_id')
                            ->label(__('Applied Vacancy'))
                            ->relationship('vacancy', 'title')
                            ->searchable()
                            ->preload()
                            ->required(),

                        Forms\Components\TextInput::make('applicant_name')->label(__('Candidate Full Name'))->required()->maxLength(255),
                        Forms\Components\TextInput::make('applicant_email')->label(__('Email Address'))->email()->required()->maxLength(255),
                        Forms\Components\TextInput::make('applicant_phone')->label(__('Phone'))->tel()->maxLength(255),
                        Forms\Components\TextInput::make('portfolio_url')->label(__('Portfolio / GitHub URL'))->url()->maxLength(255),
                        Forms\Components\TextInput::make('linkedin_url')->label(__('LinkedIn Profile'))->url()->maxLength(255),

                        Forms\Components\Placeholder::make('resume_preview')
                            ->label(__('Candidate CV / Resume'))
                            ->content(function (?Application $record) {
                                if (! $record) {
                                    return null;
                                }

                                if ($record->resume_id && $record->resume) {
                                    $resume = $record->resume;
                                    $expCount = is_array($resume->work_experiences) ? count($resume->work_experiences) : 0;
                                    $eduCount = is_array($resume->education) ? count($resume->education) : 0;
                                    $skillsCount = is_array($resume->skills) ? count($resume->skills) : 0;

                                    return new \Illuminate\Support\HtmlString('
                                        <div class="p-4 rounded-2xl border border-orange-200/80 bg-orange-50/40 dark:bg-gray-800/60 space-y-3">
                                            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                                <div>
                                                    <div class="font-extrabold text-sm text-gray-900 dark:text-white flex items-center gap-2">
                                                        <span class="px-2 py-0.5 rounded-full bg-orange-100 text-orange-800 text-[10px] font-bold">Daxili CV</span>
                                                        <span>' . e($resume->title ?: __('CV / Resume')) . '</span>
                                                    </div>
                                                    <div class="text-xs text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-2">
                                                        <span>' . e($resume->full_name) . '</span>
                                                        ' . ($resume->location ? '<span>• ' . e($resume->location) . '</span>' : '') . '
                                                        ' . ($resume->phone ? '<span>• ' . e($resume->phone) . '</span>' : '') . '
                                                    </div>
                                                </div>
                                                <div class="flex items-center gap-2">
                                                    <a href="' . route('resumes.show', $resume->id) . '" target="_blank"
                                                       class="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shadow-xs transition">
                                                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                                                        <span>CV Tam Görüntüle</span>
                                                    </a>
                                                    <a href="' . route('resumes.show', ['resume' => $resume->id, 'print' => 1]) . '" target="_blank"
                                                       class="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition">
                                                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
                                                        <span>PDF Endir / Çap</span>
                                                    </a>
                                                </div>
                                            </div>
                                            ' . ($resume->summary ? '<div class="text-xs text-gray-600 dark:text-gray-300 line-clamp-2 bg-white/70 dark:bg-gray-900/40 p-2.5 rounded-xl border border-orange-100">' . e($resume->summary) . '</div>' : '') . '
                                            <div class="flex flex-wrap items-center gap-2 pt-1 text-[11px] text-gray-500">
                                                <span class="px-2 py-0.5 rounded-md bg-white border border-gray-200 font-semibold">' . $expCount . ' İş deneyimi</span>
                                                <span class="px-2 py-0.5 rounded-md bg-white border border-gray-200 font-semibold">' . $eduCount . ' Eğitim</span>
                                                <span class="px-2 py-0.5 rounded-md bg-white border border-gray-200 font-semibold">' . $skillsCount . ' Beceri</span>
                                            </div>
                                        </div>
                                    ');
                                }

                                if ($record->resume_path) {
                                    return new \Illuminate\Support\HtmlString('
                                        <div class="p-4 rounded-2xl border border-blue-200/80 bg-blue-50/40 dark:bg-gray-800/60 flex items-center justify-between">
                                            <div>
                                                <div class="font-bold text-xs text-gray-900 dark:text-white flex items-center gap-2">
                                                    <span class="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[10px] font-bold">Fayl</span>
                                                    <span>Yüklenmiş CV Belgesi</span>
                                                </div>
                                                <div class="text-[11px] text-gray-500 mt-1">' . e(basename($record->resume_path)) . '</div>
                                            </div>
                                            <a href="' . asset('storage/' . $record->resume_path) . '" target="_blank"
                                               class="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-primary hover:bg-primary-dark text-white font-bold text-xs shadow-xs transition">
                                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
                                                <span>Faylı Aç / Endir</span>
                                            </a>
                                        </div>
                                    ');
                                }

                                return new \Illuminate\Support\HtmlString('<span class="text-xs text-gray-400">' . __('No CV added') . '</span>');
                            })
                            ->columnSpanFull(),

                        Forms\Components\Textarea::make('cover_letter')->label(__('Cover Letter / Note'))->rows(3)->columnSpanFull(),
                    ])->columns(2),

                Forms\Components\Section::make(__('Evaluation & Status'))
                    ->schema([
                        Forms\Components\Select::make('status')
                            ->label(__('Application Status'))
                            ->options([
                                'Beklemede' => __('Pending'),
                                'İncelendi' => __('Under Review'),
                                'Mülakat' => __('Invited to Interview'),
                                'Teklif' => __('Offer Made'),
                                'Kabul' => __('Hired'),
                                'Red' => __('Rejected'),
                            ])
                            ->required()
                            ->default('Beklemede'),

                        Forms\Components\Textarea::make('notes')->label(__('HR Internal Notes'))->rows(3)->columnSpanFull(),
                    ]),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('applicant_name')->label(__('Candidate Name'))->searchable()->sortable()->weight('bold'),
                Tables\Columns\TextColumn::make('vacancy.title')->label(__('Listing'))->searchable()->sortable()->limit(30),
                Tables\Columns\TextColumn::make('applicant_email')->label(__('Email'))->searchable()->copyable(),
                Tables\Columns\TextColumn::make('status')->label(__('Status'))->badge()
                    ->color(fn (string $state): string => match ($state) {
                        'Beklemede' => 'gray',
                        'İncelendi' => 'info',
                        'Mülakat' => 'warning',
                        'Teklif', 'Kabul' => 'success',
                        'Red' => 'danger',
                        default => 'primary',
                    }),
                Tables\Columns\TextColumn::make('cv_view')
                    ->label(__('CV / Resume'))
                    ->state(function (Application $record): string {
                        if ($record->resume_id && $record->resume) {
                            return __('View CV (') . ($record->resume->title ?: 'Daxili CV') . ')';
                        }
                        if ($record->resume_path) {
                            return __('Download File');
                        }
                        return 'Yoxdur';
                    })
                    ->badge(fn (Application $record): bool => (bool) ($record->resume_id || $record->resume_path))
                    ->color(fn (Application $record): string => $record->resume_id ? 'warning' : ($record->resume_path ? 'info' : 'gray'))
                    ->icon(fn (Application $record): ?string => $record->resume_id ? 'heroicon-o-identification' : ($record->resume_path ? 'heroicon-o-arrow-down-tray' : null))
                    ->url(function (Application $record): ?string {
                        if ($record->resume_id) {
                            return route('resumes.show', $record->resume_id);
                        }
                        if ($record->resume_path) {
                            return asset('storage/' . $record->resume_path);
                        }
                        return null;
                    }, shouldOpenInNewTab: true),
                Tables\Columns\TextColumn::make('created_at')->label(__('Application Date'))->dateTime('d.m.Y H:i')->sortable(),
            ])
            ->filters([
                Tables\Filters\SelectFilter::make('status')
                    ->options([
                        'Beklemede' => __('Pending'),
                        'İncelendi' => __('Under Review'),
                        'Mülakat' => __('Invited to Interview'),
                        'Teklif' => __('Offer Made'),
                        'Kabul' => __('Hired'),
                        'Red' => __('Rejected'),
                    ])
                    ->label(__('By Status')),
            ])
            ->actions([
                Tables\Actions\Action::make('view_resume')
                    ->label(__('View CV'))
                    ->icon('heroicon-o-eye')
                    ->color('warning')
                    ->visible(fn (Application $record): bool => (bool) $record->resume_id)
                    ->url(fn (Application $record): string => route('resumes.show', $record->resume_id), shouldOpenInNewTab: true),

                Tables\Actions\Action::make('download_pdf')
                    ->label(__('Download PDF'))
                    ->icon('heroicon-o-arrow-down-tray')
                    ->color('success')
                    ->visible(fn (Application $record): bool => (bool) $record->resume_id)
                    ->url(fn (Application $record): string => route('resumes.show', ['resume' => $record->resume_id, 'print' => 1]), shouldOpenInNewTab: true),

                Tables\Actions\Action::make('download_file')
                    ->label(__('Download File'))
                    ->icon('heroicon-o-arrow-down-tray')
                    ->color('info')
                    ->visible(fn (Application $record): bool => (bool) ($record->resume_path && ! $record->resume_id))
                    ->url(fn (Application $record): string => asset('storage/' . $record->resume_path), shouldOpenInNewTab: true),

                Tables\Actions\EditAction::make(),
                Tables\Actions\DeleteAction::make(),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),
                ]),
            ]);
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListApplications::route('/'),
            'create' => Pages\CreateApplication::route('/create'),
            'edit' => Pages\EditApplication::route('/{record}/edit'),
        ];
    }
}
