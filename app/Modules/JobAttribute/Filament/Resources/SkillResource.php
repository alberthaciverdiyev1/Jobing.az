<?php

namespace App\Modules\JobAttribute\Filament\Resources;

use App\Modules\JobAttribute\Models\Skill;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;

class SkillResource extends Resource
{
    protected static ?string $model = Skill::class;

    protected static ?string $navigationIcon = 'heroicon-o-hashtag';
    protected static ?string $navigationGroup = null;

    public static function getNavigationGroup(): string
    {
        return __('Listing & Company Management');
    }
    protected static ?string $modelLabel = null;

    public static function getModelLabel(): string
    {
        return __('Skill Tag');
    }
    protected static ?string $pluralModelLabel = null;

    public static function getPluralModelLabel(): string
    {
        return __('Skill Tags');
    }
    protected static ?int $navigationSort = 7;

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Section::make(__('Tag Information & Multilingual Translation'))
                    ->schema([
                        Forms\Components\Tabs::make('NameTranslations')
                            ->tabs([
                                Forms\Components\Tabs\Tab::make('🇦🇿 ' . __('languages.Azerbaijani'))
                                    ->schema([
                                        Forms\Components\TextInput::make('name.az')
                                            ->label(__('Skill Name (AZ)'))
                                            ->required()
                                            ->maxLength(255)
                                            ->live(onBlur: true)
                                            ->afterStateUpdated(fn (string $operation, $state, Forms\Set $set) => 
                                                $operation === 'create' ? $set('slug', \Illuminate\Support\Str::slug($state)) : null
                                            ),
                                    ]),
                                Forms\Components\Tabs\Tab::make('🇬🇧 ' . __('languages.English'))
                                    ->schema([
                                        Forms\Components\TextInput::make('name.en')
                                            ->label(__('Skill Name (EN)'))
                                            ->maxLength(255),
                                    ]),
                                Forms\Components\Tabs\Tab::make('🇹🇷 ' . __('languages.Turkish'))
                                    ->schema([
                                        Forms\Components\TextInput::make('name.tr')
                                            ->label(__('Skill Name (TR)'))
                                            ->maxLength(255),
                                    ]),
                                Forms\Components\Tabs\Tab::make('🇷🇺 ' . __('languages.Russian'))
                                    ->schema([
                                        Forms\Components\TextInput::make('name.ru')
                                            ->label(__('Skill Name (RU)'))
                                            ->maxLength(255),
                                    ]),
                            ])
                            ->columnSpanFull(),

                        Forms\Components\Select::make('category_id')
                            ->label(__('Category'))
                            ->options(fn (): array => collect(\App\Modules\Category\Models\Category::parents()->get())
                                ->sortBy(fn ($c) => (string) $c->name)
                                ->mapWithKeys(fn ($c) => [(string) $c->id => (string) $c->name])
                                ->all())
                            ->searchable()
                            ->preload()
                            ->nullable()
                            ->helperText(__('Select the main category this skill belongs to.')),

                        Forms\Components\TextInput::make('slug')
                            ->label(__('Slug / URL'))
                            ->required()
                            ->unique(Skill::class, 'slug', ignoreRecord: true)
                            ->maxLength(255),

                        Forms\Components\TextInput::make('order')
                            ->label(__('Sort Order'))
                            ->numeric()
                            ->default(0),

                        Forms\Components\Toggle::make('is_active')
                            ->label(__('Activity Status'))
                            ->default(true),
                    ])->columns(2),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('name')
                    ->label(__('Tag Name'))
                    ->searchable()
                    ->sortable()
                    ->weight('bold'),

                Tables\Columns\TextColumn::make('category.name')
                    ->label(__('Category'))
                    ->badge()
                    ->color('warning')
                    ->placeholder('—')
                    ->sortable(),

                Tables\Columns\TextColumn::make('slug')
                    ->label(__('Slug'))
                    ->badge()
                    ->color('gray'),

                Tables\Columns\TextColumn::make('order')
                    ->label(__('Order'))
                    ->sortable(),

                Tables\Columns\IconColumn::make('is_active')
                    ->label(__('Active'))
                    ->boolean()
                    ->sortable(),

                Tables\Columns\TextColumn::make('created_at')
                    ->label(__('Date'))
                    ->dateTime('d.m.Y')
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                Tables\Filters\SelectFilter::make('category_id')
                    ->label(__('Category'))
                    ->options(fn (): array => collect(\App\Modules\Category\Models\Category::parents()->get())
                        ->sortBy(fn ($c) => (string) $c->name)
                        ->mapWithKeys(fn ($c) => [(string) $c->id => (string) $c->name])
                        ->all()),
                Tables\Filters\TernaryFilter::make('is_active')
                    ->label(__('Activity Status')),
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

    public static function getPages(): array
    {
        return [
            'index' => SkillResource\Pages\ListSkills::route('/'),
            'create' => SkillResource\Pages\CreateSkill::route('/create'),
            'edit' => SkillResource\Pages\EditSkill::route('/{record}/edit'),
        ];
    }
}
