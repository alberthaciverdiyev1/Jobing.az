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
                            })
                            ->formatStateUsing(fn (string $state): string => match ($state) {
                                'Beklemede' => 'Gözləmədə',
                                'İncelendi' => 'Baxılıb',
                                'Mülakat' => 'Müsahibəyə çağrıldı',
                                'Teklif' => 'Təklif göndərildi',
                                'Kabul' => 'Qəbul edildi',
                                'Red' => 'Rədd edildi',
                                default => $state,
                            }),
                        TextEntry::make('created_at')
                            ->label('Müraciət Tarixi')
                            ->dateTime('d.m.Y H:i'),
                        TextEntry::make('viewed_at')
                            ->label('Şirkət Baxışı')
                            ->dateTime('d.m.Y H:i')
                            ->placeholder(__('Şirkət hələ baxmayıb')),
                        TextEntry::make('updated_at')
                            ->label('Son Yenilənmə')
                            ->dateTime('d.m.Y H:i')
                            ->placeholder('—'),
                        TextEntry::make('notes')
                            ->label('Şirkətin Cavabı')
                            ->placeholder(__('Şirkət hələ cavab yazmayıb'))
                            ->html()
                            ->formatStateUsing(function (?string $state, ?Application $record): string {
                                if (! $state) {
                                    return '';
                                }

                                $escaped = nl2br(htmlspecialchars($state, ENT_QUOTES, 'UTF-8'));
                                $replyDate = $record?->updated_at?->format('d.m.Y H:i');

                                $footer = $replyDate
                                    ? '<div style="font-size:10px;color:#9ca3af;margin-top:10px;border-top:1px dashed #e5e7eb;padding-top:8px;">' .
                                      __('Cavab tarixi:') . ' ' . $replyDate . '</div>'
                                    : '';

                                return '<div style="background:#f9fafb;border:1px solid #e5e7eb;border-left:4px solid #10b981;border-radius:10px;padding:16px;">' .
                                    '<div style="font-size:11px;font-weight:700;color:#059669;text-transform:uppercase;letter-spacing:.06em;margin-bottom:8px;">' .
                                    __('Şirkətin Cavabı') . '</div>' .
                                    '<div style="font-size:13px;line-height:1.7;color:#111827;white-space:normal;">' . $escaped . '</div>' .
                                    $footer .
                                    '</div>';
                            })
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
