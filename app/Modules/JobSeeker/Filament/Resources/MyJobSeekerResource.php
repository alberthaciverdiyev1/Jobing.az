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
    protected static ?string $navigationLabel = null;

    public static function getNavigationLabel(): string
    {
        return __('My Job Seeking Listings');
    }
    protected static ?string $modelLabel = null;

    public static function getModelLabel(): string
    {
        return __('Job Seeking Listing');
    }
    protected static ?string $pluralModelLabel = null;

    public static function getPluralModelLabel(): string
    {
        return __('My Job Seeking Listings');
    }
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
                Forms\Components\Section::make(__('Basic Information'))
                    ->schema([
                        Forms\Components\TextInput::make('title')
                            ->label(__('Listing Title'))
                            ->placeholder(__('e.g.: Senior Full Stack PHP / Laravel Developer'))
                            ->required()
                            ->maxLength(255)
                            ->columnSpanFull(),

                        Forms\Components\Select::make('category_parent_id')
                            ->label(__('Category'))
                            ->options(static::parentCategoryOptions())
                            ->searchable()
                            ->preload()
                            ->live()
                            // Düzenlemede saklı alt kategorinin üstünü otomatik seç.
                            ->default(fn (?Model $record): ?string => $record?->category?->parent_id ? (string) $record->category->parent_id : null)
                            ->afterStateUpdated(fn (Forms\Set $set) => $set('category_id', null))
                            ->dehydrated(false)
                            ->placeholder(__('Select a category…')),

                        Forms\Components\Select::make('category_id')
                            ->label(__('Position / Occupation'))
                            ->options(fn (Forms\Get $get): array => static::subcategoryOptions($get('category_parent_id') ? (int) $get('category_parent_id') : null))
                            ->searchable()
                            ->preload()
                            ->required()
                            ->placeholder(__('Select a category first…'))
                            ->helperText(__('The subcategories of the selected category are shown here.')),

                        Forms\Components\Select::make('job_type_id')
                            ->label(__('Job Type'))
                            ->options(static::jobTypeOptions())
                            ->searchable(),

                        Forms\Components\Select::make('workplace_type_id')
                            ->label(__('Workplace'))
                            ->options(static::workplaceTypeOptions())
                            ->searchable(),

                        Forms\Components\Select::make('experience_level_id')
                            ->label(__('Experience Level'))
                            ->options(static::experienceLevelOptions())
                            ->searchable(),

                        Forms\Components\Select::make('availability')
                            ->label(__('Start Frequency'))
                            ->options([
                                'immediate' => 'Dərhal başlaya bilər',
                                'two_weeks' => '2 həftə içində',
                                'one_month' => '1 ay içində',
                                'flexible' => 'Esnek',
                            ])
                            ->default('immediate'),

                        Forms\Components\Select::make('location')
                            ->label(__('City / Region'))
                            ->options(fn (): array => static::cityOptions())
                            ->searchable()
                            ->placeholder(__('Select a city…')),
                    ])->columns(2),

                Forms\Components\Section::make(__('Expected Salary'))
                    ->schema([
                        Forms\Components\Toggle::make('salary_negotiable')
                            ->label(__('Negotiable'))
                            ->live()
                            ->columnSpanFull(),

                        Forms\Components\TextInput::make('salary_min')
                            ->label(__('Minimum Salary'))
                            ->numeric()
                            ->hidden(fn (Forms\Get $get) => (bool) $get('salary_negotiable')),

                        Forms\Components\TextInput::make('salary_max')
                            ->label(__('Maximum Salary'))
                            ->numeric()
                            ->hidden(fn (Forms\Get $get) => (bool) $get('salary_negotiable')),

                        Forms\Components\Select::make('currency')
                            ->label(__('Currency'))
                            ->options([
                                'TRY' => 'TRY (₺)',
                                'USD' => 'USD ($)',
                                'EUR' => 'EUR (€)',
                                'AZN' => 'AZN (₼)',
                            ])
                            ->default('TRY')
                            ->hidden(fn (Forms\Get $get) => (bool) $get('salary_negotiable')),
                    ])->columns(3),

                Forms\Components\Section::make(__('Experience & Skills'))
                    ->schema([
                        Forms\Components\Select::make('skills')
                            ->label(__('Skills (Admin catalog)'))
                            ->multiple()
                            ->searchable()
                            ->preload()
                            ->options(fn (Forms\Get $get): array => static::skillOptions($get('category_parent_id') ? (int) $get('category_parent_id') : null))
                            ->helperText(__('Admin skills belonging to the selected category (including subcategories) are shown.'))
                            ->columnSpanFull(),

                        Forms\Components\Textarea::make('description')
                            ->label(__('About You / Experience Description'))
                            ->rows(5)
                            ->required()
                            ->columnSpanFull(),
                    ]),

                Forms\Components\Section::make(__('Contact & Publication Status'))
                    ->schema([
                        Forms\Components\TextInput::make('contact_name')
                            ->label(__('Contact Person / Full Name'))
                            ->default(fn () => auth()->user()?->name)
                            ->required(),

                        Forms\Components\TextInput::make('contact_email')
                            ->label(__('Contact Email'))
                            ->email()
                            ->default(fn () => auth()->user()?->email),

                        Forms\Components\TextInput::make('contact_phone')
                            ->label(__('Contact Phone'))
                            ->tel(),

                        Forms\Components\Select::make('status')
                            ->label(__('Status'))
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
                    ->label(__('Listing Title'))
                    ->searchable()
                    ->sortable()
                    ->weight('bold')
                    ->limit(35),

                Tables\Columns\TextColumn::make('formatted_salary')
                    ->label(__('Expected Salary'))
                    ->badge()
                    ->color('warning'),

                Tables\Columns\TextColumn::make('availability_label')
                    ->label(__('Log out')),

                Tables\Columns\TextColumn::make('views_count')
                    ->label(__('Views'))
                    ->badge()
                    ->color('info')
                    ->sortable(),

                Tables\Columns\TextColumn::make('status')
                    ->label(__('Status'))
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
                    ->label(__('Premium'))
                    ->boolean()
                    ->sortable(),

                Tables\Columns\TextColumn::make('created_at')
                    ->label(__('Date'))
                    ->dateTime('d.m.Y')
                    ->sortable(),
            ])
            ->defaultSort('updated_at', 'desc')
            ->actions([

                // İrəli çək (WhatsApp siparişi — web modalı)
                Tables\Actions\Action::make('promote_bump')
                    ->label(__('Boost'))
                    ->icon('heroicon-o-arrow-up-circle')
                    ->color('success')
                    ->modalHeading(__('Boost the Listing'))
                    ->modalWidth('md')
                    ->modalSubmitAction(fn () => false)
                    ->modalCancelActionLabel(__('Close'))
                    ->modalContent(fn (JobSeeker $record) => view('components.promotion-whatsapp', [
                        'mode' => 'bump',
                        'itemLabel' => __('Job Seeking Listing'),
                        'title' => $record->title,
                        'id' => $record->id,
                    ])),

                // Premium (WhatsApp siparişi — web modalı)
                Tables\Actions\Action::make('promote_premium')
                    ->label(__('Make Premium'))
                    ->icon('heroicon-o-sparkles')
                    ->color('amber')
                    ->modalHeading(__('Get Premium Status'))
                    ->modalWidth('md')
                    ->modalSubmitAction(fn () => false)
                    ->modalCancelActionLabel(__('Close'))
                    ->modalContent(fn (JobSeeker $record) => view('components.promotion-whatsapp', [
                        'mode' => 'premium',
                        'itemLabel' => __('Job Seeking Listing'),
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
