<?php

namespace App\Modules\Vacancy\Filament\Resources\VacancyResource\RelationManagers;

use Filament\Resources\RelationManagers\RelationManager;
use Filament\Tables;
use Filament\Tables\Table;

class ApplicationsRelationManager extends RelationManager
{
    protected static string $relationship = 'applications';

    protected static ?string $title = 'Başvurular';

    public function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('applicant_name')
                    ->label('Aday Adı')
                    ->searchable()
                    ->sortable()
                    ->weight('bold'),

                Tables\Columns\TextColumn::make('applicant_email')
                    ->label('E-Posta')
                    ->searchable()
                    ->copyable(),

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
                    ->dateTime('d.m.Y H:i')
                    ->sortable(),
            ])
            ->filters([
                Tables\Filters\SelectFilter::make('status')
                    ->options([
                        'Beklemede' => 'Beklemede',
                        'İncelendi' => 'İncelendi',
                        'Mülakat' => 'Mülakata Çağrıldı',
                        'Teklif' => 'Teklif Yapıldı',
                        'Kabul' => 'İşe Alındı',
                        'Red' => 'Reddedildi',
                    ])
                    ->label('Duruma Göre'),
            ])
            ->actions([
                Tables\Actions\EditAction::make()
                    ->url(fn ($record) => \App\Modules\Application\Filament\Resources\ApplicationResource::getUrl('edit', ['record' => $record])),
                Tables\Actions\DeleteAction::make(),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),
                ]),
            ]);
    }
}
