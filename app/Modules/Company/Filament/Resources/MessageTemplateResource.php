<?php

namespace App\Modules\Company\Filament\Resources;

use App\Modules\Company\Filament\Resources\MessageTemplateResource\Pages;
use App\Modules\Company\Models\MessageTemplate;
use Filament\Facades\Filament;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\Auth;

class MessageTemplateResource extends Resource
{
    protected static ?string $model = MessageTemplate::class;

    protected static ?string $navigationIcon = 'heroicon-o-chat-bubble-bottom-center-text';
    protected static ?string $navigationGroup = 'Şirkət Ayarları';
    protected static ?string $modelLabel = 'Mesaj Şablonu';
    protected static ?string $pluralModelLabel = 'Mesaj Şablonları';
    protected static ?int $navigationSort = 3;

    public static function getEloquentQuery(): Builder
    {
        $query = parent::getEloquentQuery();

        if (Filament::getCurrentPanel()?->getId() === 'company') {
            $companyId = Auth::user()?->company_id;
            $query->where(function ($q) use ($companyId) {
                $q->whereNull('company_id');
                if ($companyId) {
                    $q->orWhere('company_id', $companyId);
                }
            });
        }

        return $query;
    }

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Section::make('Şablon Məlumatları')
                    ->description('Bütün namizədlərə göndəriləcək mesaj şablonunu 4 dildə tənzimləyin. Dinamik dəyişənlər: {applicant_name}, {vacancy_title}, {company_name}')
                    ->schema([
                        Forms\Components\Select::make('type')
                            ->label('Şablon Növü')
                            ->options([
                                'rejected' => 'İmtina Məktubu (Reject)',
                                'interview' => 'Müsahibə Dəvəti (Interview)',
                                'accepted' => 'İş Təklifi (Job Offer / Accept)',
                                'custom' => 'Xüsusi Şablon (Custom)',
                            ])
                            ->required()
                            ->default('custom'),

                        Forms\Components\Toggle::make('is_active')
                            ->label('Aktiv')
                            ->default(true),

                        Forms\Components\Tabs::make('Translations')
                            ->tabs([
                                Forms\Components\Tabs\Tab::make('🇦🇿 Azərbaycan')
                                    ->schema([
                                        Forms\Components\TextInput::make('title.az')
                                            ->label('Şablon Başlığı (AZ)')
                                            ->required()
                                            ->maxLength(255),
                                        Forms\Components\Textarea::make('content.az')
                                            ->label('Mesaj Mətni (AZ)')
                                            ->required()
                                            ->rows(6),
                                    ]),

                                Forms\Components\Tabs\Tab::make('🇬🇧 English')
                                    ->schema([
                                        Forms\Components\TextInput::make('title.en')
                                            ->label('Template Title (EN)')
                                            ->maxLength(255),
                                        Forms\Components\Textarea::make('content.en')
                                            ->label('Message Content (EN)')
                                            ->rows(6),
                                    ]),

                                Forms\Components\Tabs\Tab::make('🇹🇷 Türkçe')
                                    ->schema([
                                        Forms\Components\TextInput::make('title.tr')
                                            ->label('Şablon Başlığı (TR)')
                                            ->maxLength(255),
                                        Forms\Components\Textarea::make('content.tr')
                                            ->label('Mesaj İçeriği (TR)')
                                            ->rows(6),
                                    ]),

                                Forms\Components\Tabs\Tab::make('🇷🇺 Русский')
                                    ->schema([
                                        Forms\Components\TextInput::make('title.ru')
                                            ->label('Заголовок шаблона (RU)')
                                            ->maxLength(255),
                                        Forms\Components\Textarea::make('content.ru')
                                            ->label('Текст сообщения (RU)')
                                            ->rows(6),
                                    ]),
                            ])
                            ->columnSpanFull(),
                    ])->columns(2),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('title')
                    ->label('Şablon Başlığı')
                    ->formatStateUsing(fn ($state) => is_array($state) ? ($state['az'] ?? reset($state)) : (string) $state)
                    ->searchable()
                    ->sortable()
                    ->weight('bold'),

                Tables\Columns\TextColumn::make('type')
                    ->label('Növü')
                    ->badge()
                    ->color(fn (string $state): string => match ($state) {
                        'rejected' => 'danger',
                        'interview' => 'warning',
                        'accepted' => 'success',
                        default => 'info',
                    })
                    ->formatStateUsing(fn (string $state): string => match ($state) {
                        'rejected' => 'İmtina',
                        'interview' => 'Müsahibə',
                        'accepted' => 'İş Təklifi',
                        default => 'Xüsusi',
                    }),

                Tables\Columns\TextColumn::make('company_id')
                    ->label('Mənşəyi')
                    ->formatStateUsing(fn ($state) => $state ? 'Şirkətinizə Özəl' : 'Sistem Standartı')
                    ->badge()
                    ->color(fn ($state) => $state ? 'primary' : 'gray'),

                Tables\Columns\IconColumn::make('is_active')
                    ->label('Status')
                    ->boolean(),

                Tables\Columns\TextColumn::make('created_at')
                    ->label('Yaradılma Tarixi')
                    ->dateTime('d.m.Y H:i')
                    ->sortable(),
            ])
            ->filters([
                Tables\Filters\SelectFilter::make('type')
                    ->options([
                        'rejected' => 'İmtina Məktubu',
                        'interview' => 'Müsahibə Dəvəti',
                        'accepted' => 'İş Təklifi',
                        'custom' => 'Xüsusi',
                    ])
                    ->label('Növə Göre'),
            ])
            ->actions([
                Tables\Actions\EditAction::make(),
                Tables\Actions\DeleteAction::make()
                    ->visible(fn (MessageTemplate $record) => !is_null($record->company_id)),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),
                ]),
            ]);
    }

    public static function getRelations(): array
    {
        return [];
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListMessageTemplates::route('/'),
            'create' => Pages\CreateMessageTemplate::route('/create'),
            'edit' => Pages\EditMessageTemplate::route('/{record}/edit'),
        ];
    }
}
