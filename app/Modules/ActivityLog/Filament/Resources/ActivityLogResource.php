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

                Tables\Columns\TextColumn::make('created_at')
                    ->label(__('Date'))
                    ->dateTime('d.m.Y H:i')
                    ->sortable(),
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
                    ->relationship('user', 'name'),
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
            'index' => Pages\ListActivityLogs::route('/'),
        ];
    }
}
