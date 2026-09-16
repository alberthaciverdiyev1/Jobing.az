<?php

namespace App\Modules\Category\Filament\Resources\CategoryResource\RelationManagers;

use App\Modules\Category\Models\Category;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\RelationManagers\RelationManager;
use Filament\Tables;
use Filament\Tables\Table;

class SubcategoriesRelationManager extends RelationManager
{
    protected static string $relationship = 'children';

    protected static ?string $title = 'Alt Kateqoriyalar (Subcategories)';
    protected static ?string $modelLabel = 'Alt Kateqoriya';
    protected static ?string $pluralModelLabel = 'Alt Kateqoriyalar';
    protected static ?string $icon = 'heroicon-o-arrow-turn-down-right';

    public function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\TextInput::make('slug')
                    ->label('Slug / URL (Boş bırakılırsa avtomatik yaranacaq)')
                    ->helperText('Unikal URL identifikatoru')
                    ->maxLength(255)
                    ->columnSpanFull(),

                Forms\Components\Tabs::make('Translations')
                    ->tabs([
                        Forms\Components\Tabs\Tab::make('🇦🇿 Azərbaycan (Əsas)')
                            ->schema([
                                Forms\Components\TextInput::make('name.az')
                                    ->label('Alt Kateqoriya Adı (AZ)')
                                    ->required()
                                    ->live(onBlur: true)
                                    ->afterStateUpdated(fn (string $operation, $state, Forms\Set $set, Forms\Get $get) => 
                                        $operation === 'create' && empty($get('slug')) ? $set('slug', \Illuminate\Support\Str::slug($state)) : null
                                    ),
                            ]),

                        Forms\Components\Tabs\Tab::make('🇬🇧 English')
                            ->schema([
                                Forms\Components\TextInput::make('name.en')
                                    ->label('Subcategory Name (EN)'),
                            ]),

                        Forms\Components\Tabs\Tab::make('🇹🇷 Türkçe')
                            ->schema([
                                Forms\Components\TextInput::make('name.tr')
                                    ->label('Alt Kategori Adı (TR)'),
                            ]),

                        Forms\Components\Tabs\Tab::make('🇷🇺 Русский')
                            ->schema([
                                Forms\Components\TextInput::make('name.ru')
                                    ->label('Название Подкатегории (RU)'),
                            ]),
                    ])->columnSpanFull(),
            ]);
    }

    public function table(Table $table): Table
    {
        return $table
            ->recordTitleAttribute('name')
            ->columns([
                Tables\Columns\TextColumn::make('name')
                    ->label('Alt Kateqoriya')
                    ->searchable()
                    ->sortable()
                    ->weight('bold'),

                Tables\Columns\TextColumn::make('slug')
                    ->label('Slug')
                    ->badge()
                    ->color('gray'),

                Tables\Columns\TextColumn::make('vacancies_count')
                    ->label('İlan Sayı')
                    ->counts('vacancies')
                    ->badge()
                    ->color('info')
                    ->sortable(),

                Tables\Columns\TextColumn::make('created_at')
                    ->label('Tarix')
                    ->dateTime('d.m.Y H:i')
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                //
            ])
            ->headerActions([
                Tables\Actions\CreateAction::make()
                    ->label('Yeni Alt Kateqoriya Əlavə Et')
                    ->modalHeading('Bu Kateqoriya Altına Yeni Alt Kateqoriya Əlavə Et')
                    ->icon('heroicon-o-plus-circle'),
            ])
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
}
