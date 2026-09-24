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
    protected static ?string $navigationLabel = null;

    public static function getNavigationLabel(): string
    {
        return __('My Applications');
    }
    protected static ?string $modelLabel = null;

    public static function getModelLabel(): string
    {
        return __('My Application');
    }
    protected static ?string $pluralModelLabel = null;

    public static function getPluralModelLabel(): string
    {
        return __('My Applications');
    }
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
        $query = parent::getEloquentQuery()
            ->where('user_id', auth()->id());

        $query->orderByRaw("
            CASE WHEN notes IS NOT NULL AND TRIM(notes) <> '' THEN 0 ELSE 1 END ASC,
            CASE WHEN notes IS NOT NULL AND TRIM(notes) <> '' THEN COALESCE(updated_at, created_at) ELSE created_at END DESC
        ");

        return $query;
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('vacancy.title')
                    ->label(__('Position'))
                    ->searchable()
                    ->sortable()
                    ->weight('bold')
                    ->limit(40),

                Tables\Columns\TextColumn::make('vacancy.company.name')
                    ->label(__('Company'))
                    ->searchable(),

                Tables\Columns\TextColumn::make('status')
                    ->label(__('Status'))
                    ->badge()
                    ->color(fn (string $state): string => match ($state) {
                        'Beklemede' => 'gray',
                        'İncelendi' => 'info',
                        'Mülakat' => 'warning',
                        'Teklif', 'Kabul' => 'success',
                        'Red' => 'danger',
                        default => 'primary',
                    }),

                Tables\Columns\TextColumn::make('reply_marker')
                    ->label(__('Answer'))
                    ->state(fn (Application $record): string => $record->hasUnseenReply()
                        ? __('New message')
                        : '—')
                    ->badge()
                    ->color(fn (string $state): string => $state === '—' ? 'gray' : 'success')
                    ->icon(fn (string $state) => $state === '—' ? null : 'heroicon-o-chat-bubble-left-right'),

                Tables\Columns\TextColumn::make('created_at')
                    ->label(__('Application Date'))
                    ->dateTime('d.m.Y')
                    ->sortable(),
            ])
            ->actions([
                Tables\Actions\ViewAction::make()
                    ->mountUsing(function (Application $record): void {
                        if ($record->user_id === auth()->id() && $record->hasUnseenReply()) {
                            $record->update(['reply_seen_at' => now()]);
                        }
                    }),
            ]);
    }

    public static function infolist(Infolist $infolist): Infolist
    {
        return $infolist
            ->schema([
                Section::make(__('Vacancy Details'))
                    ->description(__('Information about the vacancy you applied to.'))
                    ->schema([
                        TextEntry::make('vacancy.company.name')
                            ->label(__('Company'))
                            ->icon('heroicon-o-building-office-2'),
                        TextEntry::make('vacancy.title')
                            ->label(__('Position'))
                            ->weight('bold')
                            ->color('primary')
                            ->url(fn (Application $record): ?string => $record->vacancy
                                ? route('jobs.show', $record->vacancy->slug)
                                : null),
                        TextEntry::make('vacancy.workplace_type_name')
                            ->label(__('Workplace'))
                            ->placeholder('—'),
                        TextEntry::make('vacancy.job_type_name')
                            ->label(__('Job Type'))
                            ->placeholder('—'),
                        TextEntry::make('vacancy.experience_level_name')
                            ->label(__('Experience'))
                            ->placeholder('—'),
                        TextEntry::make('vacancy.city_name')
                            ->label(__('City'))
                            ->icon('heroicon-o-map-pin')
                            ->placeholder('—'),
                        TextEntry::make('vacancy.formatted_salary')
                            ->label(__('Salary'))
                            ->badge()
                            ->color('success'),
                        TextEntry::make('vacancy.deadline')
                            ->label(__('Last Application Date'))
                            ->date('d.m.Y')
                            ->placeholder('—'),
                    ])->columns(2),

                Section::make(__('My Application'))
                    ->description(__("The status of your application and the company's reply."))
                    ->schema([
                        TextEntry::make('status')
                            ->label(__('Status'))
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
                                'Beklemede' => __('Pending'),
                                'İncelendi' => __('Viewed'),
                                'Mülakat' => __('Invited to Interview'),
                                'Teklif' => __('Offer Sent'),
                                'Kabul' => __('Accepted'),
                                'Red' => __('Rejected'),
                                default => $state,
                            }),
                        TextEntry::make('created_at')
                            ->label(__('Application Date'))
                            ->dateTime('d.m.Y H:i'),
                        TextEntry::make('viewed_at')
                            ->label(__('Company Views'))
                            ->dateTime('d.m.Y H:i')
                            ->placeholder(__('The company has not viewed it yet')),
                        TextEntry::make('updated_at')
                            ->label(__('Last Updated'))
                            ->dateTime('d.m.Y H:i')
                            ->placeholder('—'),
                        TextEntry::make('notes')
                            ->label(__('Company Reply'))
                            ->placeholder(__('The company has not replied yet'))
                            ->html()
                            ->formatStateUsing(function (?string $state, ?Application $record): string {
                                if (! $state) {
                                    return '';
                                }

                                $escaped = nl2br(htmlspecialchars($state, ENT_QUOTES, 'UTF-8'));
                                $replyDate = $record?->updated_at?->format('d.m.Y H:i');

                                $footer = $replyDate
                                    ? '<div style="font-size:10px;color:#9ca3af;margin-top:10px;border-top:1px dashed #e5e7eb;padding-top:8px;">' .
                                      __('Reply date:') . ' ' . $replyDate . '</div>'
                                    : '';

                                return '<div style="background:#f9fafb;border:1px solid #e5e7eb;border-left:4px solid #10b981;border-radius:10px;padding:16px;">' .
                                    '<div style="font-size:11px;font-weight:700;color:#059669;text-transform:uppercase;letter-spacing:.06em;margin-bottom:8px;">' .
                                    __("Company's Reply") . '</div>' .
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
