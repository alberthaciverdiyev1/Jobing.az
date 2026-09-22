<?php

namespace App\Modules\Vacancy\Filament\Resources;

use App\Modules\Category\Models\Category;
use App\Modules\Company\Models\Company;
use App\Modules\Vacancy\Filament\Resources\VacancyResource\Pages;
use App\Modules\Vacancy\Models\Vacancy;
use Filament\Facades\Filament;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\Auth;

class VacancyResource extends Resource
{
    protected static ?string $model = Vacancy::class;

    protected static ?string $navigationIcon = 'heroicon-o-briefcase';
    protected static ?string $navigationGroup = null;

    public static function getNavigationGroup(): string
    {
        return __('Listing & Company Management');
    }
    protected static ?string $modelLabel = null;

    public static function getModelLabel(): string
    {
        return __('Job Listing');
    }
    protected static ?string $pluralModelLabel = null;

    public static function getPluralModelLabel(): string
    {
        return __('Job Listings');
    }
    protected static ?int $navigationSort = 1;

    public static function getEloquentQuery(): Builder
    {
        $query = parent::getEloquentQuery();

        // In the company panel, only show the logged-in company's vacancies.
        if (Filament::getCurrentPanel()?->getId() === 'company') {
            $query->where('company_id', Auth::user()?->company_id);
        }

        return $query;
    }

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Group::make()
                    ->schema([
                        Forms\Components\Section::make(__('Position & Company Information'))
                            ->schema([
                                Forms\Components\TextInput::make('title')
                                    ->label(__('Listing Title'))
                                    ->required()
                                    ->maxLength(255)
                                    ->columnSpanFull(),

                                Forms\Components\Select::make('company_id')
                                    ->label(__('Company'))
                                    ->relationship('company', 'name')
                                    ->searchable()
                                    ->preload()
                                    ->required(fn (): bool => Filament::getCurrentPanel()?->getId() !== 'company')
                                    ->default(fn (): ?int => Filament::getCurrentPanel()?->getId() === 'company' ? Auth::user()?->company_id : null)
                                    ->visible(fn (): bool => Filament::getCurrentPanel()?->getId() !== 'company')
                                    ->dehydrated(fn (): bool => Filament::getCurrentPanel()?->getId() !== 'company')
                                    ->createOptionForm([
                                        Forms\Components\TextInput::make('name')->required(),
                                        Forms\Components\TextInput::make('email')->email()->required(),
                                        Forms\Components\TextInput::make('location'),
                                    ]),

                                Forms\Components\Select::make('parent_category_id')
                                    ->label(__('Main Category'))
                                    ->options(fn () => Category::parents()->get()->pluck('name', 'id'))
                                    ->searchable()
                                    ->preload()
                                    ->live()
                                    ->afterStateUpdated(function (Forms\Set $set) {
                                        $set('category_id', null);
                                        $set('skillRecords', []);
                                    })
                                    ->dehydrated(false)
                                    ->default(function ($record) {
                                        if (!$record || !$record->category_id) return null;
                                        $cat = Category::find($record->category_id);
                                        return $cat?->parent_id ?? $cat?->id;
                                    }),

                                Forms\Components\Select::make('category_id')
                                    ->label(__('Subcategory'))
                                    ->options(function (Forms\Get $get) {
                                        $parentId = $get('parent_category_id');
                                        if (!$parentId) {
                                            return [];
                                        }
                                        $subcategories = Category::where('parent_id', $parentId)->get();
                                        if ($subcategories->isEmpty()) {
                                            return Category::where('id', $parentId)->get()->pluck('name', 'id');
                                        }
                                        return $subcategories->pluck('name', 'id');
                                    })
                                    ->searchable()
                                    ->preload()
                                    ->required()
                                    ->live()
                                    ->afterStateUpdated(fn (Forms\Set $set) => $set('skillRecords', [])),
                            ])->columns(2),

                        Forms\Components\Section::make(__('Job Description & Details'))
                            ->schema([
                                Forms\Components\RichEditor::make('description')
                                    ->label(__('Detailed Job Description'))
                                    ->required()
                                    ->columnSpanFull(),

                                Forms\Components\RichEditor::make('requirements')
                                    ->label(__('Requirements & Qualifications'))
                                    ->columnSpanFull(),
                            ]),
                    ])->columnSpan(['lg' => 2]),

