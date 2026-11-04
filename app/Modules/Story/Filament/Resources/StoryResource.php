<?php

namespace App\Modules\Story\Filament\Resources;

use App\Modules\Story\Filament\Resources\StoryResource\Pages;
use App\Modules\Story\Filament\Resources\StoryResource\RelationManagers\ViewersRelationManager;
use App\Modules\Story\Models\Story;
use Filament\Facades\Filament;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Support\Carbon;

class StoryResource extends Resource
{
    protected static ?string $model = Story::class;

    protected static ?string $navigationIcon = 'heroicon-o-play-circle';

    public static function getNavigationGroup(): string
    {
        return __('Content');
    }

    public static function getModelLabel(): string
    {
        return __('Story');
    }

    public static function getPluralModelLabel(): string
    {
        return __('Stories');
    }

    protected static ?int $navigationSort = 6;

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Section::make(__('Story'))
                    ->schema([
                        Forms\Components\FileUpload::make('media_path')
                            ->label(__('Media (image or video)'))
                            ->helperText(__('Images open in the photo editor. Videos are compressed automatically after upload.'))
                            ->disk('public')
                            ->directory('stories')
                            ->acceptedFileTypes([
                                'image/jpeg',
                                'image/png',
                                'image/webp',
                                'image/gif',
                                'video/mp4',
                                'video/quicktime',
                                'video/webm',
                                'video/x-m4v',
                            ])
                            ->maxSize(102400)
                            ->imageEditor()
                            ->imageEditorAspectRatios(['9:16', '1:1', '4:5'])
                            ->imagePreviewHeight('220')
                            ->required(),

                        Forms\Components\TextInput::make('link_url')
                            ->label(__('Link (optional)'))
                            ->url()
                            ->maxLength(2048)
                            ->placeholder('https://jobing.az/...'),

                        Forms\Components\Select::make('company_id')
                            ->label(__('Company'))
                            ->relationship('company', 'name')
                            ->searchable()
                            ->preload()
                            ->helperText(__('Leave empty to publish as your own account.'))
                            ->visible(fn (): bool => Filament::getCurrentPanel()?->getId() === 'admin'),

                        Forms\Components\DateTimePicker::make('expires_at')
                            ->label(__('Expires at'))
                            ->helperText(__('The story is hidden after this date. Leave empty for no expiry.'))
                            ->default(fn (): Carbon => now()->addDay())
                            ->seconds(false),

                        Forms\Components\Toggle::make('is_active')
                            ->label(__('Active'))
                            ->default(true),
                    ])
                    ->columns(2),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->defaultSort('created_at', 'desc')
            ->columns([
                Tables\Columns\ImageColumn::make('media_preview')
                    ->label(__('Media'))
                    ->disk('public')
                    ->height(46)
                    ->width(46)
                    ->getStateUsing(fn (Story $record): ?string => $record->isVideo()
                        ? $record->thumbnail_path
                        : $record->media_path),

                Tables\Columns\TextColumn::make('owner_name')
                    ->label(__('Shared by'))
                    ->description(fn (Story $record): ?string => $record->company_id ? __('Company') : __('User'))
                    ->weight('bold')
                    ->limit(30),

                Tables\Columns\TextColumn::make('media_type')
                    ->label(__('Type'))
                    ->badge()
                    ->formatStateUsing(fn (string $state): string => $state === 'video' ? __('Video') : __('Image'))
                    ->color(fn (string $state): string => $state === 'video' ? 'warning' : 'info'),

                Tables\Columns\TextColumn::make('views_count')
                    ->label(__('Views'))
                    ->counts('views')
                    ->sortable(),

                Tables\Columns\IconColumn::make('is_active')
                    ->label(__('Active'))
                    ->boolean(),

                Tables\Columns\TextColumn::make('expires_at')
                    ->label(__('Expires at'))
                    ->dateTime('d.m.Y H:i')
                    ->placeholder(__('No expiry'))
                    ->sortable(),

                Tables\Columns\TextColumn::make('created_at')
                    ->label(__('Created at'))
                    ->dateTime('d.m.Y H:i')
                    ->sortable(),
            ])
            ->filters([
                Tables\Filters\TernaryFilter::make('is_active')->label(__('Active')),
                Tables\Filters\SelectFilter::make('media_type')
                    ->label(__('Type'))
                    ->options([
                        'image' => __('Image'),
                        'video' => __('Video'),
                    ]),
            ])
            ->actions([
                Tables\Actions\Action::make('open')
                    ->label(__('Open'))
                    ->icon('heroicon-o-arrow-top-right-on-square')
                    ->url(fn (Story $record): string => $record->media_url)
                    ->openUrlInNewTab(),
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
            ViewersRelationManager::class,
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListStories::route('/'),
            'create' => Pages\CreateStory::route('/create'),
            'edit' => Pages\EditStory::route('/{record}/edit'),
        ];
    }
}
