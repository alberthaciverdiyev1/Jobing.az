<?php

namespace App\Modules\Company\Filament\Resources;

use App\Modules\Company\Filament\Resources\CompanyResource\Pages;
use App\Modules\Company\Models\Company;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;

class CompanyResource extends Resource
{
    protected static ?string $model = Company::class;

    protected static ?string $navigationIcon = 'heroicon-o-building-office-2';
    protected static ?string $navigationGroup = null;

    public static function getNavigationGroup(): string
    {
        return __('Listing & Company Management');
    }
    protected static ?string $modelLabel = null;

    public static function getModelLabel(): string
    {
        return __('Company');
    }
    protected static ?string $pluralModelLabel = null;

    public static function getPluralModelLabel(): string
    {
        return __('Companies');
    }
    protected static ?int $navigationSort = 2;

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Section::make(__('Company Information'))
                    ->schema([
                        Forms\Components\TextInput::make('name')
                            ->label(__('Company Name'))
                            ->required()
                            ->maxLength(255)
                            ->live(onBlur: true)
                            ->afterStateUpdated(fn (string $operation, $state, Forms\Set $set) => $operation === 'create' ? $set('slug', \Illuminate\Support\Str::slug($state)) : null),

                        Forms\Components\TextInput::make('slug')
                            ->label(__('Slug / URL'))
                            ->required()
                            ->unique(Company::class, 'slug', ignoreRecord: true)
                            ->maxLength(255),

                        Forms\Components\TextInput::make('email')
                            ->label(__('Email Address'))
                            ->email()
                            ->required()
                            ->maxLength(255),

                        Forms\Components\TextInput::make('phone')
                            ->label(__('Phone Number'))
                            ->tel()
                            ->maxLength(255),

                        Forms\Components\TextInput::make('website')
                            ->label(__('Website URL'))
                            ->url()
                            ->placeholder('https://...')
                            ->maxLength(255),

                        Forms\Components\Select::make('city_id')
                            ->label(__('City / Location'))
                            ->options(fn () => \App\Modules\JobAttribute\Models\City::all()->pluck('name', 'id'))
                            ->searchable()
                            ->preload()
                            ->required(),

                        Forms\Components\FileUpload::make('logo')
                            ->label(__('Company Logo'))
                            ->image()
                            ->directory('company-logos')
                            ->imageEditor(),

                        Forms\Components\FileUpload::make('banner')
                            ->label(__('Company Banner / Cover Image'))
                            ->image()
                            ->directory('company-banners')
                            ->imageEditor(),

                        Forms\Components\Tabs::make('AboutTranslations')
                            ->tabs([
                                Forms\Components\Tabs\Tab::make('🇦🇿 ' . __('languages.Azerbaijani'))
                                    ->schema([
                                        Forms\Components\Textarea::make('about.az')
                                            ->label(__('About Company (AZ)'))
                                            ->rows(4),
                                    ]),
                                Forms\Components\Tabs\Tab::make('🇬🇧 ' . __('languages.English'))
                                    ->schema([
                                        Forms\Components\Textarea::make('about.en')
                                            ->label(__('About Company (EN)'))
                                            ->rows(4),
                                    ]),
                                Forms\Components\Tabs\Tab::make('🇹🇷 ' . __('languages.Turkish') . ' (' . __('Default') . ')')
                                    ->schema([
                                        Forms\Components\Textarea::make('about.tr')
                                            ->label(__('About Company (TR)'))
                                            ->rows(4),
                                    ]),
                                Forms\Components\Tabs\Tab::make('🇷🇺 ' . __('languages.Russian'))
                                    ->schema([
                                        Forms\Components\Textarea::make('about.ru')
                                            ->label(__('About Company (RU)'))
                                            ->rows(4),
                                    ]),
                            ])
                            ->columnSpanFull(),

                        Forms\Components\Toggle::make('is_verified')
                            ->label(__('Verified Company (Badge)'))
                            ->default(true),
                    ])->columns(2),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\ImageColumn::make('logo')
                    ->label(__('Logo'))
                    ->circular()
                    ->defaultImageUrl('https://img.icons8.com/isometric-line/64/4a90e2/briefcase.png'),

                Tables\Columns\TextColumn::make('name')
                    ->label(__('Company Name'))
                    ->searchable()
                    ->sortable()
                    ->weight('bold'),

                Tables\Columns\TextColumn::make('email')
                    ->label(__('Email'))
                    ->searchable()
                    ->copyable(),

                Tables\Columns\TextColumn::make('city.name')
                    ->label(__('City'))
                    ->sortable(),

                Tables\Columns\TextColumn::make('vacancies_count')
                    ->label(__('Listing Count'))
                    ->counts('vacancies')
                    ->badge()
                    ->color('primary')
                    ->sortable(),

                Tables\Columns\IconColumn::make('is_verified')
                    ->label(__('Verified'))
                    ->boolean()
                    ->sortable(),

                Tables\Columns\IconColumn::make('verification_requested')
                    ->label(__('Verification Request'))
                    ->trueIcon('heroicon-o-hand-raised')
                    ->falseIcon('heroicon-o-minus')
                    ->trueColor('warning')
                    ->falseColor('gray')
                    ->sortable()
                    ->tooltip(__('The company requested verification')),

                Tables\Columns\TextColumn::make('created_at')
                    ->label(__('Registration Date'))
                    ->dateTime('d.m.Y')
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                Tables\Filters\TernaryFilter::make('is_verified')
                    ->label(__('Approval Status')),
                Tables\Filters\TernaryFilter::make('verification_requested')
                    ->label(__('With Verification Request')),
            ])
            ->actions([
                Tables\Actions\Action::make('verify')
                    ->label(__('Verify'))
                    ->icon('heroicon-m-check-badge')
                    ->color('success')
                    ->requiresConfirmation()
                    ->modalHeading(__('Verify Company'))
                    ->modalDescription(__('This company requested verification. Do you confirm?'))
                    ->visible(fn (Company $record): bool => $record->verification_requested && !$record->is_verified)
                    ->action(fn (Company $record) => $record->update([
                        'is_verified' => true,
                        'verification_requested' => false,
                    ])),
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
            //
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListCompanies::route('/'),
            'create' => Pages\CreateCompany::route('/create'),
            'edit' => Pages\EditCompany::route('/{record}/edit'),
        ];
    }
}
