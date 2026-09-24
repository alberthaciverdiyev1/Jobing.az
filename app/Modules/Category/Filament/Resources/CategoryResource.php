<?php

namespace App\Modules\Category\Filament\Resources;

use App\Modules\Category\Filament\Resources\CategoryResource\Pages;
use App\Modules\Category\Filament\Resources\CategoryResource\RelationManagers;
use App\Modules\Category\Models\Category;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;

class CategoryResource extends Resource
{
    protected static ?string $model = Category::class;

    protected static ?string $navigationIcon = 'heroicon-o-tag';
    protected static ?string $navigationGroup = null;

    public static function getNavigationGroup(): string
    {
        return __('Listing & Company Management');
    }
    protected static ?string $modelLabel = null;

    public static function getModelLabel(): string
    {
        return __('Category');
    }
    protected static ?string $pluralModelLabel = null;

    public static function getPluralModelLabel(): string
    {
        return __('Categories');
    }
    protected static ?int $navigationSort = 3;

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Section::make(__('Category Structure & Icon'))
                    ->schema([
                        Forms\Components\Select::make('parent_id')
                            ->label(__('Parent Category (select for subcategory)'))
                            ->options(function (?Category $record) {
                                $query = Category::parents();
                                if ($record) {
                                    $query->where('id', '!=', $record->id);
                                }
                                return $query->get()->mapWithKeys(fn ($cat) => [$cat->id => $cat->name]);
                            })
                            ->searchable()
                            ->preload()
                            ->placeholder(__('— Main Category (no parent) —')),

                        Forms\Components\TextInput::make('icon')
                            ->label(__('Icon (Lucide icon name)'))
                            ->placeholder('Örn: code-2, palette, layout-grid, database, users, headset, line-chart')
                            ->maxLength(255),

                        Forms\Components\TextInput::make('slug')
                            ->label(__('Slug / URL (Unique Code)'))
                            ->helperText(__('If left empty, it will be auto-generated from the Turkish name'))
                            ->maxLength(255)
                            ->columnSpanFull(),
                    ])->columns(2),

                Forms\Components\Tabs::make('Translations')
                    ->tabs([
                        Forms\Components\Tabs\Tab::make('🇦🇿 ' . __('languages.Azerbaijani'))
                            ->schema([
                                Forms\Components\TextInput::make('name.az')
                                    ->label(__('Category Name (AZ)')),
                            ]),

                        Forms\Components\Tabs\Tab::make('🇬🇧 ' . __('languages.English'))
                            ->schema([
                                Forms\Components\TextInput::make('name.en')
                                    ->label(__('Category Name (EN)')),
                            ]),

                        Forms\Components\Tabs\Tab::make('🇹🇷 ' . __('languages.Turkish') . ' (' . __('Default') . ')')
                            ->schema([
                                Forms\Components\TextInput::make('name.tr')
                                    ->label(__('Category Name (TR)'))
                                    ->required()
                                    ->live(onBlur: true)
                                    ->afterStateUpdated(fn (string $operation, $state, Forms\Set $set, Forms\Get $get) => 
                                        $operation === 'create' && empty($get('slug')) ? $set('slug', \Illuminate\Support\Str::slug($state)) : null
                                    ),
                            ]),

                        Forms\Components\Tabs\Tab::make('🇷🇺 ' . __('languages.Russian'))
                            ->schema([
                                Forms\Components\TextInput::make('name.ru')
                                    ->label(__('Category Name (RU)')),
                            ]),
                    ])->columnSpanFull(),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('name')
                    ->label(__('Category Name'))
                    ->searchable()
                    ->sortable()
                    ->weight('bold')
                    ->icon(fn (Category $record): ?string => $record->parent_id ? 'heroicon-m-arrow-turn-down-right' : null),

                Tables\Columns\TextColumn::make('parent.name')
                    ->label(__('Parent Category'))
                    ->badge()
                    ->color('primary')
                    ->placeholder(__('— Main Category —'))
                    ->sortable(),

                Tables\Columns\TextColumn::make('slug')
                    ->label(__('Slug'))
                    ->badge()
                    ->color('gray'),

                Tables\Columns\TextColumn::make('children_count')
                    ->label(__('Subcategory'))
                    ->counts('children')
                    ->badge()
                    ->color('warning')
                    ->sortable(),

                Tables\Columns\TextColumn::make('vacancies_count')
                    ->label(__('Listing Count'))
                    ->counts('vacancies')
                    ->badge()
                    ->color('info')
                    ->sortable(),

                Tables\Columns\TextColumn::make('created_at')
                    ->label(__('Created'))
                    ->dateTime('d.m.Y')
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                Tables\Filters\SelectFilter::make('parent')
                    ->label(__('By Parent Category'))
                    ->attribute('parent_id')
                    ->options(fn (): array => collect(\App\Modules\Category\Models\Category::parents()->get())
                        ->sortBy(fn ($c) => (string) $c->name)
                        ->mapWithKeys(fn ($c) => [(string) $c->id => (string) $c->name])
                        ->all()),

                Tables\Filters\Filter::make('only_parents')
                    ->label(__('Main Categories Only'))
                    ->query(fn (Builder $query): Builder => $query->whereNull('parent_id')),

                Tables\Filters\Filter::make('only_children')
                    ->label(__('Subcategories Only'))
                    ->query(fn (Builder $query): Builder => $query->whereNotNull('parent_id')),
            ])
            ->actions([
                Tables\Actions\Action::make('addSubcategory')
                    ->label(__('Add Subcategory'))
                    ->icon('heroicon-o-plus-circle')
                    ->color('success')
                    ->visible(fn (Category $record): bool => is_null($record->parent_id))
                    ->form([
                        Forms\Components\Tabs::make('Translations')
                            ->tabs([
                                Forms\Components\Tabs\Tab::make('🇦🇿 ' . __('languages.Azerbaijani'))
                                    ->schema([
                                        Forms\Components\TextInput::make('name.az')
                                            ->label(__('Subcategory Name (AZ)')),
                                    ]),
                                Forms\Components\Tabs\Tab::make('🇬🇧 ' . __('languages.English'))
                                    ->schema([
                                        Forms\Components\TextInput::make('name.en')
                                            ->label(__('Subcategory Name (EN)')),
                                    ]),
                                Forms\Components\Tabs\Tab::make('🇹🇷 ' . __('languages.Turkish') . ' (' . __('Default') . ')')
                                    ->schema([
                                        Forms\Components\TextInput::make('name.tr')
                                            ->label(__('Subcategory Name (TR)'))
                                            ->required(),
                                    ]),
                                Forms\Components\Tabs\Tab::make('🇷🇺 ' . __('languages.Russian'))
                                    ->schema([
                                        Forms\Components\TextInput::make('name.ru')
                                            ->label(__('Subcategory Name (RU)')),
                                    ]),
                            ])->columnSpanFull(),
                    ])
                    ->action(function (Category $record, array $data): void {
                        $record->children()->create([
                            'name' => $data['name'] ?? [],
                            'icon' => $record->icon,
                        ]);

                        \Filament\Notifications\Notification::make()
                            ->title(__('Subcategory Added Successfully'))
                            ->success()
                            ->send();
                    }),
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
            RelationManagers\SubcategoriesRelationManager::class,
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListCategories::route('/'),
            'create' => Pages\CreateCategory::route('/create'),
            'edit' => Pages\EditCategory::route('/{record}/edit'),
        ];
    }
}
