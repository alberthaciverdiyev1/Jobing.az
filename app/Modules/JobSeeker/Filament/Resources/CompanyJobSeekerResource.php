<?php

namespace App\Modules\JobSeeker\Filament\Resources;

use App\Modules\JobSeeker\Models\JobSeeker;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;

/**
 * Company paneli üçün aday "iş axtarıram" elanlarını gözlem. Yalnız oxu.
 */
class CompanyJobSeekerResource extends Resource
{
    protected static ?string $model = JobSeeker::class;

    protected static ?string $navigationIcon = 'heroicon-o-user-group';
    protected static ?string $navigationLabel = null;

    public static function getNavigationLabel(): string
    {
        return __('Job Seekers');
    }
    protected static ?string $modelLabel = null;

    public static function getModelLabel(): string
    {
        return __('Job Seeker Listing');
    }
    protected static ?string $pluralModelLabel = null;

    public static function getPluralModelLabel(): string
    {
        return __('Job Seekers');
    }
    protected static ?int $navigationSort = 4;

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
        return 'success';
    }

    public static function canCreate(): bool
    {
        return false;
    }

    public static function getEloquentQuery(): Builder
    {
        return parent::getEloquentQuery()->where('status', JobSeeker::STATUS_PUBLISHED);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('contact_name')->label(__('Candidate'))->searchable()->weight('bold'),
                Tables\Columns\TextColumn::make('title')->label(__('Listing / Position'))->searchable()->limit(40),
                Tables\Columns\TextColumn::make('location')->label(__('City'))->searchable()->placeholder('—'),
                Tables\Columns\TextColumn::make('position')->label(__('Occupation'))->searchable()->placeholder('—'),
                Tables\Columns\IconColumn::make('is_featured')->label(__('Premium'))->boolean(),
                Tables\Columns\TextColumn::make('created_at')->label(__('Date'))->dateTime('d.m.Y')->sortable(),
            ])
            ->defaultSort('updated_at', 'desc')
            ->actions([
                Tables\Actions\Action::make('view_public')
                    ->label(__('Open Listing'))
                    ->icon('heroicon-o-arrow-top-right-on-square')
                    ->url(fn (JobSeeker $record): string => route('job-seekers.show', $record->slug), shouldOpenInNewTab: true),
            ]);
    }

    public static function getPages(): array
    {
        return [
            'index' => \App\Modules\JobSeeker\Filament\Resources\CompanyJobSeekerResource\Pages\ListCompanyJobSeekers::route('/'),
        ];
    }
}
