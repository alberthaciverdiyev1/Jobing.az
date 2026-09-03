<?php

namespace App\Modules\Application\Filament\Resources;

use App\Modules\Application\Filament\Resources\CompanyApplicationResource\Pages;
use App\Modules\Application\Models\Application;
use App\Modules\Company\Models\MessageTemplate;
use Filament\Facades\Filament;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;

/**
 * Company panelinin başvuru yönetimi.
 * Admin'in global ApplicationResource'undan ayrıdır:
 * şirket yalnız öz vakansiyalarının başvurularını görür, adayın
 * gönderdiği bilgileri düzenleyemez; yalnızca inceleyip durum günceller
 * ve adaya mesaj (şablon veya serbest) gönderir.
 */
class CompanyApplicationResource extends Resource
{
    protected static ?string $model = Application::class;

    protected static ?string $navigationIcon = 'heroicon-o-document-text';
    protected static ?string $navigationLabel = 'İş Başvuruları';
    protected static ?string $modelLabel = 'Başvuru';
    protected static ?string $pluralModelLabel = 'İş Başvuruları';
    protected static ?int $navigationSort = 2;

    public static function canViewAny(): bool
    {
        return true;
    }

    public static function canCreate(): bool
    {
        return false;
    }

    public static function canDelete(Model $record): bool
    {
        return false;
    }

    public static function getEloquentQuery(): Builder
    {
        $companyId = Auth::user()?->company_id;

        return parent::getEloquentQuery()
            ->whereHas('vacancy', fn (Builder $q) => $q->where('company_id', $companyId));
    }

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                // Aday bilgileri yalnızca inceleme içindir; düzenlenemez.
                Forms\Components\Section::make('Aday Bilgileri (yalnız inceleme)')
                    ->schema([
                        Forms\Components\TextInput::make('applicant_name')->label('Aday Adı Soyadı')->disabled(),
                        Forms\Components\TextInput::make('applicant_email')->label('E-Posta')->email()->disabled(),
                        Forms\Components\TextInput::make('applicant_phone')->label('Telefon')->tel()->disabled(),
                        Forms\Components\TextInput::make('portfolio_url')->label('Portfolyo / GitHub')->url()->disabled(),
                        Forms\Components\TextInput::make('linkedin_url')->label('LinkedIn')->url()->disabled(),
                        Forms\Components\FileUpload::make('resume_path')
                            ->label('CV / Özgeçmiş')
                            ->disabled()
                            ->disk('public')
                            ->directory('resumes')
                            ->openable()
                            ->downloadable()
                            ->columnSpanFull(),
                        Forms\Components\Textarea::make('cover_letter')->label('Ön Yazı / Not')->disabled()->rows(3)->columnSpanFull(),
                    ])->columns(2),

                Forms\Components\Section::make('İncele & Adaya Mesaj')
                    ->schema([
                        Forms\Components\Select::make('status')
                            ->label('Başvuru Durumu')
                            ->options(static::statusOptions())
                            ->required(),

                        Forms\Components\Select::make('template_pick')
                            ->label('Şablondan doldur (isteğe bağlı)')
                            ->placeholder('Şablon seçin — mesaj alanı dolar…')
                            ->options(fn () => MessageTemplate::active()
                                ->forCompany(Auth::user()?->company_id)
                                ->get()
                                ->sortBy(fn ($t) => (string) $t->title)
                                ->mapWithKeys(fn ($t) => [(string) $t->id => (string) $t->title])
                                ->all())
                            ->searchable()
                            ->live()
                            ->dehydrated(false)
                            ->afterStateUpdated(function (Forms\Get $get, Forms\Set $set): void {
                                $template = MessageTemplate::find($get('template_pick'));
                                if ($template) {
                                    $set('notes', $template->content ?: '');
                                }
                            }),

                        Forms\Components\Textarea::make('notes')
                            ->label('Mesaj / Adaya Cavab (başvuruda görünür)')
                            ->rows(4)
                            ->helperText('Bu mətn adayın "Başvurularım" səhifəsində görünür; daxili qeyd deyil.')
                            ->columnSpanFull(),
                    ])->columns(2),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('applicant_name')->label('Aday Adı')->searchable()->sortable()->weight('bold'),
                Tables\Columns\TextColumn::make('vacancy.title')->label('İlan')->searchable()->sortable()->limit(30),
                Tables\Columns\TextColumn::make('applicant_email')->label('E-Posta')->searchable()->copyable(),
                Tables\Columns\TextColumn::make('status')->label('Durum')->badge()
                    ->color(fn (string $state): string => static::statusColor($state)),
                Tables\Columns\TextColumn::make('resume_path')
                    ->label('CV')
                    ->formatStateUsing(fn ($state) => $state ? 'Görüntüle' : 'Yok')
                    ->url(fn (Application $record): ?string => $record->resume_path ? asset('storage/' . $record->resume_path) : null, shouldOpenInNewTab: true)
                    ->color('primary'),
                Tables\Columns\TextColumn::make('created_at')->label('Başvuru Tarihi')->dateTime('d.m.Y H:i')->sortable(),
            ])
            ->filters([
                Tables\Filters\SelectFilter::make('status')->label('Duruma Göre')->options(static::statusOptions()),
            ])
            ->defaultSort('created_at', 'desc')
            ->actions([

                Tables\Actions\EditAction::make()->label('İncele'),
            ]);
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListCompanyApplications::route('/'),
            'edit' => Pages\EditCompanyApplications::route('/{record}/edit'),
        ];
    }

    protected static function statusOptions(): array
    {
        return [
            'Beklemede' => 'Beklemede',
            'İncelendi' => 'İncelendi',
            'Mülakat' => 'Mülakata Çağrıldı',
            'Teklif' => 'Teklif Yapıldı',
            'Kabul' => 'İşe Alındı',
            'Red' => 'Reddedildi',
        ];
    }

    protected static function statusColor(string $state): string
    {
        return match ($state) {
            'Beklemede' => 'gray',
            'İncelendi' => 'info',
            'Mülakat' => 'warning',
            'Teklif', 'Kabul' => 'success',
            'Red' => 'danger',
            default => 'primary',
        };
    }
}
