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
    protected static ?string $navigationGroup = 'Analitika';
    protected static ?string $modelLabel = 'Əlaqə Açılması (Lead)';
    protected static ?string $pluralModelLabel = 'Əlaqə Açılmaları (Lead)';
    protected static ?int $navigationSort = 10;

    public static function table(Table $table): Table
    {
        return $table
            ->defaultSort('id', 'desc')
            ->columns([
                Tables\Columns\TextColumn::make('listing_type')
                    ->label('Növ')
                    ->badge()
                    ->formatStateUsing(fn (string $state): string => match ($state) {
                        'job_seeker' => 'İş Arayan',
                        'vacancy' => 'Vakansiya',
                        default => $state,
                    })
                    ->color(fn (string $state): string => $state === 'job_seeker' ? 'info' : 'primary'),

                Tables\Columns\TextColumn::make('listing_id')
                    ->label('Elan ID')
                    ->sortable(),

                Tables\Columns\TextColumn::make('user.name')
                    ->label('İstifadəçi')
                    ->placeholder('—'),

                Tables\Columns\TextColumn::make('ip_address')
                    ->label('IP')
                    ->copyable()
                    ->toggleable(),

                Tables\Columns\TextColumn::make('created_at')
                    ->label('Tarix')
                    ->dateTime('d.m.Y H:i')
                    ->sortable(),
            ])
            ->filters([
                Tables\Filters\SelectFilter::make('listing_type')
                    ->label('Növ')
                    ->options([
                        'job_seeker' => 'İş Arayan',
                        'vacancy' => 'Vakansiya',
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
