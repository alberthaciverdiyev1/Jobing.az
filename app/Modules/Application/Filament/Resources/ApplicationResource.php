<?php

namespace App\Modules\Application\Filament\Resources;

use App\Modules\Application\Filament\Resources\ApplicationResource\Pages;
use App\Modules\Application\Models\Application;
use Filament\Facades\Filament;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\Auth;

class ApplicationResource extends Resource
{
    protected static ?string $model = Application::class;

    protected static ?string $navigationIcon = 'heroicon-o-document-text';
    protected static ?string $navigationGroup = 'Aday & Başvuru Yönetimi';
    protected static ?string $modelLabel = 'Başvuru';
    protected static ?string $pluralModelLabel = 'İş Başvuruları';
    protected static ?int $navigationSort = 1;

    public static function getEloquentQuery(): Builder
    {
        $query = parent::getEloquentQuery();

        switch (Filament::getCurrentPanel()?->getId()) {
            case 'company':
                // Companies only see applications to their own vacancies.
                $companyId = Auth::user()?->company_id;
                $query->whereHas('vacancy', fn ($q) => $q->where('company_id', $companyId));
                break;
            case 'user':
                // Users only see their own applications.
                $query->where('user_id', Auth::id());
                break;
        }

        return $query;
    }

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Section::make('Aday Bilgileri')
                    ->schema([
                        Forms\Components\Select::make('vacancy_id')
                            ->label('Başvurulan İlan')
                            ->relationship('vacancy', 'title', function (Builder $query): Builder {
                                if (Filament::getCurrentPanel()?->getId() === 'company') {
                                    $query->where('company_id', Auth::user()?->company_id);
                                }
                                return $query;
                            })
                            ->searchable()
                            ->preload()
                            ->required(),

                        Forms\Components\TextInput::make('applicant_name')
                            ->label('Aday Adı Soyadı')
                            ->required()
                            ->maxLength(255),

                        Forms\Components\TextInput::make('applicant_email')
                            ->label('E-Posta Adresi')
                            ->email()
                            ->required()
                            ->maxLength(255),

                        Forms\Components\TextInput::make('applicant_phone')
                            ->label('Telefon')
                            ->tel()
                            ->maxLength(255),

                        Forms\Components\TextInput::make('portfolio_url')
                            ->label('Portfolyo / GitHub URL')
                            ->url()
                            ->maxLength(255),

                        Forms\Components\TextInput::make('linkedin_url')
                            ->label('LinkedIn Profili')
                            ->url()
                            ->maxLength(255),

                        Forms\Components\FileUpload::make('resume_path')
                            ->label('CV / Özgeçmiş Dosyası')
                            ->disk('public')
                            ->directory('resumes')
                            ->acceptedFileTypes(['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'])
                            ->maxSize(5120)
                            ->openable()
                            ->downloadable()
                            ->columnSpanFull(),

                        Forms\Components\Textarea::make('cover_letter')
                            ->label('Ön Yazı / Not')
                            ->rows(3)
                            ->columnSpanFull(),
                    ])->columns(2),

                Forms\Components\Section::make('Değerlendirme & Durum')
                    ->schema([
                        Forms\Components\Select::make('status')
                            ->label('Başvuru Durumu')
                            ->options([
                                'Beklemede' => 'Beklemede',
                                'İncelendi' => 'İncelendi',
                                'Mülakat' => 'Mülakata Çağrıldı',
                                'Teklif' => 'Teklif Yapıldı',
                                'Kabul' => 'İşe Alındı',
                                'Red' => 'Reddedildi',
                            ])
                            ->required()
                            ->default('Beklemede'),

                        Forms\Components\Textarea::make('notes')
                            ->label('İK Dahili Notları')
                            ->rows(3)
                            ->columnSpanFull(),
                    ]),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('applicant_name')
                    ->label('Aday Adı')
                    ->searchable()
                    ->sortable()
                    ->weight('bold'),

                Tables\Columns\TextColumn::make('vacancy.title')
                    ->label('İlan')
                    ->searchable()
                    ->sortable()
                    ->limit(30),

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

                Tables\Columns\TextColumn::make('resume_path')
                    ->label('CV')
                    ->formatStateUsing(fn ($state) => $state ? 'İndir / Görüntüle' : 'Yok')
                    ->url(fn (Application $record): ?string => $record->resume_path ? asset('storage/' . $record->resume_path) : null, shouldOpenInNewTab: true)
                    ->icon(fn ($state) => $state ? 'heroicon-o-arrow-down-tray' : null)
                    ->color('primary'),

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
                Tables\Actions\EditAction::make(),
                Tables\Actions\DeleteAction::make(),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),
                ]),
            ]);
    }

    public static function getRelations(): array
    {
        return [
            //
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListApplications::route('/'),
            'create' => Pages\CreateApplication::route('/create'),
            'edit' => Pages\EditApplication::route('/{record}/edit'),
        ];
    }
}
