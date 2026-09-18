<?php

namespace App\Modules\SystemLog\Filament\Resources;

use App\Modules\SystemLog\Filament\Resources\AppLogResource\Pages;
use App\Modules\SystemLog\Models\AppLog;
use Filament\Infolists;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;

class AppLogResource extends Resource
{
    protected static ?string $model = AppLog::class;

    protected static ?string $navigationIcon = 'heroicon-o-exclamation-triangle';

    public static function getNavigationGroup(): string
    {
        return __('Analytics');
    }

    public static function getModelLabel(): string
    {
        return __('System Log');
    }

    public static function getPluralModelLabel(): string
    {
        return __('System Logs');
    }

    protected static ?int $navigationSort = 12;

    public static function canCreate(): bool
    {
        return false;
    }

    public static function table(Table $table): Table
    {
        return $table
            ->defaultSort('id', 'desc')
            ->columns([
                Tables\Columns\TextColumn::make('level')
                    ->label(__('Level'))
                    ->badge()
                    ->color(fn ($state): string => match ($state) {
                        'error', 'critical', 'emergency' => 'danger',
                        'warning' => 'warning',
                        default => 'gray',
                    })
                    ->sortable(),

                Tables\Columns\TextColumn::make('source')
                    ->label(__('Source'))
                    ->limit(30)
                    ->toggleable(),

                Tables\Columns\TextColumn::make('message')
                    ->label(__('Message'))
                    ->limit(70)
                    ->searchable()
                    ->wrap(),

                Tables\Columns\TextColumn::make('method')
                    ->label(__('Method'))
                    ->toggleable(),

                Tables\Columns\TextColumn::make('url')
                    ->label(__('URL'))
                    ->limit(35)
                    ->toggleable(),

                Tables\Columns\TextColumn::make('ip')
                    ->label(__('IP'))
                    ->toggleable(),

                Tables\Columns\TextColumn::make('created_at')
                    ->label(__('Date'))
                    ->dateTime('d.m.Y H:i:s')
                    ->sortable(),
            ])
            ->filters([
                Tables\Filters\SelectFilter::make('level')
                    ->label(__('Level'))
                    ->options(['info' => 'Info', 'warning' => 'Warning', 'error' => 'Error']),
            ])
            ->actions([
                Tables\Actions\ViewAction::make()
                    ->label(__('Details'))
                    ->modalSubmitAction(false)
                    ->modalCancelActionLabel(__('Close')),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),
                ]),
            ]);
    }

    public static function infolist(Infolists\Infolist $infolist): Infolists\Infolist
    {
        return $infolist->schema([
            Infolists\Components\TextEntry::make('level')->label(__('Level'))->badge(),
            Infolists\Components\TextEntry::make('source')->label(__('Source'))->placeholder('—'),
            Infolists\Components\TextEntry::make('created_at')->label(__('Date'))->dateTime('d.m.Y H:i:s'),
            Infolists\Components\TextEntry::make('message')->label(__('Message'))->columnSpanFull(),
            Infolists\Components\TextEntry::make('url')->label(__('URL'))->columnSpanFull()->placeholder('—'),
            Infolists\Components\TextEntry::make('metadata')
                ->label(__('Metadata'))
                ->state(fn (AppLog $r): string => json_encode($r->metadata, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES) ?: '—')
                ->fontFamily(\Filament\Support\Enums\FontFamily::Mono)
                ->columnSpanFull(),
        ]);
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListAppLogs::route('/'),
        ];
    }
}