                Forms\Components\Group::make()
                    ->schema([
                        Forms\Components\Section::make(__('Working Conditions & Salary'))
                            ->schema([
                                Forms\Components\Select::make('job_type_id')
                                    ->label(__('Job Type'))
                                    ->options(fn () => \App\Modules\JobAttribute\Models\JobType::all()
                                        ->sortBy(fn ($m) => (string) $m->name)
                                        ->mapWithKeys(fn ($m) => [(string) $m->id => (string) $m->name])
                                        ->all())
                                    ->searchable()
                                    ->preload()
                                    ->required(),

                                Forms\Components\Select::make('workplace_type_id')
                                    ->label(__('Workplace'))
                                    ->options(fn () => \App\Modules\JobAttribute\Models\WorkplaceType::all()
                                        ->sortBy(fn ($m) => (string) $m->name)
                                        ->mapWithKeys(fn ($m) => [(string) $m->id => (string) $m->name])
                                        ->all())
                                    ->searchable()
                                    ->preload()
                                    ->required(),

                                Forms\Components\Select::make('experience_level_id')
                                    ->label(__('Experience Level'))
                                    ->options(fn () => \App\Modules\JobAttribute\Models\ExperienceLevel::all()
                                        ->sortBy(fn ($m) => (string) $m->name)
                                        ->mapWithKeys(fn ($m) => [(string) $m->id => (string) $m->name])
                                        ->all())
                                    ->searchable()
                                    ->preload()
                                    ->required(),

                                Forms\Components\Select::make('city_id')
                                    ->label(__('City / Location'))
                                    ->options(fn () => \App\Modules\JobAttribute\Models\City::all()->pluck('name', 'id'))
                                    ->searchable()
                                    ->preload()
                                    ->required(),

                                Forms\Components\Grid::make(3)
                                    ->schema([
                                        Forms\Components\TextInput::make('salary_min')
                                            ->label(__('Min. Salary'))
                                            ->numeric(),

                                        Forms\Components\TextInput::make('salary_max')
                                            ->label(__('Max. Salary'))
                                            ->numeric(),

                                        Forms\Components\Select::make('currency')
                                            ->label(__('Unit'))
                                            ->options([
                                                'AZN' => 'AZN (₼)',
                                                'TRY' => 'TRY (₺)',
                                                'USD' => 'USD ($)',
                                                'EUR' => 'EUR (€)',
                                            ])
                                            ->default('AZN'),
                                    ]),

                                Forms\Components\Toggle::make('salary_negotiable')
                                    ->label(__('Salary negotiable'))
                                    ->live(),

                                Forms\Components\Select::make('skillRecords')
                                    ->label(__('Required Skills (Tags)'))
                                    ->options(function (Forms\Get $get) {
                                        // Seçilen kategoriye (ana + alt) bağlı etiketleri göster.
                                        $ids = array_filter([
                                            $get('parent_category_id'),
                                            $get('category_id'),
                                        ]);

                                        $query = \App\Modules\JobAttribute\Models\Skill::active();

                                        $options = $ids
                                            ? $query->whereIn('category_id', $ids)->get()
                                            : $query->get();

                                        return $options
                                            ->mapWithKeys(fn ($skill) => [$skill->id => (string) $skill->name])
                                            ->all();
                                    })
                                    ->relationship('skillRecords', 'name')
                                    ->multiple()
                                    ->searchable()
                                    ->preload(),

                                Forms\Components\DatePicker::make('deadline')
                                    ->label(__('Application Deadline'))
                                    ->native(false),
                            ]),

                        Forms\Components\Section::make(__('Application Type'))
                            ->schema([
                                Forms\Components\Select::make('application_type')
                                    ->label(__('Application Type'))
                                    ->options([
                                        'internal' => 'CV ilə (Daxili)',
                                        'email' => 'E-Posta ilə',
                                        'both' => 'Hər İkisi (CV + E-Posta)',
                                    ])
                                    ->default('internal')
                                    ->required()
                                    ->live(),

                                Forms\Components\TextInput::make('application_email')
                                    ->label(__('Application Email'))
                                    ->email()
                                    ->placeholder('hr@company.com')
                                    ->helperText(__('Required when email / both is selected.'))
                                    ->visible(fn (Forms\Get $get): bool => in_array($get('application_type'), ['email', 'both'], true))
                                    ->required(fn (Forms\Get $get): bool => in_array($get('application_type'), ['email', 'both'], true)),

                                Forms\Components\CheckboxList::make('application_fields')
                                    ->label(__('Application Form Fields'))
                                    ->helperText(__('Choose which fields appear when a candidate applies internally.'))
                                    ->options([
                                        'phone' => 'Telefon nömrəsi',
                                        'linkedin' => 'LinkedIn profili',
                                        'portfolio' => 'Portfolyo / GitHub',
                                        'cover_letter' => 'Ön yazı / Qeydlər',
                                    ])
                                    ->default(['phone', 'linkedin', 'portfolio', 'cover_letter'])
                                    ->visible(fn (Forms\Get $get): bool => in_array($get('application_type'), ['internal', 'both'], true)),
                            ]),

                        Forms\Components\Section::make(__('Publication Status'))
                            ->visible(fn (): bool => Filament::getCurrentPanel()?->getId() !== 'company')
                            ->schema([
                                Forms\Components\Toggle::make('is_active')
                                    ->label(__('Published / Active'))
                                    ->default(true),

                                Forms\Components\Toggle::make('is_featured')
                                    ->label(__('Featured / Promoted Listing'))
                                    ->default(false),
                            ]),
                    ])->columnSpan(['lg' => 1]),
            ])->columns(3);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->defaultSort('updated_at', 'desc')
            ->columns([
                Tables\Columns\TextColumn::make('title')
                    ->label(__('Position'))
                    ->searchable()
                    ->sortable()
                    ->weight('bold')
                    ->description(fn (Vacancy $record): string => $record->company->name ?? ''),

                Tables\Columns\TextColumn::make('category.name')
                    ->label(__('Category'))
                    ->badge()
                    ->color('primary')
                    ->sortable()
                    ->visible(fn (): bool => Filament::getCurrentPanel()?->getId() !== 'company'),

                Tables\Columns\TextColumn::make('formatted_salary')
                    ->label(__('Salary')),

                Tables\Columns\TextColumn::make('applications_count')
                    ->label(__('Application'))
                    ->counts('applications')
                    ->badge()
                    ->color('info')
                    ->sortable(),

                Tables\Columns\TextColumn::make('application_type')
                    ->label(__('Application'))
                    ->badge()
                    ->formatStateUsing(fn (string $state): string => match ($state) {
                        'internal' => 'CV (Daxili)',
                        'email' => 'E-Posta',
                        'both' => 'Hər İkisi',
                        default => ucfirst($state),
                    })
                    ->color(fn (string $state): string => match ($state) {
                        'internal' => 'primary',
                        'email' => 'info',
                        'both' => 'success',
                        default => 'gray',
                    })
                    ->sortable(),

                Tables\Columns\IconColumn::make('is_featured')
                    ->label(__('Featured'))
                    ->boolean()
                    ->sortable(),

                Tables\Columns\TextColumn::make('is_active')
                    ->label(__('Status'))
                    ->badge()
                    ->formatStateUsing(fn (bool $state): string => $state ? 'Yayında' : 'Təsdiq Gözləyir')
                    ->color(fn (bool $state): string => $state ? 'success' : 'warning')
                    ->sortable(),

                Tables\Columns\TextColumn::make('rejection_reason')
                    ->label(__('Rejection Reason'))
                    ->limit(40)
                    ->tooltip(fn ($record) => $record->rejection_reason)
                    ->toggleable(isToggledHiddenByDefault: true),

                Tables\Columns\TextColumn::make('created_at')
                    ->label(__('Publication'))
                    ->dateTime('d.m.Y')
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                Tables\Filters\SelectFilter::make('category')
                    ->label(__('By Category'))
                    ->attribute('category_id')
                    ->options(fn (): array => collect(\App\Modules\Category\Models\Category::all())
                        ->sortBy(fn ($c) => (string) $c->name)
                        ->mapWithKeys(fn ($c) => [(string) $c->id => (string) $c->name])
                        ->all()),

                Tables\Filters\SelectFilter::make('workplace_type')
                    ->options([
                        'Uzaktan' => 'Uzaktan',
                        'Hibrit' => 'Hibrit',
                        'Ofis' => 'Ofis',
                    ])
                    ->label(__('Work Mode')),

                Tables\Filters\TernaryFilter::make('is_active')
                    ->label(__('Status'))
                    ->placeholder(__('All Vacancies'))
                    ->trueLabel('Yayında Olanlar')
                    ->falseLabel('Təsdiq Gözləyənlər'),

                Tables\Filters\TernaryFilter::make('is_featured')
                    ->label(__('Featured Status')),
            ])
            ->actions([
                Tables\Actions\Action::make('bump')
                    ->label(__('Boost'))
                    ->icon('heroicon-o-arrow-up-circle')
                    ->color('warning')
                    ->requiresConfirmation()
                    ->modalHeading(__('Boost the Vacancy'))
                    ->modalDescription(__('This vacancy will immediately rise to the very first position and its date will be refreshed.'))
                    ->modalSubmitActionLabel(__('Boost'))
                    ->action(function (Vacancy $record) {
                        $record->bumped_at = now();
                        $record->save();
                        \Filament\Notifications\Notification::make()
                            ->title(__('Vacancy boosted successfully!'))
                            ->success()
                            ->send();
                    })
                    ->visible(fn (): bool => Filament::getCurrentPanel()?->getId() !== 'company'),

                // Company panel: choose a package and send the request to the admin via WhatsApp.
                Tables\Actions\Action::make('bump_request')
                    ->label(__('Boost'))
                    ->icon('heroicon-o-arrow-up-circle')
                    ->color('warning')
                    ->modalHeading(__('Boost Request'))
                    ->modalDescription(__('Choose a package and send it to the admin via WhatsApp.'))
                    ->modalContent(fn (Vacancy $record) => view('filament.components.promotion-request', ['mode' => 'bump', 'record' => $record]))
                    ->modalSubmitAction(false)
                    ->modalCancelActionLabel(__('Close'))
                    ->visible(fn (): bool => Filament::getCurrentPanel()?->getId() === 'company'),

                Tables\Actions\Action::make('toggle_featured')
                    ->label(fn (Vacancy $record): string => $record->is_featured ? 'Premiumu Ləğv Et' : 'Premium Et')
                    ->icon('heroicon-o-sparkles')
                    ->color('amber')
                    ->requiresConfirmation()
                    ->modalHeading(fn (Vacancy $record): string => $record->is_featured ? 'Premium Statusunu Ləğv Et' : 'Premium Statusu Ver')
                    ->action(function (Vacancy $record) {
                        $record->is_featured = !$record->is_featured;
                        if ($record->is_featured) {
                            $record->featured_until = now()->addDays(30);
                        } else {
                            $record->featured_until = null;
                        }
                        $record->save();
                        \Filament\Notifications\Notification::make()
                            ->title($record->is_featured ? 'Vakansiyaya Premium statusu verildi!' : 'Premium statusu ləğv edildi.')
                            ->success()
                            ->send();
                    })
                    ->visible(fn (): bool => Filament::getCurrentPanel()?->getId() !== 'company'),

                // Company panel: choose a package and send the premium request via WhatsApp.
                Tables\Actions\Action::make('premium_request')
                    ->label(__('Make Premium'))
                    ->icon('heroicon-o-sparkles')
                    ->color('amber')
                    ->modalHeading(__('Premium Request'))
                    ->modalDescription(__('Choose a package and send it to the admin via WhatsApp.'))
                    ->modalContent(fn (Vacancy $record) => view('filament.components.promotion-request', ['mode' => 'premium', 'record' => $record]))
                    ->modalSubmitAction(false)
                    ->modalCancelActionLabel(__('Close'))
                    ->visible(fn (): bool => Filament::getCurrentPanel()?->getId() === 'company'),

                Tables\Actions\Action::make('toggle_approve')
                    ->label(fn (Vacancy $record): string => $record->is_active ? 'Təsdiqi Ləğv Et' : 'Təsdiqlə')
                    ->icon(fn (Vacancy $record): string => $record->is_active ? 'heroicon-o-x-circle' : 'heroicon-o-check-circle')
                    ->color(fn (Vacancy $record): string => $record->is_active ? 'danger' : 'success')
                    ->requiresConfirmation()
                    ->action(function (Vacancy $record) {
                        $record->is_active = !$record->is_active;
                        if ($record->is_active) {
                            $record->rejection_reason = null;
                        }
                        $record->save();
                        \Filament\Notifications\Notification::make()
                            ->title($record->is_active ? 'Vakansiya təsdiqləndi və yayına alındı.' : 'Vakansiya təsdiqi ləğv edildi.')
                            ->success()
                            ->send();
                    })
                    ->visible(fn (): bool => Filament::getCurrentPanel()?->getId() === 'admin'),

                Tables\Actions\EditAction::make(),
                Tables\Actions\DeleteAction::make(),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),
                ]),
            ]);
    }

    public static function getRelations(): array
    {
        return [
            \App\Modules\Vacancy\Filament\Resources\VacancyResource\RelationManagers\ApplicationsRelationManager::class,
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListVacancies::route('/'),
            'create' => Pages\CreateVacancy::route('/create'),
            'edit' => Pages\EditVacancy::route('/{record}/edit'),
        ];
    }
}
