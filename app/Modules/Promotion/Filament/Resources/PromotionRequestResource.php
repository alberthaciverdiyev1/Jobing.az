<?php

namespace App\Modules\Promotion\Filament\Resources;

use App\Modules\Promotion\Filament\Resources\PromotionRequestResource\Pages;
use App\Modules\Promotion\Models\PromotionRequest;
use Filament\Notifications\Notification;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;

class PromotionRequestResource extends Resource
{
    protected static ?string $model = PromotionRequest::class;

    protected static ?string $navigationIcon = 'heroicon-o-megaphone';

    public static function getNavigationGroup(): string
    {
        return __('Listing & Company Management');
    }

    public static function getModelLabel(): string
    {
        return __('Promotion Request');
    }

    public static function getPluralModelLabel(): string
    {
        return __('Promotion Requests');
    }

    protected static ?int $navigationSort = 5;

    public static function getNavigationBadge(): ?string
    {
        $count = PromotionRequest::where('status', 'pending')->count();

        return $count > 0 ? (string) $count : null;
    }

    public static function getNavigationBadgeColor(): ?string
    {
        return 'warning';
    }

    public static function table(Table $table): Table
    {
        return $table
            ->defaultSort('id', 'desc')
            ->columns([
                Tables\Columns\TextColumn::make('vacancy.title')->label(__('Listing'))->limit(35)->searchable(),
                Tables\Columns\TextColumn::make('user.name')->label(__('User'))->placeholder('—')->toggleable(),
                Tables\Columns\TextColumn::make('mode')
                    ->label(__('Type'))
                    ->badge()
                    ->formatStateUsing(fn (string $state): string => $state === 'premium' ? __('Premium') : __('Boost'))
                    ->color(fn (string $state): string => $state === 'premium' ? 'warning' : 'primary'),
                Tables\Columns\TextColumn::make('times')->label(__('Package'))->suffix('×')->badge()->color('gray'),
                Tables\Columns\TextColumn::make('price')->label(__('Price'))->money('AZN'),
                Tables\Columns\TextColumn::make('phone')->label(__('Phone'))->copyable()->toggleable(),
                Tables\Columns\TextColumn::make('status')
                    ->label(__('Status'))
                    ->badge()
                    ->color(fn (string $state): string => match ($state) {
                        'approved' => 'success',
                        'rejected' => 'danger',
                        default => 'warning',
                    })
                    ->formatStateUsing(fn (string $state): string => __(ucfirst($state))),
                Tables\Columns\TextColumn::make('created_at')->label(__('Date'))->dateTime('d.m.Y H:i')->sortable(),
            ])
            ->filters([
                Tables\Filters\SelectFilter::make('status')->label(__('Status'))->options([
                    'pending' => __('Pending'), 'approved' => __('Approved'), 'rejected' => __('Rejected'),
                ]),
                Tables\Filters\SelectFilter::make('mode')->label(__('Type'))->options([
                    'premium' => __('Premium'), 'boost' => __('Boost'),
                ]),
            ])
            ->actions([
                Tables\Actions\Action::make('approve')
                    ->label(__('Approve'))
                    ->icon('heroicon-o-check-circle')
                    ->color('success')
                    ->requiresConfirmation()
                    ->visible(fn (PromotionRequest $r): bool => $r->status !== 'approved')
                    ->action(function (PromotionRequest $record): void {
                        $record->approve();
                        Notification::make()->title(__('Promotion applied'))->success()->send();
                    }),

                Tables\Actions\Action::make('reject')
                    ->label(__('Reject'))
                    ->icon('heroicon-o-x-circle')
                    ->color('danger')
                    ->requiresConfirmation()
                    ->visible(fn (PromotionRequest $r): bool => $r->status !== 'rejected')
                    ->action(function (PromotionRequest $record): void {
                        $record->reject();
                        Notification::make()->title(__('Request rejected'))->send();
                    }),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),
                ]),
            ]);
    }

    public static function getPages(): array
    {
        return ['index' => Pages\ListPromotionRequests::route('/')];
    }
}
