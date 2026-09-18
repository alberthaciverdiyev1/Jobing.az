<?php

namespace App\Modules\News\Filament\Resources;

use App\Modules\News\Filament\Resources\RssSourceResource\Pages;
use App\Modules\News\Models\RssSource;
use App\Modules\News\Services\RssImportService;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Notifications\Notification;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;

class RssSourceResource extends Resource
{
    protected static ?string $model = RssSource::class;

    protected static ?string $navigationIcon = 'heroicon-o-rss';

    public static function getNavigationGroup(): string
    {
        return __('Content');
    }

    public static function getModelLabel(): string
    {
        return __('RSS Source');
    }

    public static function getPluralModelLabel(): string
    {
        return __('RSS Sources');
    }

    public static function form(Form $form): Form
    {
        return $form->schema([
            Forms\Components\TextInput::make('name')->label(__('Name'))->required()->maxLength(150),
            Forms\Components\TextInput::make('url')->label(__('RSS URL'))->required()->url()->maxLength(500)->unique(ignoreRecord: true),
            Forms\Components\TextInput::make('category')->label(__('Default Category'))->maxLength(100),
            Forms\Components\Toggle::make('is_active')->label(__('Active'))->default(true),
        ])->columns(2);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->defaultSort('id', 'desc')
            ->columns([
                Tables\Columns\TextColumn::make('name')->label(__('Name'))->searchable()->weight('bold'),
                Tables\Columns\TextColumn::make('url')->label(__('RSS URL'))->limit(45)->copyable(),
                Tables\Columns\TextColumn::make('category')->label(__('Category'))->badge()->color('gray'),
                Tables\Columns\IconColumn::make('is_active')->label(__('Active'))->boolean(),
                Tables\Columns\TextColumn::make('last_fetched_at')->label(__('Last Fetched'))->dateTime('d.m.Y H:i')->placeholder('—'),
            ])
            ->headerActions([
                Tables\Actions\Action::make('importAll')
                    ->label(__('Import all now'))
                    ->icon('heroicon-o-arrow-down-tray')
                    ->action(function (RssImportService $service): void {
                        $result = $service->importAll();
                        $total = array_sum($result);
                        Notification::make()
                            ->title(__('Import completed'))
                            ->body(__('New items:') . ' ' . $total)
                            ->success()
                            ->send();
                    }),
            ])
            ->actions([
                Tables\Actions\Action::make('import')
                    ->label(__('Import'))
                    ->icon('heroicon-o-arrow-down-tray')
                    ->color('primary')
                    ->action(function (RssSource $record, RssImportService $service): void {
                        $count = $service->importSource($record);
                        Notification::make()->title(__('Imported') . ': ' . $count)->success()->send();
                    }),
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
            'index' => Pages\ListRssSources::route('/'),
            'create' => Pages\CreateRssSource::route('/create'),
            'edit' => Pages\EditRssSource::route('/{record}/edit'),
        ];
    }
}
