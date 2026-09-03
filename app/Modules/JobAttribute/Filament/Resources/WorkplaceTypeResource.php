<?php

namespace App\Modules\JobAttribute\Filament\Resources;

use App\Modules\JobAttribute\Filament\Resources\WorkplaceTypeResource\Pages;
use App\Modules\JobAttribute\Models\WorkplaceType;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;

class WorkplaceTypeResource extends Resource
{
    protected static ?string $model = WorkplaceType::class;

    protected static ?string $navigationIcon = 'heroicon-o-building-office';
    protected static ?string $navigationGroup = 'İlan Parametrləri';
    protected static ?string $modelLabel = 'Çalışma Yeri';
    protected static ?string $pluralModelLabel = 'Çalışma Yerləri';
    protected static ?int $navigationSort = 2;

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Section::make('Ümumi Parametrlər')
                    ->schema([
                        Forms\Components\TextInput::make('icon')
                            ->label('İkon (FontAwesome / Lucide)')
                            ->placeholder('fa-laptop, fa-building, fa-home')
                            ->maxLength(255),

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
                    ])->columns(4),

                Forms\Components\Tabs::make('Translations')
                    ->tabs([
                        Forms\Components\Tabs\Tab::make('🇦🇿 Azərbaycan (Default)')
                            ->schema([
                                Forms\Components\TextInput::make('name.az')
                                    ->label('Çalışma Yeri Adı (AZ)')
                                    ->required()
                                    ->live(onBlur: true)
                                    ->afterStateUpdated(fn (string $operation, $state, Forms\Set $set, Forms\Get $get) => 
                                        $operation === 'create' && empty($get('slug')) ? $set('slug', \Illuminate\Support\Str::slug($state)) : null
                                    ),
                            ]),

                        Forms\Components\Tabs\Tab::make('🇬🇧 English')
                            ->schema([
                                Forms\Components\TextInput::make('name.en')
                                    ->label('Workplace Type Name (EN)'),
                            ]),

                        Forms\Components\Tabs\Tab::make('🇹🇷 Türkçe')
                            ->schema([
                                Forms\Components\TextInput::make('name.tr')
                                    ->label('Çalışma Yeri Adı (TR)'),
                            ]),

                        Forms\Components\Tabs\Tab::make('🇷🇺 Русский')
                            ->schema([
                                Forms\Components\TextInput::make('name.ru')
                                    ->label('Формат работы (RU)'),
                            ]),
                    ])->columnSpanFull(),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('name')
                    ->label('Çalışma Yeri (AZ)')
                    ->searchable()
                    ->sortable()
                    ->weight('bold'),

                Tables\Columns\TextColumn::make('slug')
                    ->label('Slug')
                    ->badge()
                    ->color('gray'),

                Tables\Columns\TextColumn::make('icon')
                    ->label('İkon'),

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
            'index' => Pages\ListWorkplaceTypes::route('/'),
            'create' => Pages\CreateWorkplaceType::route('/create'),
            'edit' => Pages\EditWorkplaceType::route('/{record}/edit'),
        ];
    }
}
