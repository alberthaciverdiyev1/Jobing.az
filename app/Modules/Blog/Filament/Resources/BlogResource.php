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
    protected static ?string $navigationGroup = null;

    public static function getNavigationGroup(): string
    {
        return __('Content');
    }
    protected static ?string $modelLabel = null;

    public static function getModelLabel(): string
    {
        return __('Blog');
    }
    protected static ?string $pluralModelLabel = null;

    public static function getPluralModelLabel(): string
    {
        return __('Blogs');
    }
    protected static ?int $navigationSort = 2;

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Section::make(__('General Settings'))
                    ->schema([
                        Forms\Components\TextInput::make('slug')->label(__('Slug'))->helperText(__('If left empty, it will be auto-generated')),
                        Forms\Components\TextInput::make('category')->label(__('Category'))->placeholder(__('e.g.: Career, Advice, News')),
                        Forms\Components\FileUpload::make('cover_image')->label(__('Cover Image'))->image()->directory('blog-covers'),
                        Forms\Components\Toggle::make('is_active')->label(__('Active'))->default(true),
                        Forms\Components\DateTimePicker::make('published_at')->label(__('Publication date')),
                    ])->columns(2),

                Forms\Components\Tabs::make('Translations')
                    ->tabs([
                        Forms\Components\Tabs\Tab::make('🇦🇿 ' . __('languages.Azerbaijani'))
                            ->schema([
                                Forms\Components\TextInput::make('title.az')->label(__('Title (AZ)'))->required()->live(onBlur: true)
                                    ->afterStateUpdated(fn (string $operation, $state, Forms\Set $set, Forms\Get $get) => $operation === 'create' && empty($get('slug')) ? $set('slug', \Illuminate\Support\Str::slug($state)) : null),
                                Forms\Components\Textarea::make('excerpt.az')->label(__('Short Text (AZ)'))->rows(2),
                                Forms\Components\RichEditor::make('content.az')->label(__('Content (AZ)'))->required(),
                            ]),
                        Forms\Components\Tabs\Tab::make('🇬🇧 ' . __('languages.English'))
                            ->schema([
                                Forms\Components\TextInput::make('title.en')->label(__('Title (EN)')),
                                Forms\Components\Textarea::make('excerpt.en')->label(__('Excerpt (EN)'))->rows(2),
                                Forms\Components\RichEditor::make('content.en')->label(__('Content (EN)')),
                            ]),
                        Forms\Components\Tabs\Tab::make('🇹🇷 ' . __('languages.Turkish'))
                            ->schema([
                                Forms\Components\TextInput::make('title.tr')->label(__('Title (TR)')),
                                Forms\Components\Textarea::make('excerpt.tr')->label(__('Summary (TR)'))->rows(2),
                                Forms\Components\RichEditor::make('content.tr')->label(__('Content (TR)')),
                            ]),
                        Forms\Components\Tabs\Tab::make('🇷🇺 ' . __('languages.Russian'))
                            ->schema([
                                Forms\Components\TextInput::make('title.ru')->label(__('Title (RU)')),
                                Forms\Components\Textarea::make('excerpt.ru')->label(__('Short Description (RU)'))->rows(2),
                                Forms\Components\RichEditor::make('content.ru')->label(__('Content (RU)')),
                            ]),
                    ])->columnSpanFull(),

                Forms\Components\Section::make(__('SEO'))
                    ->description(__('If left empty, the title and excerpt are used.'))
                    ->schema([
                        Forms\Components\Tabs::make('SeoTabs')->tabs([
                            Forms\Components\Tabs\Tab::make('AZ')->schema([
                                Forms\Components\TextInput::make('meta_title.az')->label(__('Meta Title (AZ)')),
                                Forms\Components\Textarea::make('meta_description.az')->label(__('Meta Description (AZ)'))->rows(2),
                            ]),
                            Forms\Components\Tabs\Tab::make('EN')->schema([
                                Forms\Components\TextInput::make('meta_title.en')->label(__('Meta Title (EN)')),
                                Forms\Components\Textarea::make('meta_description.en')->label(__('Meta Description (EN)'))->rows(2),
                            ]),
                            Forms\Components\Tabs\Tab::make('TR')->schema([
                                Forms\Components\TextInput::make('meta_title.tr')->label(__('Meta Title (TR)')),
                                Forms\Components\Textarea::make('meta_description.tr')->label(__('Meta Description (TR)'))->rows(2),
                            ]),
                            Forms\Components\Tabs\Tab::make('RU')->schema([
                                Forms\Components\TextInput::make('meta_title.ru')->label(__('Meta Title (RU)')),
                                Forms\Components\Textarea::make('meta_description.ru')->label(__('Meta Description (RU)'))->rows(2),
                            ]),
                        ]),
                    ])
                    ->collapsed(),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->defaultSort('published_at', 'desc')
            ->columns([
                Tables\Columns\TextColumn::make('title')->label(__('Title (AZ)'))->searchable()->sortable()->weight('bold')->limit(40),
                Tables\Columns\TextColumn::make('category')->label(__('Category'))->badge()->color('gray'),
                Tables\Columns\IconColumn::make('is_active')->label(__('Active'))->boolean(),
                Tables\Columns\TextColumn::make('views_count')->label(__('Views'))->sortable(),
                Tables\Columns\TextColumn::make('published_at')->label(__('Publication date'))->dateTime('d.m.Y')->sortable(),
            ])
            ->filters([
                Tables\Filters\SelectFilter::make('category')->label(__('Category'))->options(fn () => Blog::query()->whereNotNull('category')->distinct()->pluck('category', 'category')->all()),
                Tables\Filters\TernaryFilter::make('is_active')->label(__('Active')),
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
