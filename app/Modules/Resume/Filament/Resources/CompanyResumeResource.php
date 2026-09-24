<?php

namespace App\Modules\Resume\Filament\Resources;

use App\Modules\Resume\Models\Resume;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;


class CompanyResumeResource extends Resource
{
    protected static ?string $model = Resume::class;

    protected static ?string $navigationIcon = 'heroicon-o-identification';
    protected static ?string $navigationLabel = null;

    public static function getNavigationLabel(): string
    {
        return __('Candidate CV Database');
    }
    protected static ?string $modelLabel = null;

    public static function getModelLabel(): string
    {
        return __('CV');
    }
    protected static ?string $pluralModelLabel = null;

    public static function getPluralModelLabel(): string
    {
        return __('Candidate CVs');
    }
    protected static ?int $navigationSort = 3;

    public static function canViewAny(): bool
    {
        return true;
    }

    public static function getNavigationBadge(): ?string
    {
        $count = static::getEloquentQuery()->count();

        return $count > 0 ? (string) $count : null;
    }

    public static function getNavigationBadgeColor(): ?string
    {
        return 'info';
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
                Tables\Columns\TextColumn::make('full_name')->label(__('Candidate'))->searchable()->weight('bold'),
                Tables\Columns\TextColumn::make('title')->label(__('Position / Title'))->searchable()->limit(35),
                Tables\Columns\TextColumn::make('summary')->label(__('Summary'))->limit(60)->toggleable(),
                Tables\Columns\TextColumn::make('updated_at')->label(__('Update'))->dateTime('d.m.Y')->sortable(),
            ])
            ->defaultSort('updated_at', 'desc')
            ->actions([
                Tables\Actions\Action::make('view_public')
                    ->label(__('Open CV'))
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
