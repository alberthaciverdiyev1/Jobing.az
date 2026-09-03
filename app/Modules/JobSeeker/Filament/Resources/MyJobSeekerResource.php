<?php

namespace App\Modules\JobSeeker\Filament\Resources;

use App\Modules\Category\Models\Category;
use App\Modules\JobAttribute\Models\ExperienceLevel;
use App\Modules\JobAttribute\Models\JobType;
use App\Modules\JobAttribute\Models\WorkplaceType;
use App\Modules\JobSeeker\Filament\Concerns\HasSkillPicker;
use App\Modules\JobSeeker\Filament\Resources\MyJobSeekerResource\Pages;
use App\Modules\JobSeeker\Models\JobSeeker;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;

class MyJobSeekerResource extends Resource
{
    use HasSkillPicker;

    protected static ?string $model = JobSeeker::class;

    protected static ?string $navigationIcon = 'heroicon-o-user-circle';
    protected static ?string $navigationLabel = 'İş Axtarış Elanlarım';
    protected static ?string $modelLabel = 'İş Axtarış Elanı';
    protected static ?string $pluralModelLabel = 'İş Axtarış Elanlarım';
    protected static ?int $navigationSort = 2;

    public static function canViewAny(): bool
    {
        return true;
    }

    public static function getEloquentQuery(): Builder
    {
        return parent::getEloquentQuery()->where('user_id', auth()->id());
    }

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Section::make('Əsas Məlumatlar')
                    ->schema([
                        Forms\Components\TextInput::make('title')
                            ->label('Elan Başlığı')
                            ->placeholder('Örn: Senior Full Stack PHP / Laravel Geliştirici')
                            ->required()
                            ->maxLength(255)
                            ->columnSpanFull(),

                        Forms\Components\Select::make('category_parent_id')
                            ->label('Kateqoriya')
                            ->options(static::parentCategoryOptions())
                            ->searchable()
                            ->preload()
                            ->live()
                            // Düzenlemede saklı alt kategorinin üstünü otomatik seç.
                            ->default(fn (?Model $record): ?string => $record?->category?->parent_id ? (string) $record->category->parent_id : null)
                            ->afterStateUpdated(fn (Forms\Set $set) => $set('category_id', null))
                            ->dehydrated(false)
                            ->placeholder('Kateqoriya seçin…'),

                        Forms\Components\Select::make('category_id')
                            ->label('Vəzifə / Peşə')
                            ->options(fn (Forms\Get $get): array => static::subcategoryOptions($get('category_parent_id') ? (int) $get('category_parent_id') : null))
                            ->searchable()
                            ->preload()
                            ->required()
                            ->placeholder('Əvvəlcə Kateqoriya seçin…')
                            ->helperText('Seçilən Kateqoriyanın alt mövqeləri (subcategory) burada göstərilir.'),

                        Forms\Components\Select::make('job_type_id')
                            ->label('İş Rejimi')
                            ->options(JobType::pluck('name', 'id')),

                        Forms\Components\Select::make('workplace_type_id')
                            ->label('İş Yeri')
                            ->options(WorkplaceType::pluck('name', 'id')),

                        Forms\Components\Select::make('experience_level_id')
                            ->label('Təcrübə Səviyyəsi')
                            ->options(ExperienceLevel::pluck('name', 'id')),

                        Forms\Components\Select::make('availability')
                            ->label('İşə Başlama Tezliyi')
                            ->options([
                                'immediate' => 'Dərhal başlaya bilər',
                                'two_weeks' => '2 həftə içində',
                                'one_month' => '1 ay içində',
                                'flexible' => 'Esnek',
                            ])
                            ->default('immediate'),

                        Forms\Components\Select::make('location')
                            ->label('Şəhər / Region')
                            ->options(fn (): array => static::cityOptions())
                            ->searchable()
                            ->placeholder('Şəhər seçin…'),
                    ])->columns(2),

                Forms\Components\Section::make('Gözlənilən Maaş')
                    ->schema([
                        Forms\Components\Toggle::make('salary_negotiable')
                            ->label('Razılaşma yolu ilə')
                            ->live()
                            ->columnSpanFull(),

                        Forms\Components\TextInput::make('salary_min')
                            ->label('Minimum Maaş')
                            ->numeric()
                            ->hidden(fn (Forms\Get $get) => (bool) $get('salary_negotiable')),

                        Forms\Components\TextInput::make('salary_max')
                            ->label('Maksimum Maaş')
                            ->numeric()
                            ->hidden(fn (Forms\Get $get) => (bool) $get('salary_negotiable')),

                        Forms\Components\Select::make('currency')
                            ->label('Valyuta')
                            ->options([
                                'AZN' => 'AZN (₼)',
                                'USD' => 'USD ($)',
                                'EUR' => 'EUR (€)',
                                'TRY' => 'TRY (₺)',
                            ])
                            ->default('AZN')
                            ->hidden(fn (Forms\Get $get) => (bool) $get('salary_negotiable')),
                    ])->columns(3),

