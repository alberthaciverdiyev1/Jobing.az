<?php

namespace App\Modules\Resume\Filament\Resources;

use App\Modules\Resume\Filament\Resources\ResumeResource\Pages;
use App\Modules\Resume\Models\Resume;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;

class ResumeResource extends Resource
{
    protected static ?string $model = Resume::class;

    protected static ?string $navigationIcon = 'heroicon-o-identification';
    protected static ?string $navigationLabel = 'CV & Rezümələrim';
    protected static ?string $modelLabel = 'CV / Rezüme';
    protected static ?string $pluralModelLabel = 'CV & Rezümələrim';
    protected static ?int $navigationSort = 3;

    /**
     * Admin panelinə özel, global CV yönetimi.
     * (User: MyResumeResource, Company: CompanyResumeResource.)
     */
    public static function canViewAny(): bool
    {
        return true;
    }

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Section::make('CV Başlığı və Əsas Ayarlar')
                    ->description('CV-nin adı və kimlər tərəfindən görünəcəyi')
                    ->schema([
                        Forms\Components\TextInput::make('title')
                            ->label('CV Başlığı')
                            ->placeholder('Örn: Senior Full Stack Developer CV')
                            ->required()
                            ->maxLength(255)
                            ->columnSpanFull(),

                        Forms\Components\Toggle::make('is_default')
                            ->label('Əsas (Default) CV kimi təyin et')
                            ->helperText('Müraciətlər zamanı avtomatik bu CV istifadə ediləcək')
                            ->default(false),

                        Forms\Components\Toggle::make('is_public')
                            ->label('Sadece daxili portalda görünsün')
                            ->helperText('Aktiv olduqda CV-niz yalnız daxili portalda şirkət (işəgötürən) hesablarına görünəcək. İctimai saytda görünməyəcək.')
                            ->default(true),
                    ])->columns(2),

                Forms\Components\Section::make('1. Şəxsi Məlumatlar & Əlaqə')
                    ->collapsible()
                    ->schema([
                        Forms\Components\FileUpload::make('photo')
                            ->label('Profil Fotoğrafı')
                            ->image()
                            ->avatar()
                            ->directory('resumes/photos')
                            ->columnSpanFull(),

                        Forms\Components\TextInput::make('first_name')->label('Ad')->required()->default(fn () => explode(' ', auth()->user()?->name ?? '')[0] ?? ''),
                        Forms\Components\TextInput::make('last_name')->label('Soyad')->required()->default(fn () => implode(' ', array_slice(explode(' ', auth()->user()?->name ?? ''), 1)) ?? ''),

                        Forms\Components\TextInput::make('phone')
                            ->label('Telefon')
                            ->tel()
                            ->prefixIcon('heroicon-o-phone')
                            ->placeholder('+994 50 123 45 67'),

                        Forms\Components\TextInput::make('whatsapp')
                            ->label('WhatsApp Nömrəsi')
                            ->tel()
                            ->prefixIcon('heroicon-o-chat-bubble-left-right')
                            ->placeholder('+994 50 123 45 67')
                            ->helperText('Şirkətlər sizinlə WhatsApp vasitəsilə birbaşa əlaqə saxlaya bilərlər'),

                        Forms\Components\TextInput::make('email')
                            ->label('E-poçt')
                            ->email()
                            ->prefixIcon('heroicon-o-envelope')
                            ->default(fn () => auth()->user()?->email),

                        Forms\Components\Select::make('location')
                            ->label('Şəhər / Lokasiya')
                            ->options(\App\Enums\CityEnum::options())
                            ->searchable()
                            ->default('Bakı'),
                        Forms\Components\TextInput::make('linkedin_url')->label('LinkedIn URL')->url()->placeholder('https://linkedin.com/in/...'),

                        Forms\Components\TextInput::make('github_url')->label('GitHub URL')->url()->placeholder('https://github.com/...'),
                        Forms\Components\TextInput::make('portfolio_url')->label('Portfolio / Web Sitem')->url()->placeholder('https://myportfolio.com'),
                    ])->columns(2),

