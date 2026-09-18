<?php

namespace App\Modules\Visitor\Filament\Resources;

use App\Modules\Visitor\Filament\Resources\VisitorResource\Pages;
use App\Modules\Visitor\Models\Visitor;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;

class VisitorResource extends Resource
{
    protected static ?string $model = Visitor::class;

    protected static ?string $navigationIcon = 'heroicon-o-user-group';

    public static function getNavigationGroup(): string
    {
        return __('Analytics');
    }

    public static function getModelLabel(): string
    {
        return __('Visitor');
    }

    public static function getPluralModelLabel(): string
    {
        return __('Visitors');
    }

    protected static ?int $navigationSort = 13;

    public static function canCreate(): bool
    {
        return false;
    }

    public static function table(Table $table): Table
    {
        return $table
            ->defaultSort('last_visit', 'desc')
            ->columns([
                Tables\Columns\TextColumn::make('ip')->label(__('IP'))->searchable()->copyable(),
                Tables\Columns\TextColumn::make('visit_count')->label(__('Visits'))->badge()->color('primary')->sortable(),
                Tables\Columns\TextColumn::make('user_agent')->label(__('User Agent'))->limit(60)->toggleable(),
                Tables\Columns\TextColumn::make('last_visit')->label(__('Last Visit'))->dateTime('d.m.Y H:i')->sortable(),
                Tables\Columns\TextColumn::make('created_at')->label(__('First Visit'))->dateTime('d.m.Y')->toggleable(),
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
            'index' => Pages\ListVisitors::route('/'),
        ];
    }
}