                Forms\Components\Section::make('Təcrübə və Bacarıqlar')
                    ->schema([
                        Forms\Components\Select::make('skills')
                            ->label('Bacarıqlar (Admin kataloqu)')
                            ->multiple()
                            ->searchable()
                            ->preload()
                            ->options(fn (Forms\Get $get): array => static::skillOptions($get('category_parent_id') ? (int) $get('category_parent_id') : null))
                            ->helperText('Seçilən kateqoriyaya (alt kateqoriyalar daxil) aid admin bacarıqları göstərilir.')
                            ->columnSpanFull(),

                        Forms\Components\Textarea::make('description')
                            ->label('Haqqınızda / Təcrübə Təsviri')
                            ->rows(5)
                            ->required()
                            ->columnSpanFull(),
                    ]),

                Forms\Components\Section::make('Əlaqə və Yayın Statusu')
                    ->schema([
                        Forms\Components\TextInput::make('contact_name')
                            ->label('Əlaqəli Şəxs / Ad Soyad')
                            ->default(fn () => auth()->user()?->name)
                            ->required(),

                        Forms\Components\TextInput::make('contact_email')
                            ->label('Əlaqə E-poçtu')
                            ->email()
                            ->default(fn () => auth()->user()?->email),

                        Forms\Components\TextInput::make('contact_phone')
                            ->label('Əlaqə Telefonu')
                            ->tel(),

                        Forms\Components\Select::make('status')
                            ->label('Status')
                            ->options([
                                \App\Modules\JobSeeker\Models\JobSeeker::STATUS_PENDING => 'Gözləmədə (Admin onayı)',
                                'draft' => 'Qaralama (Gizli)',
                            ])
                            // Kullanıcı kendi elanını yayınlayamaz; onayı admin (JobSeekerResource) verir.
                            ->default(\App\Modules\JobSeeker\Models\JobSeeker::STATUS_PENDING)
                            ->required(),
                    ])->columns(2),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('title')
                    ->label('Elan Başlığı')
                    ->searchable()
                    ->sortable()
                    ->weight('bold')
                    ->limit(35),

                Tables\Columns\TextColumn::make('formatted_salary')
                    ->label('Gözlənilən Maaş')
                    ->badge()
                    ->color('warning'),

                Tables\Columns\TextColumn::make('availability_label')
                    ->label('Çıxış'),

                Tables\Columns\TextColumn::make('views_count')
                    ->label('Baxış')
                    ->badge()
                    ->color('info')
                    ->sortable(),

                Tables\Columns\TextColumn::make('status')
                    ->label('Status')
                    ->badge()
                    ->color(fn (string $state): string => match ($state) {
                        'published' => 'success',
                        'draft' => 'gray',
                        default => 'primary',
                    })
                    ->formatStateUsing(fn (string $state): string => match ($state) {
                        'published' => 'Aktiv',
                        'draft' => 'Qaralama',
                        default => $state,
                    }),

                Tables\Columns\IconColumn::make('is_featured')
                    ->label('Premium')
                    ->boolean()
                    ->sortable(),

                Tables\Columns\TextColumn::make('created_at')
                    ->label('Tarix')
                    ->dateTime('d.m.Y')
                    ->sortable(),
            ])
            ->defaultSort('created_at', 'desc')
            ->actions([

                // İrəli çək (WhatsApp siparişi — web modalı)
                Tables\Actions\Action::make('promote_bump')
                    ->label('İrəli Çək')
                    ->icon('heroicon-o-arrow-up-circle')
                    ->color('success')
                    ->modalHeading('Elanı İrəli Çək')
                    ->modalWidth('md')
                    ->modalSubmitAction(fn () => false)
                    ->modalCancelActionLabel('Bağla')
                    ->modalContent(fn (JobSeeker $record) => view('components.promotion-whatsapp', [
                        'mode' => 'bump',
                        'itemLabel' => __('İş Axtarış Elanı'),
                        'title' => $record->title,
                        'id' => $record->id,
                    ])),

                // Premium (WhatsApp siparişi — web modalı)
                Tables\Actions\Action::make('promote_premium')
                    ->label('Premium Et')
                    ->icon('heroicon-o-sparkles')
                    ->color('amber')
                    ->modalHeading('Premium Status Qazan')
                    ->modalWidth('md')
                    ->modalSubmitAction(fn () => false)
                    ->modalCancelActionLabel('Bağla')
                    ->modalContent(fn (JobSeeker $record) => view('components.promotion-whatsapp', [
                        'mode' => 'premium',
                        'itemLabel' => __('İş Axtarış Elanı'),
                        'title' => $record->title,
                        'id' => $record->id,
                    ])),

                Tables\Actions\EditAction::make(),
                Tables\Actions\DeleteAction::make(),
            ]);
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListMyJobSeekers::route('/'),
            'create' => Pages\CreateMyJobSeeker::route('/create'),
            'edit' => Pages\EditMyJobSeeker::route('/{record}/edit'),
        ];
    }
}
