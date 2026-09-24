<?php

namespace App\Modules\News\Filament\Resources;

use App\Modules\News\Filament\Resources\NewsResource\Pages;
use App\Modules\News\Models\News;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;

class NewsResource extends Resource
{
    protected static ?string $model = News::class;

    protected static ?string $navigationIcon = 'heroicon-o-newspaper';

    public static function getNavigationGroup(): string
    {
        return __('Content');
    }

    public static function getModelLabel(): string
    {
        return __('News');
    }

    public static function getPluralModelLabel(): string
    {
        return __('News');
    }

    public static function form(Form $form): Form
    {
        return $form->schema([
            Forms\Components\Section::make(__('General'))->schema([
                Forms\Components\TextInput::make('slug')->label(__('Slug'))->maxLength(255)->helperText(__('Leave empty to auto-generate')),
                Forms\Components\TextInput::make('category')->label(__('Category'))->maxLength(100),
                Forms\Components\TextInput::make('image_url')->label(__('Image URL'))->url()->maxLength(500),
                Forms\Components\TextInput::make('source_name')->label(__('Source Name'))->maxLength(150),
                Forms\Components\TextInput::make('source_url')->label(__('Source URL'))->url()->maxLength(500),
                Forms\Components\Toggle::make('is_active')->label(__('Active'))->default(true),
                Forms\Components\DateTimePicker::make('published_at')->label(__('Published At'))->default(now()),
            ])->columns(2),

            Forms\Components\Tabs::make('translations')->tabs([
                Forms\Components\Tabs\Tab::make('🇦🇿 ' . __('languages.Azerbaijani'))->schema([
                    Forms\Components\TextInput::make('title.az')->label(__('Title'))->maxLength(255),
                    Forms\Components\Textarea::make('description.az')->label(__('Description'))->rows(2),
                    Forms\Components\RichEditor::make('content.az')->label(__('Content')),
                ]),
                Forms\Components\Tabs\Tab::make('🇬🇧 ' . __('languages.English'))->schema([
                    Forms\Components\TextInput::make('title.en')->label(__('Title'))->maxLength(255),
                    Forms\Components\Textarea::make('description.en')->label(__('Description'))->rows(2),
                    Forms\Components\RichEditor::make('content.en')->label(__('Content')),
                ]),
                Forms\Components\Tabs\Tab::make('🇹🇷 ' . __('languages.Turkish') . ' (' . __('Default') . ')')->schema([
                    Forms\Components\TextInput::make('title.tr')->label(__('Title'))->maxLength(255)->required(),
                    Forms\Components\Textarea::make('description.tr')->label(__('Description'))->rows(2),
                    Forms\Components\RichEditor::make('content.tr')->label(__('Content')),
                ]),
                Forms\Components\Tabs\Tab::make('🇷🇺 ' . __('languages.Russian'))->schema([
                    Forms\Components\TextInput::make('title.ru')->label(__('Title'))->maxLength(255),
                    Forms\Components\Textarea::make('description.ru')->label(__('Description'))->rows(2),
                    Forms\Components\RichEditor::make('content.ru')->label(__('Content')),
                ]),
            ])->columnSpanFull(),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->defaultSort('published_at', 'desc')
            ->columns([
                Tables\Columns\TextColumn::make('title')->label(__('Title'))->searchable()->limit(50)->weight('bold'),
                Tables\Columns\TextColumn::make('category')->label(__('Category'))->badge()->color('gray'),
                Tables\Columns\TextColumn::make('source_name')->label(__('Source'))->toggleable(),
                Tables\Columns\TextColumn::make('views')->label(__('Views'))->sortable()->toggleable(),
                Tables\Columns\IconColumn::make('is_active')->label(__('Active'))->boolean(),
                Tables\Columns\TextColumn::make('published_at')->label(__('Published At'))->dateTime('d.m.Y H:i')->sortable(),
            ])
            ->actions([
                Tables\Actions\EditAction::make(),
                Tables\Actions\DeleteAction::make(),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([Tables\Actions\DeleteBulkAction::make()]),
            ]);
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListNews::route('/'),
            'create' => Pages\CreateNews::route('/create'),
            'edit' => Pages\EditNews::route('/{record}/edit'),
        ];
    }
}
