<?php

namespace App\Modules\Application\Filament\Resources;

use App\Modules\Application\Filament\Resources\MyApplicationsResource\Pages;
use App\Modules\Application\Models\Application;
use Filament\Infolists\Components\Section;
use Filament\Infolists\Components\TextEntry;
use Filament\Infolists\Infolist;
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

    public static function infolist(Infolist $infolist): Infolist
    {
        return $infolist
            ->schema([
                Section::make('Vakansiya Detalları')
                    ->description(__('Müraciət etdiyiniz vakansiya haqqında məlumat.'))
                    ->schema([
                        TextEntry::make('vacancy.company.name')
                            ->label('Şirkət')
                            ->icon('heroicon-o-building-office-2'),
                        TextEntry::make('vacancy.title')
                            ->label('Pozisyon')
                            ->weight('bold')
                            ->color('primary')
                            ->url(fn (Application $record): ?string => $record->vacancy
                                ? route('jobs.show', $record->vacancy->slug)
                                : null),
                        TextEntry::make('vacancy.workplace_type_name')
                            ->label('İş Yeri')
                            ->placeholder('—'),
                        TextEntry::make('vacancy.job_type_name')
                            ->label('İş Rejimi')
                            ->placeholder('—'),
                        TextEntry::make('vacancy.experience_level_name')
                            ->label('Təcrübə')
                            ->placeholder('—'),
                        TextEntry::make('vacancy.city_name')
                            ->label('Şəhər')
                            ->icon('heroicon-o-map-pin')
                            ->placeholder('—'),
                        TextEntry::make('vacancy.formatted_salary')
                            ->label('Maaş')
                            ->badge()
                            ->color('success'),
                        TextEntry::make('vacancy.deadline')
                            ->label('Son Müraciət Tarixi')
                            ->date('d.m.Y')
                            ->placeholder('—'),
                    ])->columns(2),

                Section::make('Müraciətim')
                    ->description(__('Müraciətinizin vəziyyəti və şirkətin cavabı.'))
                    ->schema([
                        TextEntry::make('status')
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
                        TextEntry::make('created_at')
                            ->label('Müraciət Tarixi')
                            ->dateTime('d.m.Y H:i'),
                        TextEntry::make('viewed_at')
                            ->label('Şirkət Baxışı')
                            ->dateTime('d.m.Y H:i')
                            ->placeholder(__('Şirkət hələ baxmayıb')),
                        TextEntry::make('notes')
                            ->label('Şirkətin Cavabı')
                            ->placeholder(__('Şirkət hələ cavab yazmayıb'))
                            ->markdown()
                            ->columnSpanFull(),
                    ])->columns(3),
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
