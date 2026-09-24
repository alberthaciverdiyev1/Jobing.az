<?php

namespace App\Modules\Faq\Filament\Resources;

use App\Modules\Faq\Filament\Resources\FaqResource\Pages;
use App\Modules\Faq\Models\Faq;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;

class FaqResource extends Resource
{
    protected static ?string $model = Faq::class;

    protected static ?string $navigationIcon = 'heroicon-o-question-mark-circle';
    protected static ?string $navigationGroup = null;

    public static function getNavigationGroup(): string
    {
        return __('Content');
    }
    protected static ?string $modelLabel = null;

    public static function getModelLabel(): string
    {
        return __('FAQ');
    }
    protected static ?string $pluralModelLabel = null;

    public static function getPluralModelLabel(): string
    {
        return __('Frequently Asked Questions');
    }
    protected static ?int $navigationSort = 1;

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Section::make(__('General Settings'))
                    ->schema([
                        Forms\Components\TextInput::make('category')
                            ->label(__('Category'))
                            ->default('general')
                            ->maxLength(50)
                            ->required(),

                        Forms\Components\TextInput::make('sort_order')
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
                        Forms\Components\Tabs\Tab::make('🇦🇿 ' . __('languages.Azerbaijani'))
                            ->schema([
                                Forms\Components\TextInput::make('question.az')
                                    ->label(__('Question (AZ)')),
                                Forms\Components\Textarea::make('answer.az')
                                    ->label(__('Answer (AZ)'))
                                    ->rows(4),
                            ]),
                        Forms\Components\Tabs\Tab::make('🇬🇧 ' . __('languages.English'))
                            ->schema([
                                Forms\Components\TextInput::make('question.en')
                                    ->label(__('Question (EN)')),
                                Forms\Components\Textarea::make('answer.en')
                                    ->label(__('Answer (EN)'))
                                    ->rows(4),
                            ]),
                        Forms\Components\Tabs\Tab::make('🇹🇷 ' . __('languages.Turkish') . ' (' . __('Default') . ')')
                            ->schema([
                                Forms\Components\TextInput::make('question.tr')
                                    ->label(__('Question (TR)'))
                                    ->required(),
                                Forms\Components\Textarea::make('answer.tr')
                                    ->label(__('Answer (TR)'))
                                    ->rows(4)
                                    ->required(),
                            ]),
                        Forms\Components\Tabs\Tab::make('🇷🇺 ' . __('languages.Russian'))
                            ->schema([
                                Forms\Components\TextInput::make('question.ru')
                                    ->label(__('Question (RU)')),
                                Forms\Components\Textarea::make('answer.ru')
                                    ->label(__('Answer (RU)'))
                                    ->rows(4),
                            ]),
                    ])->columnSpanFull(),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('question')
                    ->label(__('Question (AZ)'))
                    ->limit(50)
                    ->searchable()
                    ->weight('bold'),

                Tables\Columns\TextColumn::make('category')
                    ->label(__('Category'))
                    ->badge()
                    ->color('gray'),

                Tables\Columns\TextColumn::make('sort_order')
                    ->label(__('Order'))
                    ->sortable(),

                Tables\Columns\IconColumn::make('is_active')
                    ->label(__('Active'))
                    ->boolean(),
            ])
            ->defaultSort('sort_order')
            ->reorderable('sort_order')
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
            'index' => Pages\ListFaqs::route('/'),
            'create' => Pages\CreateFaq::route('/create'),
            'edit' => Pages\EditFaq::route('/{record}/edit'),
        ];
    }
}
