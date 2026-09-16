<?php

namespace App\Modules\Inquiry\Filament\Resources;

use App\Modules\Inquiry\Filament\Resources\InquiryResource\Pages;
use App\Modules\Inquiry\Models\Inquiry;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;

class InquiryResource extends Resource
{
    protected static ?string $model = Inquiry::class;

    protected static ?string $navigationIcon = 'heroicon-o-chat-bubble-left-right';
    protected static ?string $navigationGroup = 'Aday & Başvuru Yönetimi';
    protected static ?string $modelLabel = 'Müraciət / Lead';
    protected static ?string $pluralModelLabel = 'İletişim Müraciətləri';
    protected static ?int $navigationSort = 4;

    public static function getNavigationBadge(): ?string
    {
        $count = static::getModel()::where('status', 'new')->count();
        return $count > 0 ? (string) $count : null;
    }

    public static function getNavigationBadgeColor(): string|array|null
    {
        return 'danger';
    }

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Section::make('Lead Bilgileri')
                    ->schema([
                        Forms\Components\Select::make('user_id')
                            ->label('Kullanıcı')
                            ->relationship('user', 'name')
                            ->searchable()
                            ->preload()
                            ->nullable(),

                        Forms\Components\TextInput::make('name')
                            ->label('Ad Soyad')
                            ->required()
                            ->maxLength(255),

                        Forms\Components\TextInput::make('email')
                            ->label('E-Posta')
                            ->email()
                            ->maxLength(255),

                        Forms\Components\TextInput::make('phone')
                            ->label('Telefon')
                            ->tel()
                            ->maxLength(50),

                        Forms\Components\TextInput::make('subject')
                            ->label('Konu')
                            ->maxLength(255)
                            ->columnSpanFull(),

                        Forms\Components\Textarea::make('message')
                            ->label('Mesaj')
                            ->rows(4)
                            ->columnSpanFull(),
                    ])->columns(2),

                Forms\Components\Section::make('Değerlendirme')
                    ->schema([
                        Forms\Components\Select::make('type')
                            ->label('Tür')
                            ->options([
                                'contact' => 'Genel İletişim',
                                'company' => 'Şirket / İşveren',
                                'candidate' => 'Aday',
                                'bug_report' => 'Hata Bildirimi',
                                'other' => 'Diğer',
                            ])
                            ->required()
                            ->default('contact'),

                        Forms\Components\Select::make('status')
                            ->label('Durum')
                            ->options([
                                'new' => 'Yeni',
                                'contacted' => 'İletişime Geçildi',
                                'in_progress' => 'İşlemde',
                                'closed' => 'Kapatıldı',
                                'cancelled' => 'İptal',
                            ])
                            ->required()
                            ->default('new'),

                        Forms\Components\Textarea::make('notes')
                            ->label('Dahili Notlar')
                            ->rows(3)
                            ->columnSpanFull(),
                    ])->columns(2),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->defaultSort('id', 'desc')
            ->columns([
                Tables\Columns\TextColumn::make('name')
                    ->label('Ad Soyad')
                    ->searchable()
                    ->sortable()
                    ->weight('bold'),

                Tables\Columns\TextColumn::make('email')
                    ->label('E-Posta')
                    ->searchable()
                    ->copyable()
                    ->toggleable(),

                Tables\Columns\TextColumn::make('phone')
                    ->label('Telefon')
                    ->searchable()
                    ->toggleable(),

                Tables\Columns\TextColumn::make('subject')
                    ->label('Konu')
                    ->limit(30)
                    ->toggleable(),

                Tables\Columns\TextColumn::make('type')
                    ->label('Tür')
                    ->badge()
                    ->color('gray'),

                Tables\Columns\TextColumn::make('status')
                    ->label('Durum')
                    ->badge()
                    ->color(fn (string $state): string => match ($state) {
                        'new' => 'danger',
                        'contacted' => 'warning',
                        'in_progress' => 'info',
                        'closed' => 'success',
                        'cancelled' => 'gray',
                        default => 'primary',
                    }),

                Tables\Columns\TextColumn::make('created_at')
                    ->label('Tarih')
                    ->dateTime('d.m.Y H:i')
                    ->sortable(),
            ])
            ->filters([
                Tables\Filters\SelectFilter::make('status')
                    ->label('Duruma Göre')
                    ->options([
                        'new' => 'Yeni',
                        'contacted' => 'İletişime Geçildi',
                        'in_progress' => 'İşlemde',
                        'closed' => 'Kapatıldı',
                        'cancelled' => 'İptal',
                    ]),
                Tables\Filters\SelectFilter::make('type')
                    ->label('Türe Göre')
                    ->options([
                        'contact' => 'Genel İletişim',
                        'company' => 'Şirket / İşveren',
                        'candidate' => 'Aday',
                        'bug_report' => 'Hata Bildirimi',
                        'other' => 'Diğer',
                    ]),
            ])
            ->actions([
                Tables\Actions\EditAction::make(),
                Tables\Actions\DeleteAction::make(),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),
                ]),
            ]);
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListInquiries::route('/'),
            'create' => Pages\CreateInquiry::route('/create'),
            'edit' => Pages\EditInquiry::route('/{record}/edit'),
        ];
    }
}
