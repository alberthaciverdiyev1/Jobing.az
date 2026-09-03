<?php

namespace App\Modules\Seo\Filament\Resources;

use App\Modules\Seo\Filament\Resources\PageSeoResource\Pages;
use App\Modules\Seo\Models\PageSeo;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;

class PageSeoResource extends Resource
{
    protected static ?string $model = PageSeo::class;

    protected static ?string $navigationIcon = 'heroicon-o-magnifying-glass-circle';
    protected static ?string $navigationGroup = 'SEO';
    protected static ?string $modelLabel = 'Səhifə SEO';
    protected static ?string $pluralModelLabel = 'Səhifə SEO';
    protected static ?int $navigationSort = 1;

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Section::make('Sayfa Bilgisi')
                    ->schema([
                        Forms\Components\TextInput::make('page_key')->label('Sayfa Anahtarı')->required()->unique(ignoreRecord: true)->maxLength(100)->disabled(fn (string $operation) => $operation === 'edit'),
                        Forms\Components\TextInput::make('page_name')->label('Sayfa Adı')->required()->maxLength(150),
                        Forms\Components\TextInput::make('route_name')->label('Route Adı')->maxLength(150)->helperText('e.g. jobs.index'),
                        Forms\Components\TextInput::make('canonical_url')->label('Canonical URL')->url()->maxLength(255),
                        Forms\Components\FileUpload::make('og_image')->label('OG Görseli')->image()->directory('seo'),
                        Forms\Components\TextInput::make('sort_order')->label('Sıralama')->numeric()->default(0),
                    ])->columns(2),

                Forms\Components\Tabs::make('Translations')
                    ->tabs([
                        Forms\Components\Tabs\Tab::make('🇦🇿 Azərbaycan')
                            ->schema([
                                Forms\Components\TextInput::make('title.az')->label('Title (AZ)')->maxLength(60),
                                Forms\Components\Textarea::make('description.az')->label('Description (AZ)')->rows(2)->maxLength(160),
                                Forms\Components\TextInput::make('keywords.az')->label('Keywords (AZ)'),
                            ]),
                        Forms\Components\Tabs\Tab::make('🇹🇷 Türkçe')
                            ->schema([
                                Forms\Components\TextInput::make('title.tr')->label('Title (TR)')->maxLength(60),
                                Forms\Components\Textarea::make('description.tr')->label('Description (TR)')->rows(2)->maxLength(160),
                                Forms\Components\TextInput::make('keywords.tr')->label('Keywords (TR)'),
                            ]),
                        Forms\Components\Tabs\Tab::make('🇬🇧 English')
                            ->schema([
                                Forms\Components\TextInput::make('title.en')->label('Title (EN)')->maxLength(60),
                                Forms\Components\Textarea::make('description.en')->label('Description (EN)')->rows(2)->maxLength(160),
                                Forms\Components\TextInput::make('keywords.en')->label('Keywords (EN)'),
                            ]),
                        Forms\Components\Tabs\Tab::make('🇷🇺 Русский')
                            ->schema([
                                Forms\Components\TextInput::make('title.ru')->label('Title (RU)')->maxLength(60),
                                Forms\Components\Textarea::make('description.ru')->label('Description (RU)')->rows(2)->maxLength(160),
                                Forms\Components\TextInput::make('keywords.ru')->label('Keywords (RU)'),
                            ]),
                    ])->columnSpanFull(),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->defaultSort('sort_order')
            ->columns([
                Tables\Columns\TextColumn::make('page_key')->label('Anahtar')->badge()->color('gray'),
                Tables\Columns\TextColumn::make('page_name')->label('Sayfa')->searchable()->sortable()->weight('bold'),
                Tables\Columns\TextColumn::make('route_name')->label('Route')->searchable()->toggleable(),
                Tables\Columns\TextColumn::make('title')->label('Title (AZ)')->limit(40)->toggleable(),
                Tables\Columns\TextColumn::make('canonical_url')->label('Canonical')->limit(30)->toggleable(),
                Tables\Columns\TextColumn::make('sort_order')->label('Sıra')->sortable(),
            ])
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
            'index' => Pages\ListPageSeos::route('/'),
            'create' => Pages\CreatePageSeo::route('/create'),
            'edit' => Pages\EditPageSeo::route('/{record}/edit'),
        ];
    }
}
