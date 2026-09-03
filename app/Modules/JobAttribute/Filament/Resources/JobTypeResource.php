<?php

namespace App\Modules\JobAttribute\Filament\Resources;

use App\Modules\JobAttribute\Filament\Resources\JobTypeResource\Pages;
use App\Modules\JobAttribute\Models\JobType;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;

class JobTypeResource extends Resource
{
    protected static ?string $model = JobType::class;

    protected static ?string $navigationIcon = 'heroicon-o-briefcase';
    protected static ?string $navigationGroup = 'İlan Parametrləri';
    protected static ?string $modelLabel = 'İş Rejimi';
    protected static ?string $pluralModelLabel = 'İş Rejimləri';
    protected static ?int $navigationSort = 1;

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
                                    ->label('İş Rejimi Adı (AZ)')
                                    ->required()
                                    ->live(onBlur: true)
                                    ->afterStateUpdated(fn (string $operation, $state, Forms\Set $set, Forms\Get $get) => 
                                        $operation === 'create' && empty($get('slug')) ? $set('slug', \Illuminate\Support\Str::slug($state)) : null
                                    ),
                            ]),

                        Forms\Components\Tabs\Tab::make('🇬🇧 English')
                            ->schema([
                                Forms\Components\TextInput::make('name.en')
                                    ->label('Job Type Name (EN)'),
                            ]),

                        Forms\Components\Tabs\Tab::make('🇹🇷 Türkçe')
                            ->schema([
                                Forms\Components\TextInput::make('name.tr')
                                    ->label('Çalışma Şekli Adı (TR)'),
                            ]),

                        Forms\Components\Tabs\Tab::make('🇷🇺 Русский')
                            ->schema([
                                Forms\Components\TextInput::make('name.ru')
                                    ->label('Тип занятости (RU)'),
                            ]),
                    ])->columnSpanFull(),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('name')
                    ->label('İş Rejimi (AZ)')
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
            'index' => Pages\ListJobTypes::route('/'),
            'create' => Pages\CreateJobType::route('/create'),
            'edit' => Pages\EditJobType::route('/{record}/edit'),
        ];
    }
}
