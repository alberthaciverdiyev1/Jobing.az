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
    protected static ?string $navigationGroup = 'İçerik';
    protected static ?string $modelLabel = 'SSS';
    protected static ?string $pluralModelLabel = 'Sıkça Sorulan Sorular';
    protected static ?int $navigationSort = 1;

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Section::make('Genel Ayarlar')
                    ->schema([
                        Forms\Components\TextInput::make('category')
                            ->label('Kategori')
                            ->default('general')
                            ->maxLength(50)
                            ->required(),

                        Forms\Components\TextInput::make('sort_order')
                            ->label('Sıralama')
                            ->numeric()
                            ->default(0),

                        Forms\Components\Toggle::make('is_active')
                            ->label('Aktif')
                            ->default(true)
                            ->inline(false),
                    ])->columns(3),

                Forms\Components\Tabs::make('Translations')
                    ->tabs([
                        Forms\Components\Tabs\Tab::make('🇦🇿 Azərbaycan (Default)')
                            ->schema([
                                Forms\Components\TextInput::make('question.az')
                                    ->label('Sual (AZ)')
                                    ->required(),
                                Forms\Components\Textarea::make('answer.az')
                                    ->label('Cavab (AZ)')
                                    ->rows(4)
                                    ->required(),
                            ]),
                        Forms\Components\Tabs\Tab::make('🇬🇧 English')
                            ->schema([
                                Forms\Components\TextInput::make('question.en')
                                    ->label('Question (EN)'),
                                Forms\Components\Textarea::make('answer.en')
                                    ->label('Answer (EN)')
                                    ->rows(4),
                            ]),
                        Forms\Components\Tabs\Tab::make('🇹🇷 Türkçe')
                            ->schema([
                                Forms\Components\TextInput::make('question.tr')
                                    ->label('Soru (TR)'),
                                Forms\Components\Textarea::make('answer.tr')
                                    ->label('Cevap (TR)')
                                    ->rows(4),
                            ]),
                        Forms\Components\Tabs\Tab::make('🇷🇺 Русский')
                            ->schema([
                                Forms\Components\TextInput::make('question.ru')
                                    ->label('Вопрос (RU)'),
                                Forms\Components\Textarea::make('answer.ru')
                                    ->label('Ответ (RU)')
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
                    ->label('Sual (AZ)')
                    ->limit(50)
                    ->searchable()
                    ->weight('bold'),

                Tables\Columns\TextColumn::make('category')
                    ->label('Kategori')
                    ->badge()
                    ->color('gray'),

                Tables\Columns\TextColumn::make('sort_order')
                    ->label('Sıra')
                    ->sortable(),

                Tables\Columns\IconColumn::make('is_active')
                    ->label('Aktif')
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
