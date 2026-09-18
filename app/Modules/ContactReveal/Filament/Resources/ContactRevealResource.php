<?php

namespace App\Modules\ContactReveal\Filament\Resources;

use App\Modules\ContactReveal\Filament\Resources\ContactRevealResource\Pages;
use App\Modules\ContactReveal\Models\ContactReveal;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;

class ContactRevealResource extends Resource
{
    protected static ?string $model = ContactReveal::class;

    protected static ?string $navigationIcon = 'heroicon-o-eye';
    protected static ?string $navigationGroup = null;

    public static function getNavigationGroup(): string
    {
        return __('Analytics');
    }
    protected static ?string $modelLabel = null;

    public static function getModelLabel(): string
    {
        return __('Contact Reveal (Lead)');
    }
    protected static ?string $pluralModelLabel = null;

    public static function getPluralModelLabel(): string
    {
        return __('Contact Reveals (Lead)');
    }
    protected static ?int $navigationSort = 10;

    public static function table(Table $table): Table
    {
        return $table
            ->defaultSort('id', 'desc')
            ->columns([
                Tables\Columns\TextColumn::make('listing_type')
                    ->label(__('Type'))
                    ->badge()
                    ->formatStateUsing(fn (string $state): string => match ($state) {
                        'job_seeker' => 'İş Arayan',
                        'vacancy' => __('Vacancy'),
                        default => $state,
                    })
                    ->color(fn (string $state): string => $state === 'job_seeker' ? 'info' : 'primary'),

                Tables\Columns\TextColumn::make('listing_id')
                    ->label(__('Listing ID'))
                    ->sortable(),

                Tables\Columns\TextColumn::make('user.name')
                    ->label(__('User'))
                    ->placeholder('—'),

                Tables\Columns\TextColumn::make('ip_address')
                    ->label(__('IP'))
                    ->copyable()
                    ->toggleable(),

                Tables\Columns\TextColumn::make('created_at')
                    ->label(__('Date'))
                    ->dateTime('d.m.Y H:i')
                    ->sortable(),
            ])
            ->filters([
                Tables\Filters\SelectFilter::make('listing_type')
                    ->label(__('Type'))
                    ->options([
                        'job_seeker' => 'İş Arayan',
                        'vacancy' => __('Vacancy'),
                    ]),
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
            'index' => Pages\ListContactReveals::route('/'),
        ];
    }
}
