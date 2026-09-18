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
    protected static ?string $navigationGroup = null;

    public static function getNavigationGroup(): string
    {
        return __('Listing Parameters');
    }
    protected static ?string $modelLabel = null;

    public static function getModelLabel(): string
    {
        return __('Job Type');
    }
    protected static ?string $pluralModelLabel = null;

    public static function getPluralModelLabel(): string
    {
        return __('Job Types');
    }
    protected static ?int $navigationSort = 1;

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Section::make(__('General Parameters'))
                    ->schema([
                        Forms\Components\TextInput::make('slug')
                            ->label(__('Slug / Code'))
                            ->helperText(__('If left empty, it will be auto-generated'))
                            ->maxLength(255),

                        Forms\Components\TextInput::make('order')
                            ->label(__('Ordering'))
                            ->numeric()
                            ->default(0),

                        Forms\Components\Toggle::make('is_active')
                            ->label(__('Active'))
                            ->default(true)
                            ->inline(false),
                    ])->columns(3),

                Forms\Components\Tabs::make('Translations')
                    ->tabs([
                        Forms\Components\Tabs\Tab::make('🇦🇿 ' . __('languages.Azerbaijani') . ' (' . __('Default') . ')')
                            ->schema([
                                Forms\Components\TextInput::make('name.az')
                                    ->label(__('Job Type Name (AZ)'))
                                    ->required()
                                    ->live(onBlur: true)
                                    ->afterStateUpdated(fn (string $operation, $state, Forms\Set $set, Forms\Get $get) => 
                                        $operation === 'create' && empty($get('slug')) ? $set('slug', \Illuminate\Support\Str::slug($state)) : null
                                    ),
                            ]),

                        Forms\Components\Tabs\Tab::make('🇬🇧 ' . __('languages.English'))
                            ->schema([
                                Forms\Components\TextInput::make('name.en')
                                    ->label(__('Job Type Name (EN)')),
                            ]),

                        Forms\Components\Tabs\Tab::make('🇹🇷 ' . __('languages.Turkish'))
                            ->schema([
                                Forms\Components\TextInput::make('name.tr')
                                    ->label(__('Work Mode Name (TR)')),
                            ]),

                        Forms\Components\Tabs\Tab::make('🇷🇺 ' . __('languages.Russian'))
                            ->schema([
                                Forms\Components\TextInput::make('name.ru')
                                    ->label(__('Job Type (RU)')),
                            ]),
                    ])->columnSpanFull(),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('name')
                    ->label(__('Job Type (AZ)'))
                    ->searchable()
                    ->sortable()
                    ->weight('bold'),

                Tables\Columns\TextColumn::make('slug')
                    ->label(__('Slug'))
                    ->badge()
                    ->color('gray'),

                Tables\Columns\TextColumn::make('order')
                    ->label(__('Order'))
                    ->sortable(),

                Tables\Columns\IconColumn::make('is_active')
                    ->label(__('Active'))
                    ->boolean(),

                Tables\Columns\TextColumn::make('vacancies_count')
                    ->label(__('Vacancy Count'))
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
