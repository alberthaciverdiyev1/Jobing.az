<?php

namespace App\Modules\Company\Filament\Widgets;

use App\Modules\Company\Filament\Resources\CompanyResource;
use App\Modules\Company\Models\Company;
use Filament\Notifications\Notification;
use Filament\Tables;
use Filament\Tables\Table;
use Filament\Widgets\TableWidget as BaseWidget;

class PendingVerifications extends BaseWidget
{
    protected static ?string $heading = 'Doğrulama Gözləyən Şirkətlər';

    protected int|string|array $columnSpan = 'full';

    protected static ?int $sort = 2;

    public function table(Table $table): Table
    {
        return $table
            ->query(Company::query()->where('verification_requested', true)->where('is_verified', false))
            ->columns([
                Tables\Columns\TextColumn::make('name')
                    ->label(__('Company'))
                    ->weight('bold')
                    ->searchable(),

                Tables\Columns\TextColumn::make('email')
                    ->label(__('Email'))
                    ->copyable(),

                Tables\Columns\TextColumn::make('phone')
                    ->label(__('Phone'))
                    ->copyable(),

                Tables\Columns\TextColumn::make('updated_at')
                    ->label(__('Request Date'))
                    ->since(),
            ])
            ->actions([
                Tables\Actions\Action::make('verify')
                    ->label(__('Verify'))
                    ->icon('heroicon-m-check-badge')
                    ->color('success')
                    ->requiresConfirmation()
                    ->modalHeading(__('Verify Company'))
                    ->modalDescription(__('Do you confirm this company\'s verification request?'))
                    ->action(function (Company $record): void {
                        $record->update([
                            'is_verified' => true,
                            'verification_requested' => false,
                        ]);

                        Notification::make()
                            ->title(__('Company verified'))
                            ->success()
                            ->send();
                    }),

                Tables\Actions\Action::make('reject')
                    ->label(__('Reject'))
                    ->icon('heroicon-m-x-mark')
                    ->color('danger')
                    ->requiresConfirmation()
                    ->modalHeading(__('Reject request'))
                    ->action(function (Company $record): void {
                        $record->update(['verification_requested' => false]);

                        Notification::make()
                            ->title(__('Verification request rejected'))
                            ->send();
                    }),

                Tables\Actions\Action::make('open')
                    ->label(__('Open'))
                    ->icon('heroicon-m-arrow-top-right-on-square')
                    ->color('gray')
                    ->url(fn (Company $record): string => CompanyResource::getUrl('edit', ['record' => $record])),
            ])
            ->emptyStateHeading(__('No companies awaiting verification'))
            ->emptyStateIcon('heroicon-o-check-badge')
            ->paginated(false);
    }
}
