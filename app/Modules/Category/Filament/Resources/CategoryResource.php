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
    protected static ?string $navigationGroup = 'İlan & Şirket Yönetimi';
    protected static ?string $modelLabel = 'Kategori';
    protected static ?string $pluralModelLabel = 'Kategoriler';
    protected static ?int $navigationSort = 3;

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Section::make('Kategori Yapısı & İkon')
                    ->schema([
                        Forms\Components\Select::make('parent_id')
                            ->label('Üst Kategori (Alt Kategori için seçin)')
                            ->options(function (?Category $record) {
                                $query = Category::parents();
                                if ($record) {
                                    $query->where('id', '!=', $record->id);
                                }
                                return $query->get()->mapWithKeys(fn ($cat) => [$cat->id => $cat->name]);
                            })
                            ->searchable()
                            ->preload()
                            ->placeholder('— Ana Kategori (Üst kategorisi yok) —'),

                        Forms\Components\TextInput::make('icon')
                            ->label('İkon (Lucide icon adı)')
                            ->placeholder('Örn: code-2, palette, layout-grid, database, users, headset, line-chart')
                            ->maxLength(255),

                        Forms\Components\TextInput::make('slug')
                            ->label('Slug / URL (Benzersiz Kod)')
                            ->helperText('Boş bırakılırsa Azərbaycan adından avtomatik yaradılacaq')
                            ->maxLength(255)
                            ->columnSpanFull(),
                    ])->columns(2),

                Forms\Components\Tabs::make('Translations')
                    ->tabs([
                        Forms\Components\Tabs\Tab::make('🇦🇿 Azərbaycan (Default)')
                            ->schema([
                                Forms\Components\TextInput::make('name.az')
                                    ->label('Kateqoriya Adı (AZ)')
                                    ->required()
                                    ->live(onBlur: true)
                                    ->afterStateUpdated(fn (string $operation, $state, Forms\Set $set, Forms\Get $get) => 
                                        $operation === 'create' && empty($get('slug')) ? $set('slug', \Illuminate\Support\Str::slug($state)) : null
                                    ),
                            ]),

                        Forms\Components\Tabs\Tab::make('🇬🇧 English')
                            ->schema([
                                Forms\Components\TextInput::make('name.en')
                                    ->label('Category Name (EN)'),
                            ]),

                        Forms\Components\Tabs\Tab::make('🇹🇷 Türkçe')
                            ->schema([
                                Forms\Components\TextInput::make('name.tr')
                                    ->label('Kategori Adı (TR)'),
                            ]),

                        Forms\Components\Tabs\Tab::make('🇷🇺 Русский')
                            ->schema([
                                Forms\Components\TextInput::make('name.ru')
                                    ->label('Название Категории (RU)'),
                            ]),
                    ])->columnSpanFull(),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('name')
                    ->label('Kategori Adı')
                    ->searchable()
                    ->sortable()
                    ->weight('bold')
                    ->icon(fn (Category $record): ?string => $record->parent_id ? 'heroicon-m-arrow-turn-down-right' : null),

                Tables\Columns\TextColumn::make('parent.name')
                    ->label('Üst Kategori')
                    ->badge()
                    ->color('primary')
                    ->placeholder('— Ana Kategori —')
                    ->sortable(),

                Tables\Columns\TextColumn::make('slug')
                    ->label('Slug')
                    ->badge()
                    ->color('gray'),

                Tables\Columns\TextColumn::make('children_count')
                    ->label('Alt Kategori')
                    ->counts('children')
                    ->badge()
                    ->color('warning')
                    ->sortable(),

                Tables\Columns\TextColumn::make('vacancies_count')
                    ->label('İlan Sayısı')
                    ->counts('vacancies')
                    ->badge()
                    ->color('info')
                    ->sortable(),

                Tables\Columns\TextColumn::make('created_at')
                    ->label('Oluşturulma')
                    ->dateTime('d.m.Y')
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                Tables\Filters\SelectFilter::make('parent')
                    ->relationship('parent', 'name')
                    ->label('Üst Kategoriye Göre'),

                Tables\Filters\Filter::make('only_parents')
                    ->label('Sadece Ana Kategoriler')
                    ->query(fn (Builder $query): Builder => $query->whereNull('parent_id')),

                Tables\Filters\Filter::make('only_children')
                    ->label('Sadece Alt Kategoriler')
                    ->query(fn (Builder $query): Builder => $query->whereNotNull('parent_id')),
            ])
            ->actions([
                Tables\Actions\Action::make('addSubcategory')
                    ->label('Alt Kateqoriya Əlavə Et')
                    ->icon('heroicon-o-plus-circle')
                    ->color('success')
                    ->visible(fn (Category $record): bool => is_null($record->parent_id))
                    ->form([
                        Forms\Components\Tabs::make('Translations')
                            ->tabs([
                                Forms\Components\Tabs\Tab::make('🇦🇿 Azərbaycan')
                                    ->schema([
                                        Forms\Components\TextInput::make('name.az')
                                            ->label('Alt Kateqoriya Adı (AZ)')
                                            ->required(),
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
                    ])
                    ->action(function (Category $record, array $data): void {
                        $record->children()->create([
                            'name' => $data['name'] ?? [],
                            'icon' => $record->icon,
                        ]);

                        \Filament\Notifications\Notification::make()
                            ->title('Alt Kateqoriya Uğurla Əlavə Edildi')
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