                Forms\Components\Section::make('2. Profesyonel Özet')
                    ->collapsible()
                    ->schema([
                        Forms\Components\Textarea::make('summary')
                            ->label('Haqqınızda Qısa Xülasə (Summary)')
                            ->placeholder('Təcrübəniz, əsas bacarıqlarınız və hədəfləriniz haqqında 2-3 cümləlik qısa xülasə...')
                            ->rows(3)
                            ->columnSpanFull(),
                    ]),

                Forms\Components\Section::make('3. İş Təcrübəsi')
                    ->collapsible()
                    ->schema([
                        Forms\Components\ViewField::make('work_experiences')
                            ->view('filament.forms.components.custom-work-experiences')
                            ->columnSpanFull(),
                    ]),

                Forms\Components\Section::make('4. Təhsil Məlumatları')
                    ->collapsible()
                    ->schema([
                        Forms\Components\ViewField::make('education')
                            ->view('filament.forms.components.custom-education')
                            ->columnSpanFull(),
                    ]),

                Forms\Components\Section::make('5. Bacarıqlar & Dillər')
                    ->collapsible()
                    ->schema([
                        Forms\Components\Grid::make(2)->schema([
                            Forms\Components\ViewField::make('skills')
                                ->view('filament.forms.components.custom-skills')
                                ->viewData(['skillOptions' => \App\Modules\JobAttribute\Models\Skill::active()->get()]),

                            Forms\Components\ViewField::make('languages')
                                ->view('filament.forms.components.custom-languages'),
                        ]),
                    ]),

                Forms\Components\Section::make('6. Layihələr')
                    ->collapsible()
                    ->schema([
                        Forms\Components\ViewField::make('projects')
                            ->view('filament.forms.components.custom-projects')
                            ->columnSpanFull(),
                    ]),

                Forms\Components\Section::make('7. Sertifikatlar & Ödüllər')
                    ->collapsible()
                    ->schema([
                        Forms\Components\Grid::make(2)->schema([
                            Forms\Components\Grid::make(2)->schema([
                                Forms\Components\ViewField::make('certificates')
                                    ->view('filament.forms.components.custom-certificates'),

                                Forms\Components\ViewField::make('awards')
                                    ->view('filament.forms.components.custom-awards'),
                            ]),
                        ]),
                    ]),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\ImageColumn::make('photo')
                    ->label('Foto')
                    ->circular(),

                Tables\Columns\TextColumn::make('title')
                    ->label('CV Başlığı')
                    ->searchable()
                    ->sortable()
                    ->weight('bold'),

                Tables\Columns\TextColumn::make('full_name')
                    ->label('Ad Soyad')
                    ->searchable(['first_name', 'last_name']),

                Tables\Columns\TextColumn::make('email')
                    ->label('E-poçt')
                    ->searchable(),

                Tables\Columns\IconColumn::make('is_default')
                    ->label('Varsayılan')
                    ->boolean(),

                Tables\Columns\IconColumn::make('is_public')
                    ->label('Açıq')
                    ->boolean(),

                Tables\Columns\TextColumn::make('updated_at')
                    ->label('Yenilənmə')
                    ->dateTime('d.m.Y H:i')
                    ->sortable(),
            ])
            ->defaultSort('updated_at', 'desc')
            ->actions([
                Tables\Actions\Action::make('preview')
                    ->label('CV-yə Bax')
                    ->icon('heroicon-o-eye')
                    ->color('info')
                    ->url(fn (Resume $record): string => route('resumes.show', $record->id), shouldOpenInNewTab: true),

                Tables\Actions\Action::make('download')
                    ->label('PDF Endir')
                    ->icon('heroicon-o-arrow-down-tray')
                    ->color('success')
                    ->url(fn (Resume $record): string => route('resumes.show', ['resume' => $record->id, 'print' => 1]), shouldOpenInNewTab: true),

                Tables\Actions\EditAction::make()
                    ->hidden(fn () => \Filament\Facades\Filament::getCurrentPanel()?->getId() === 'company'),

                Tables\Actions\DeleteAction::make()
                    ->hidden(fn () => \Filament\Facades\Filament::getCurrentPanel()?->getId() === 'company'),
            ]);
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListResumes::route('/'),
            'create' => Pages\CreateResume::route('/create'),
            'edit' => Pages\EditResume::route('/{record}/edit'),
        ];
    }
}
