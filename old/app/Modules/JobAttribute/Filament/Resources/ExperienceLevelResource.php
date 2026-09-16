<?php

namespace App\Modules\JobAttribute\Filament\Resources;

use App\Modules\JobAttribute\Filament\Resources\ExperienceLevelResource\Pages;
use App\Modules\JobAttribute\Models\ExperienceLevel;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;

class ExperienceLevelResource extends Resource
{
    protected static ?string $model = ExperienceLevel::class;

    protected static ?string $navigationIcon = 'heroicon-o-academic-cap';
    protected static ?string $navigationGroup = 'İlan Parametrləri';
    protected static ?string $modelLabel = 'Təcrübə Səviyyəsi';
    protected static ?string $pluralModelLabel = 'Təcrübə Səviyyələri';
    protected static ?int $navigationSort = 3;

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Section::make('Ümumi Parametrlər')
                    ->schema([
                        Forms\Components\TextInput::make('slug')
                            ->label('Slug / Kod')
                            ->helperText('Boş buraxılarsa avtomatik yaradılacaq')
                            ->maxLength(255),

                        Forms\Components\TextInput::make('order')
                            ->label('Sıralama')
                            ->numeric()
                            ->default(0),

                        Forms\Components\Toggle::make('is_active')
                            ->label('Aktivdir')
                            ->default(true)
                            ->inline(false),
                    ])->columns(3),

                Forms\Components\Tabs::make('Translations')
                    ->tabs([
                        Forms\Components\Tabs\Tab::make('🇦🇿 Azərbaycan (Default)')
                            ->schema([
                                Forms\Components\TextInput::make('name.az')
                                    ->label('Təcrübə Səviyyəsi Adı (AZ)')
                                    ->required()
                                    ->live(onBlur: true)
                                    ->afterStateUpdated(fn (string $operation, $state, Forms\Set $set, Forms\Get $get) => 
                                        $operation === 'create' && empty($get('slug')) ? $set('slug', \Illuminate\Support\Str::slug($state)) : null
                                    ),
                            ]),

                        Forms\Components\Tabs\Tab::make('🇬🇧 English')
                            ->schema([
                                Forms\Components\TextInput::make('name.en')
                                    ->label('Experience Level Name (EN)'),
                            ]),

                        Forms\Components\Tabs\Tab::make('🇹🇷 Türkçe')
                            ->schema([
                                Forms\Components\TextInput::make('name.tr')
                                    ->label('Deneyim Seviyesi Adı (TR)'),
                            ]),

                        Forms\Components\Tabs\Tab::make('🇷🇺 Русский')
                            ->schema([
                                Forms\Components\TextInput::make('name.ru')
                                    ->label('Опыт работы (RU)'),
                            ]),
                    ])->columnSpanFull(),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('name')
                    ->label('Təcrübə Səviyyəsi (AZ)')
                    ->searchable()
                    ->sortable()
                    ->weight('bold'),

                Tables\Columns\TextColumn::make('slug')
                    ->label('Slug')
                    ->badge()
                    ->color('gray'),

                Tables\Columns\TextColumn::make('order')
                    ->label('Sıra')
                    ->sortable(),

                Tables\Columns\IconColumn::make('is_active')
                    ->label('Aktiv')
                    ->boolean(),

                Tables\Columns\TextColumn::make('vacancies_count')
                    ->label('Vakansiya Sayı')
                    ->counts('vacancies')
                    ->sortable(),
            ])
            ->defaultSort('order')
            ->actions([
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
            'index' => Pages\ListExperienceLevels::route('/'),
            'create' => Pages\CreateExperienceLevel::route('/create'),
            'edit' => Pages\EditExperienceLevel::route('/{record}/edit'),
        ];
    }
}
