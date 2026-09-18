<?php

namespace App\Modules\ActivityLog\Filament\Resources;

use App\Modules\ActivityLog\Filament\Resources\ActivityLogResource\Pages;
use App\Modules\ActivityLog\Models\ActivityLog;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;

class ActivityLogResource extends Resource
{
    protected static ?string $model = ActivityLog::class;

    protected static ?string $navigationIcon = 'heroicon-o-list-bullet';
    protected static ?string $navigationGroup = null;

    public static function getNavigationGroup(): string
    {
        return __('Analytics');
    }
    protected static ?string $modelLabel = null;

    public static function getModelLabel(): string
    {
        return __('Activity Log');
    }
    protected static ?string $pluralModelLabel = null;

    public static function getPluralModelLabel(): string
    {
        return __('Activity Logs');
    }
    protected static ?int $navigationSort = 11;

    public static function canCreate(): bool
    {
        return false;
    }

    public static function table(Table $table): Table
    {
        return $table
            ->defaultSort('id', 'desc')
            ->columns([
                Tables\Columns\TextColumn::make('user.name')
                    ->label(__('User'))
                    ->placeholder(__('Guest'))
                    ->searchable(),

                Tables\Columns\TextColumn::make('action')
                    ->label(__('Action'))
                    ->badge()
                    ->searchable(),

                Tables\Columns\TextColumn::make('method')
                    ->label(__('Method'))
                    ->color('gray')
                    ->toggleable(),

                Tables\Columns\TextColumn::make('url')
                    ->label(__('URL'))
                    ->limit(40)
                    ->searchable()
                    ->toggleable(),

                Tables\Columns\TextColumn::make('device_type')
                    ->label(__('Device'))
                    ->icon(fn ($state) => match ($state) {
                        'mobile' => 'heroicon-o-device-phone-mobile',
                        'tablet' => 'heroicon-o-device-tablet',
                        default => 'heroicon-o-computer-desktop',
                    }),

                Tables\Columns\TextColumn::make('browser')
                    ->label(__('Browser'))
                    ->toggleable(),

                Tables\Columns\TextColumn::make('os')
                    ->label(__('OS'))
                    ->toggleable(),

                Tables\Columns\TextColumn::make('ip_address')
                    ->label(__('IP'))
                    ->copyable()
                    ->toggleable(),

                Tables\Columns\TextColumn::make('status_code')
                    ->label(__('Status'))
                    ->color(fn ($state) => (int) $state >= 400 ? 'danger' : 'success')
                    ->toggleable(),

                Tables\Columns\TextColumn::make('location_text')
                    ->label(__('Location'))
                    ->state(fn (ActivityLog $record): string => $record->location_text)
                    ->toggleable(),

                Tables\Columns\TextColumn::make('duration_ms')
                    ->label(__('Duration'))
                    ->suffix(' ms')
                    ->color(fn ($state) => (int) $state > 1000 ? 'warning' : 'gray')
                    ->sortable()
                    ->toggleable(),

                Tables\Columns\TextColumn::make('created_at')
                    ->label(__('Date'))
                    ->dateTime('d.m.Y H:i')
                    ->sortable(),
            ])
            ->actions([
                Tables\Actions\ViewAction::make()
                    ->label(__('Details'))
                    ->modalHeading(fn (ActivityLog $record): string => __('Activity Details'))
                    ->modalSubmitAction(false)
                    ->modalCancelActionLabel(__('Close')),
            ])
            ->filters([
                Tables\Filters\SelectFilter::make('action')
                    ->label(__('Action'))
                    ->options(fn () => ActivityLog::query()->whereNotNull('action')->distinct()->pluck('action', 'action')->all()),
                Tables\Filters\SelectFilter::make('device_type')
                    ->label(__('Device'))
                    ->options(['desktop' => 'Desktop', 'mobile' => 'Mobile', 'tablet' => 'Tablet']),
                Tables\Filters\SelectFilter::make('user_id')
                    ->label(__('User'))
                    // Diqqət: "relationship" logs bazasında "users" axtarır (yoxdur) → options istifadə edirik.
                    ->options(fn (): array => \App\Models\User::query()->orderBy('name')->pluck('name', 'id')->all())
                    ->searchable(),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),
                ]),
            ]);
    }

    public static function infolist(\Filament\Infolists\Infolist $infolist): \Filament\Infolists\Infolist
    {
        return $infolist->schema([
            \Filament\Infolists\Components\Section::make(__('Overview'))->schema([
                \Filament\Infolists\Components\TextEntry::make('user.name')->label(__('User'))->placeholder(__('Guest')),
                \Filament\Infolists\Components\TextEntry::make('action')->label(__('Action'))->badge(),
                \Filament\Infolists\Components\TextEntry::make('status_code')->label(__('Status')),
                \Filament\Infolists\Components\TextEntry::make('duration_ms')->label(__('Duration'))->suffix(' ms'),
                \Filament\Infolists\Components\TextEntry::make('method')->label(__('Method')),
                \Filament\Infolists\Components\TextEntry::make('url')->label(__('URL'))->columnSpanFull()->copyable(),
                \Filament\Infolists\Components\TextEntry::make('referer')->label(__('Referer'))->columnSpanFull()->placeholder('—'),
                \Filament\Infolists\Components\TextEntry::make('created_at')->label(__('Date'))->dateTime('d.m.Y H:i:s'),
            ])->columns(3),

            \Filament\Infolists\Components\Section::make(__('Location & Device'))->schema([
                \Filament\Infolists\Components\TextEntry::make('location_text')->label(__('Location')),
                \Filament\Infolists\Components\TextEntry::make('ip_address')->label(__('IP'))->copyable(),
                \Filament\Infolists\Components\TextEntry::make('isp')->label(__('ISP'))->placeholder('—'),
                \Filament\Infolists\Components\TextEntry::make('device_type')->label(__('Device')),
                \Filament\Infolists\Components\TextEntry::make('browser')->label(__('Browser')),
                \Filament\Infolists\Components\TextEntry::make('os')->label(__('OS')),
                \Filament\Infolists\Components\TextEntry::make('user_agent')->label(__('User Agent'))->columnSpanFull()->placeholder('—'),
                \Filament\Infolists\Components\TextEntry::make('google_maps_url')
                    ->label(__('Map'))
                    ->placeholder('—')
                    ->url(fn (ActivityLog $record): ?string => $record->google_maps_url, shouldOpenInNewTab: true),
            ])->columns(3),

            \Filament\Infolists\Components\Section::make(__('Payload'))->schema([
                \Filament\Infolists\Components\TextEntry::make('payload')
                    ->hiddenLabel()
                    ->state(fn (ActivityLog $record): string => json_encode($record->payload, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES) ?: '—')
                    ->fontFamily(\Filament\Support\Enums\FontFamily::Mono)
                    ->columnSpanFull(),
            ]),
        ]);
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListActivityLogs::route('/'),
        ];
    }
}
