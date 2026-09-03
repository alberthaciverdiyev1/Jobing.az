<?php

namespace App\Modules\Resume\Filament\Resources;

use App\Modules\Resume\Models\Resume;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;

/**
 * Company panelinin aday CV gözlemi. Yalnız public CV-lər; sadece görüntüleme.
 */
class CompanyResumeResource extends Resource
{
    protected static ?string $model = Resume::class;

    protected static ?string $navigationIcon = 'heroicon-o-identification';
    protected static ?string $navigationLabel = 'Aday CV Bazası';
    protected static ?string $modelLabel = 'CV';
    protected static ?string $pluralModelLabel = 'Aday CV-ləri';
    protected static ?int $navigationSort = 3;

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
        return parent::getEloquentQuery()->where('is_public', true);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('full_name')->label('Aday')->searchable()->weight('bold'),
                Tables\Columns\TextColumn::make('title')->label('Vəzifə / Başlıq')->searchable()->limit(35),
                Tables\Columns\TextColumn::make('summary')->label('Xülasə')->limit(60)->toggleable(),
                Tables\Columns\TextColumn::make('updated_at')->label('Yenilənmə')->dateTime('d.m.Y')->sortable(),
            ])
            ->defaultSort('updated_at', 'desc')
            ->actions([
                Tables\Actions\Action::make('view_public')
                    ->label('CV-ni Aç')
                    ->icon('heroicon-o-arrow-top-right-on-square')
                    ->url(fn (Resume $record): string => route('resumes.show', $record), shouldOpenInNewTab: true),
            ]);
    }

    public static function getPages(): array
    {
        return [
            'index' => \App\Modules\Resume\Filament\Resources\CompanyResumeResource\Pages\ListCompanyResumes::route('/'),
        ];
    }
}
