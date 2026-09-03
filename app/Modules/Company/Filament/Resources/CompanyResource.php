<?php

namespace App\Modules\Company\Filament\Resources;

use App\Modules\Company\Filament\Resources\CompanyResource\Pages;
use App\Modules\Company\Models\Company;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;

class CompanyResource extends Resource
{
    protected static ?string $model = Company::class;

    protected static ?string $navigationIcon = 'heroicon-o-building-office-2';
    protected static ?string $navigationGroup = 'İlan & Şirket Yönetimi';
    protected static ?string $modelLabel = 'Şirket';
    protected static ?string $pluralModelLabel = 'Şirketler';
    protected static ?int $navigationSort = 2;

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Section::make('Şirkət Məlumatları')
                    ->schema([
                        Forms\Components\TextInput::make('name')
                            ->label('Şirkət Adı')
                            ->required()
                            ->maxLength(255)
                            ->live(onBlur: true)
                            ->afterStateUpdated(fn (string $operation, $state, Forms\Set $set) => $operation === 'create' ? $set('slug', \Illuminate\Support\Str::slug($state)) : null),

                        Forms\Components\TextInput::make('slug')
                            ->label('Slug / URL')
                            ->required()
                            ->unique(Company::class, 'slug', ignoreRecord: true)
                            ->maxLength(255),

                        Forms\Components\TextInput::make('email')
                            ->label('E-Posta Adresi')
                            ->email()
                            ->required()
                            ->maxLength(255),

                        Forms\Components\TextInput::make('phone')
                            ->label('Telefon Numarası')
                            ->tel()
                            ->maxLength(255),

                        Forms\Components\TextInput::make('website')
                            ->label('Web Sitesi URL')
                            ->url()
                            ->placeholder('https://...')
                            ->maxLength(255),

                        Forms\Components\Select::make('city_id')
                            ->label('Şəhər / Lokasiya')
                            ->options(fn () => \App\Modules\JobAttribute\Models\City::all()->pluck('name', 'id'))
                            ->searchable()
                            ->preload()
                            ->required(),

                        Forms\Components\FileUpload::make('logo')
                            ->label('Şirkət Logosu')
                            ->image()
                            ->directory('company-logos')
                            ->imageEditor(),

                        Forms\Components\FileUpload::make('banner')
                            ->label('Şirkət Banner / Kapak Görseli')
                            ->image()
                            ->directory('company-banners')
                            ->imageEditor(),

                        Forms\Components\Tabs::make('AboutTranslations')
                            ->tabs([
                                Forms\Components\Tabs\Tab::make('🇦🇿 Azərbaycan')
                                    ->schema([
                                        Forms\Components\Textarea::make('about.az')
                                            ->label('Şirkət Hakkında (AZ)')
                                            ->rows(4),
                                    ]),
                                Forms\Components\Tabs\Tab::make('🇬🇧 English')
                                    ->schema([
                                        Forms\Components\Textarea::make('about.en')
                                            ->label('About Company (EN)')
                                            ->rows(4),
                                    ]),
                                Forms\Components\Tabs\Tab::make('🇹🇷 Türkçe')
                                    ->schema([
                                        Forms\Components\Textarea::make('about.tr')
                                            ->label('Şirket Hakkında (TR)')
                                            ->rows(4),
                                    ]),
                                Forms\Components\Tabs\Tab::make('🇷🇺 Русский')
                                    ->schema([
                                        Forms\Components\Textarea::make('about.ru')
                                            ->label('О Компании (RU)')
                                            ->rows(4),
                                    ]),
                            ])
                            ->columnSpanFull(),

                        Forms\Components\Toggle::make('is_verified')
                            ->label('Onaylı Şirket (Verified Badge)')
                            ->default(true),
                    ])->columns(2),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\ImageColumn::make('logo')
                    ->label('Logo')
                    ->circular()
                    ->defaultImageUrl('https://img.icons8.com/isometric-line/64/4a90e2/briefcase.png'),

                Tables\Columns\TextColumn::make('name')
                    ->label('Şirket Adı')
                    ->searchable()
                    ->sortable()
                    ->weight('bold'),

                Tables\Columns\TextColumn::make('email')
                    ->label('E-Posta')
                    ->searchable()
                    ->copyable(),

                Tables\Columns\TextColumn::make('city.name')
                    ->label('Şəhər')
                    ->sortable(),

                Tables\Columns\TextColumn::make('vacancies_count')
                    ->label('İlan Sayısı')
                    ->counts('vacancies')
                    ->badge()
                    ->color('primary')
                    ->sortable(),

                Tables\Columns\IconColumn::make('is_verified')
                    ->label('Onaylı')
                    ->boolean()
                    ->sortable(),

                Tables\Columns\IconColumn::make('verification_requested')
                    ->label('Doğrulama İstəyi')
                    ->trueIcon('heroicon-o-hand-raised')
                    ->falseIcon('heroicon-o-minus')
                    ->trueColor('warning')
                    ->falseColor('gray')
                    ->sortable()
                    ->tooltip('Şirkət doğrulama istəmişdir'),

                Tables\Columns\TextColumn::make('created_at')
                    ->label('Kayıt Tarihi')
                    ->dateTime('d.m.Y')
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                Tables\Filters\TernaryFilter::make('is_verified')
                    ->label('Onay Durumu'),
                Tables\Filters\TernaryFilter::make('verification_requested')
                    ->label('Doğrulama İsteği Olanlar'),
            ])
            ->actions([
                Tables\Actions\Action::make('verify')
                    ->label('Doğrula')
                    ->icon('heroicon-m-check-badge')
                    ->color('success')
                    ->requiresConfirmation()
                    ->modalHeading('Şirketi doğrula')
                    ->modalDescription('Bu şirket doğrulama istedi. Onaylıyor musunuz?')
                    ->visible(fn (Company $record): bool => $record->verification_requested && !$record->is_verified)
                    ->action(fn (Company $record) => $record->update([
                        'is_verified' => true,
                        'verification_requested' => false,
                    ])),
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
            'index' => Pages\ListCompanies::route('/'),
            'create' => Pages\CreateCompany::route('/create'),
            'edit' => Pages\EditCompany::route('/{record}/edit'),
        ];
    }
}
