<?php

namespace App\Modules\Blog\Filament\Resources;

use App\Modules\Blog\Filament\Resources\BlogResource\Pages;
use App\Modules\Blog\Models\Blog;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;

class BlogResource extends Resource
{
    protected static ?string $model = Blog::class;

    protected static ?string $navigationIcon = 'heroicon-o-newspaper';
    protected static ?string $navigationGroup = 'İçerik';
    protected static ?string $modelLabel = 'Bloq';
    protected static ?string $pluralModelLabel = 'Bloqlar';
    protected static ?int $navigationSort = 2;

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Section::make('Genel Ayarlar')
                    ->schema([
                        Forms\Components\TextInput::make('slug')->label('Slug')->helperText('Boş buraxılarsa avtomatik yaradılacaq'),
                        Forms\Components\TextInput::make('category')->label('Kateqoriya')->placeholder('Məs: Karyera, Məsləhət, Xəbər'),
                        Forms\Components\FileUpload::make('cover_image')->label('Üzlük şəkli')->image()->directory('blog-covers'),
                        Forms\Components\Toggle::make('is_active')->label('Aktiv')->default(true),
                        Forms\Components\DateTimePicker::make('published_at')->label('Yayın tarixi'),
                    ])->columns(2),

                Forms\Components\Tabs::make('Translations')
                    ->tabs([
                        Forms\Components\Tabs\Tab::make('🇦🇿 Azərbaycan')
                            ->schema([
                                Forms\Components\TextInput::make('title.az')->label('Başlıq (AZ)')->required()->live(onBlur: true)
                                    ->afterStateUpdated(fn (string $operation, $state, Forms\Set $set, Forms\Get $get) => $operation === 'create' && empty($get('slug')) ? $set('slug', \Illuminate\Support\Str::slug($state)) : null),
                                Forms\Components\Textarea::make('excerpt.az')->label('Qısa mətn (AZ)')->rows(2),
                                Forms\Components\RichEditor::make('content.az')->label('Məzmun (AZ)')->required(),
                            ]),
                        Forms\Components\Tabs\Tab::make('🇬🇧 English')
                            ->schema([
                                Forms\Components\TextInput::make('title.en')->label('Title (EN)'),
                                Forms\Components\Textarea::make('excerpt.en')->label('Excerpt (EN)')->rows(2),
                                Forms\Components\RichEditor::make('content.en')->label('Content (EN)'),
                            ]),
                        Forms\Components\Tabs\Tab::make('🇹🇷 Türkçe')
                            ->schema([
                                Forms\Components\TextInput::make('title.tr')->label('Başlık (TR)'),
                                Forms\Components\Textarea::make('excerpt.tr')->label('Özet (TR)')->rows(2),
                                Forms\Components\RichEditor::make('content.tr')->label('İçerik (TR)'),
                            ]),
                        Forms\Components\Tabs\Tab::make('🇷🇺 Русский')
                            ->schema([
                                Forms\Components\TextInput::make('title.ru')->label('Заголовок (RU)'),
                                Forms\Components\Textarea::make('excerpt.ru')->label('Краткое описание (RU)')->rows(2),
                                Forms\Components\RichEditor::make('content.ru')->label('Содержание (RU)'),
                            ]),
                    ])->columnSpanFull(),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->defaultSort('published_at', 'desc')
            ->columns([
                Tables\Columns\TextColumn::make('title')->label('Başlıq (AZ)')->searchable()->sortable()->weight('bold')->limit(40),
                Tables\Columns\TextColumn::make('category')->label('Kateqoriya')->badge()->color('gray'),
                Tables\Columns\IconColumn::make('is_active')->label('Aktiv')->boolean(),
                Tables\Columns\TextColumn::make('views_count')->label('Baxış')->sortable(),
                Tables\Columns\TextColumn::make('published_at')->label('Yayın tarixi')->dateTime('d.m.Y')->sortable(),
            ])
            ->filters([
                Tables\Filters\SelectFilter::make('category')->label('Kateqoriya')->options(fn () => Blog::query()->whereNotNull('category')->distinct()->pluck('category', 'category')->all()),
                Tables\Filters\TernaryFilter::make('is_active')->label('Aktiv'),
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
            'index' => Pages\ListBlogs::route('/'),
            'create' => Pages\CreateBlog::route('/create'),
            'edit' => Pages\EditBlog::route('/{record}/edit'),
        ];
    }
}
