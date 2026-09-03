<?php

namespace App\Modules\Application\Filament\Resources;

use App\Modules\Application\Filament\Resources\MyApplicationsResource\Pages;
use App\Modules\Application\Models\Application;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;

class MyApplicationsResource extends Resource
{
    protected static ?string $model = Application::class;

    protected static ?string $navigationIcon = 'heroicon-o-document-text';
    protected static ?string $navigationLabel = 'Başvurularım';
    protected static ?string $modelLabel = 'Başvurum';
    protected static ?string $pluralModelLabel = 'Başvurularım';
    protected static ?int $navigationSort = 1;

    public static function canViewAny(): bool
    {
        return true;
    }

    public static function canCreate(): bool
    {
        return false;
    }

    public static function getEloquentQuery(): Builder
    {
        return parent::getEloquentQuery()->where('user_id', auth()->id());
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('vacancy.title')
                    ->label('Pozisyon')
                    ->searchable()
                    ->sortable()
                    ->weight('bold')
                    ->limit(40),

                Tables\Columns\TextColumn::make('vacancy.company.name')
                    ->label('Şirkət')
                    ->searchable(),

                Tables\Columns\TextColumn::make('status')
                    ->label('Durum')
                    ->badge()
                    ->color(fn (string $state): string => match ($state) {
                        'Beklemede' => 'gray',
                        'İncelendi' => 'info',
                        'Mülakat' => 'warning',
                        'Teklif', 'Kabul' => 'success',
                        'Red' => 'danger',
                        default => 'primary',
                    }),

                Tables\Columns\TextColumn::make('created_at')
                    ->label('Başvuru Tarihi')
                    ->dateTime('d.m.Y')
                    ->sortable(),
            ])
            ->defaultSort('created_at', 'desc')
            ->actions([
                Tables\Actions\ViewAction::make(),
            ]);
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListMyApplications::route('/'),
            'view' => Pages\ViewMyApplications::route('/{record}'),
        ];
    }
}
