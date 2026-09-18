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

    protected static ?string $title = null;

    public static function getTitle(\Illuminate\Database\Eloquent\Model $ownerRecord, string $pageClass): string
    {
        return __('Subcategories');
    }
    protected static ?string $modelLabel = null;

    public static function getModelLabel(): string
    {
        return __('Subcategory');
    }
    protected static ?string $pluralModelLabel = null;

    public static function getPluralModelLabel(): string
    {
        return __('Subcategories');
    }
    protected static ?string $icon = 'heroicon-o-arrow-turn-down-right';

    public function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\TextInput::make('slug')
                    ->label(__('Slug / URL (auto-generated if left empty)'))
                    ->helperText(__('Unique URL identifier'))
                    ->maxLength(255)
                    ->columnSpanFull(),

                Forms\Components\Tabs::make('Translations')
                    ->tabs([
                        Forms\Components\Tabs\Tab::make('🇦🇿 ' . __('languages.Azerbaijani') . ' (' . __('Default') . ')')
                            ->schema([
                                Forms\Components\TextInput::make('name.az')
                                    ->label(__('Subcategory Name (AZ)'))
                                    ->required()
                                    ->live(onBlur: true)
                                    ->afterStateUpdated(fn (string $operation, $state, Forms\Set $set, Forms\Get $get) => 
                                        $operation === 'create' && empty($get('slug')) ? $set('slug', \Illuminate\Support\Str::slug($state)) : null
                                    ),
                            ]),

                        Forms\Components\Tabs\Tab::make('🇬🇧 ' . __('languages.English'))
                            ->schema([
                                Forms\Components\TextInput::make('name.en')
                                    ->label(__('Subcategory Name (EN)')),
                            ]),

                        Forms\Components\Tabs\Tab::make('🇹🇷 ' . __('languages.Turkish'))
                            ->schema([
                                Forms\Components\TextInput::make('name.tr')
                                    ->label(__('Subcategory Name (TR)')),
                            ]),

                        Forms\Components\Tabs\Tab::make('🇷🇺 ' . __('languages.Russian'))
                            ->schema([
                                Forms\Components\TextInput::make('name.ru')
                                    ->label(__('Subcategory Name (RU)')),
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
                    ->label(__('Subcategory'))
                    ->searchable()
                    ->sortable()
                    ->weight('bold'),

                Tables\Columns\TextColumn::make('slug')
                    ->label(__('Slug'))
                    ->badge()
                    ->color('gray'),

                Tables\Columns\TextColumn::make('vacancies_count')
                    ->label(__('Listing Count'))
                    ->counts('vacancies')
                    ->badge()
                    ->color('info')
                    ->sortable(),

                Tables\Columns\TextColumn::make('created_at')
                    ->label(__('Date'))
                    ->dateTime('d.m.Y H:i')
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                //
            ])
            ->headerActions([
                Tables\Actions\CreateAction::make()
                    ->label(__('Add New Subcategory'))
                    ->modalHeading(__('Add a New Subcategory Under This Category'))
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
