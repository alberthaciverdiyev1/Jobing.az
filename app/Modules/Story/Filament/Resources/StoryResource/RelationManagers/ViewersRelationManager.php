<?php

namespace App\Modules\Story\Filament\Resources\StoryResource\RelationManagers;

use Filament\Resources\RelationManagers\RelationManager;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Model;

class ViewersRelationManager extends RelationManager
{
    protected static string $relationship = 'views';

    public static function getTitle(Model $ownerRecord, string $pageClass): string
    {
        return __('Viewers');
    }

    public function table(Table $table): Table
    {
        return $table
            ->defaultSort('viewed_at', 'desc')
            ->columns([
                Tables\Columns\TextColumn::make('user.name')
                    ->label(__('Name'))
                    ->searchable()
                    ->sortable()
                    ->weight('bold'),

                Tables\Columns\TextColumn::make('user.email')
                    ->label(__('Email'))
                    ->searchable()
                    ->copyable(),

                Tables\Columns\TextColumn::make('user.company.name')
                    ->label(__('Company'))
                    ->placeholder('—')
                    ->toggleable(),

                Tables\Columns\TextColumn::make('viewed_at')
                    ->label(__('Viewed at'))
                    ->dateTime('d.m.Y H:i')
                    ->sortable(),

                Tables\Columns\TextColumn::make('created_at')
                    ->label(__('First viewed'))
                    ->dateTime('d.m.Y H:i')
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->actions([])
            ->bulkActions([]);
    }

    protected function canCreate(): bool
    {
        return false;
    }

    protected function canEdit(Model $record): bool
    {
        return false;
    }

    protected function canDelete(Model $record): bool
    {
        return false;
    }

    protected function canDeleteAny(): bool
    {
        return false;
    }
}
