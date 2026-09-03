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
    protected static ?string $navigationGroup = 'İlan & Şirket Yönetimi';
    protected static ?string $modelLabel = 'İş İlanı';
    protected static ?string $pluralModelLabel = 'İş İlanları';
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
                        Forms\Components\Section::make('Pozisyon & Şirket Bilgisi')
                            ->schema([
                                Forms\Components\TextInput::make('title')
                                    ->label('İlan Başlığı')
                                    ->required()
                                    ->maxLength(255)
                                    ->columnSpanFull(),

                                Forms\Components\Select::make('company_id')
                                    ->label('Şirket')
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
                                    ->label('Ana Kateqoriya')
                                    ->options(fn () => Category::parents()->get()->pluck('name', 'id'))
                                    ->searchable()
                                    ->preload()
                                    ->live()
                                    ->afterStateUpdated(fn (Forms\Set $set) => $set('category_id', null))
                                    ->dehydrated(false)
                                    ->default(function ($record) {
                                        if (!$record || !$record->category_id) return null;
                                        $cat = Category::find($record->category_id);
                                        return $cat?->parent_id ?? $cat?->id;
                                    }),

                                Forms\Components\Select::make('category_id')
                                    ->label('Alt Kateqoriya')
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
                                    ->required(),
                            ])->columns(2),

                        Forms\Components\Section::make('İş Tanımı & Detaylar')
                            ->schema([
                                Forms\Components\RichEditor::make('description')
                                    ->label('Detaylı İş Tanımı')
                                    ->required()
                                    ->columnSpanFull(),

                                Forms\Components\RichEditor::make('requirements')
                                    ->label('Aranan Nitelikler & Gereksinimler')
                                    ->columnSpanFull(),
                            ]),
                    ])->columnSpan(['lg' => 2]),

                Forms\Components\Group::make()
                    ->schema([
                        Forms\Components\Section::make('Çalışma Şartları & Maaş')
                            ->schema([
                                Forms\Components\Select::make('job_type_id')
                                    ->label('İş Rejimi')
                                    ->options(fn () => \App\Modules\JobAttribute\Models\JobType::all()->pluck('name', 'id'))
                                    ->searchable()
                                    ->preload()
                                    ->required(),

                                Forms\Components\Select::make('workplace_type_id')
                                    ->label('Çalışma Yeri')
                                    ->options(fn () => \App\Modules\JobAttribute\Models\WorkplaceType::all()->pluck('name', 'id'))
                                    ->searchable()
                                    ->preload()
                                    ->required(),

                                Forms\Components\Select::make('experience_level_id')
                                    ->label('Təcrübə Səviyyəsi')
                                    ->options(fn () => \App\Modules\JobAttribute\Models\ExperienceLevel::all()->pluck('name', 'id'))
                                    ->searchable()
                                    ->preload()
                                    ->required(),

                                Forms\Components\Select::make('city_id')
                                    ->label('Şəhər / Lokasiya')
                                    ->options(fn () => \App\Modules\JobAttribute\Models\City::all()->pluck('name', 'id'))
                                    ->searchable()
                                    ->preload()
                                    ->required(),

                                Forms\Components\Grid::make(3)
                                    ->schema([
                                        Forms\Components\TextInput::make('salary_min')
                                            ->label('Min. Maaş')
                                            ->numeric(),

                                        Forms\Components\TextInput::make('salary_max')
                                            ->label('Maks. Maaş')
                                            ->numeric(),

                                        Forms\Components\Select::make('currency')
                                            ->label('Birim')
                                            ->options([
                                                'AZN' => 'AZN (₼)',
                                                'TRY' => 'TRY (₺)',
                                                'USD' => 'USD ($)',
                                                'EUR' => 'EUR (€)',
                                            ])
                                            ->default('AZN'),
                                    ]),

                                Forms\Components\Toggle::make('salary_negotiable')
                                    ->label('Maaş razılaşma yolu ilə')
                                    ->helperText('Seçilərsə, maaş namizədlə razılaşma əsasında müəyyən edilir.')
                                    ->live(),

                                Forms\Components\Select::make('skills')
                                    ->label('Tələb olunan Bacarıqlar (Teqlər)')
                                    ->options(fn () => \App\Modules\JobAttribute\Models\Skill::active()->pluck('name', 'name'))
                                    ->multiple()
                                    ->searchable()
                                    ->preload(),

                                Forms\Components\DatePicker::make('deadline')
                                    ->label('Son Başvuru Tarihi')
                                    ->native(false),
                            ]),

                        Forms\Components\Section::make('Müraciət Növü')
                            ->schema([
                                Forms\Components\Select::make('application_type')
                                    ->label('Müraciət Növü')
                                    ->options([
                                        'internal' => 'CV ilə (Daxili)',
                                        'email' => 'E-Posta ilə',
                                        'both' => 'Hər İkisi (CV + E-Posta)',
                                    ])
                                    ->default('internal')
                                    ->required()
                                    ->live(),

                                Forms\Components\TextInput::make('application_email')
                                    ->label('Müraciət E-Postası')
                                    ->email()
                                    ->placeholder('hr@company.com')
                                    ->helperText('E-posta / hər ikisi seçildiyində tələb olunur.')
                                    ->visible(fn (Forms\Get $get): bool => in_array($get('application_type'), ['email', 'both'], true))
                                    ->required(fn (Forms\Get $get): bool => in_array($get('application_type'), ['email', 'both'], true)),
                            ]),

                        Forms\Components\Section::make('Yayın Durumu')
                            ->visible(fn (): bool => Filament::getCurrentPanel()?->getId() !== 'company')
                            ->schema([
                                Forms\Components\Toggle::make('is_active')
                                    ->label('Yayında / Aktif')
                                    ->default(true),

                                Forms\Components\Toggle::make('is_featured')
                                    ->label('Vitrin / Öne Çıkarılan İlan')
                                    ->default(false),
                            ]),
                    ])->columnSpan(['lg' => 1]),
            ])->columns(3);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('title')
                    ->label('Pozisyon')
                    ->searchable()
                    ->sortable()
                    ->weight('bold')
                    ->description(fn (Vacancy $record): string => $record->company->name ?? ''),

                Tables\Columns\TextColumn::make('category.name')
                    ->label('Kategori')
                    ->badge()
                    ->color('primary')
                    ->sortable(),

                Tables\Columns\TextColumn::make('formatted_salary')
                    ->label('Maaş'),

                Tables\Columns\TextColumn::make('applications_count')
                    ->label('Başvuru')
                    ->counts('applications')
                    ->badge()
                    ->color('info')
                    ->sortable(),

                Tables\Columns\TextColumn::make('application_type')
                    ->label('Müraciət')
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
                    ->label('Vitrin')
                    ->boolean()
                    ->sortable(),

                Tables\Columns\TextColumn::make('is_active')
                    ->label('Status')
                    ->badge()
                    ->formatStateUsing(fn (bool $state): string => $state ? 'Yayında' : 'Təsdiq Gözləyir')
                    ->color(fn (bool $state): string => $state ? 'success' : 'warning')
                    ->sortable(),

                Tables\Columns\TextColumn::make('created_at')
                    ->label('Yayın')
                    ->dateTime('d.m.Y')
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                Tables\Filters\SelectFilter::make('category')
                    ->relationship('category', 'name')
                    ->label('Kategoriye Göre'),

                Tables\Filters\SelectFilter::make('workplace_type')
                    ->options([
                        'Uzaktan' => 'Uzaktan',
                        'Hibrit' => 'Hibrit',
                        'Ofis' => 'Ofis',
                    ])
                    ->label('Çalışma Şekli'),

                Tables\Filters\TernaryFilter::make('is_active')
                    ->label('Status')
                    ->placeholder('Bütün Vakansiyalar')
                    ->trueLabel('Yayında Olanlar')
                    ->falseLabel('Təsdiq Gözləyənlər'),

                Tables\Filters\TernaryFilter::make('is_featured')
                    ->label('Vitrin Durumu'),
            ])
            ->actions([
                Tables\Actions\Action::make('bump')
                    ->label('İrəli Çək')
                    ->icon('heroicon-o-arrow-up-circle')
                    ->color('warning')
                    ->requiresConfirmation()
                    ->modalHeading('Vakansiyanı İrəli Çək')
                    ->modalDescription('Bu vakansiya dərhal ən birinci sıraya yüksələcək və tarixi yenilənəcək.')
                    ->modalSubmitActionLabel('İrəli Çək')
                    ->action(function (Vacancy $record) {
                        $record->bumped_at = now();
                        $record->save();
                        \Filament\Notifications\Notification::make()
                            ->title('Vakansiya uğurla irəli çəkildi!')
                            ->success()
                            ->send();
                    }),

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
                    }),

                Tables\Actions\Action::make('toggle_approve')
                    ->label(fn (Vacancy $record): string => $record->is_active ? 'Təsdiqi Ləğv Et' : 'Təsdiqlə')
                    ->icon(fn (Vacancy $record): string => $record->is_active ? 'heroicon-o-x-circle' : 'heroicon-o-check-circle')
                    ->color(fn (Vacancy $record): string => $record->is_active ? 'danger' : 'success')
                    ->requiresConfirmation()
                    ->action(function (Vacancy $record) {
                        $record->is_active = !$record->is_active;
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
