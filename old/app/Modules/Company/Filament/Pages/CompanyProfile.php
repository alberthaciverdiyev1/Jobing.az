<?php

namespace App\Modules\Company\Filament\Pages;

use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Section;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Tabs;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Concerns\InteractsWithForms;
use Filament\Forms\Contracts\HasForms;
use Filament\Forms\Form;
use Filament\Notifications\Notification;
use Filament\Pages\Page;
use Illuminate\Support\Facades\Auth;

class CompanyProfile extends Page implements HasForms
{
    use InteractsWithForms;

    protected static ?string $navigationIcon = 'heroicon-o-building-office-2';
    protected static ?string $navigationLabel = 'Şirkət Profili';
    protected static ?string $title = 'Şirkət Profili';
    protected static ?string $slug = 'info';
    protected static string $view = 'filament.pages.company-profile';

    public ?array $data = [];

    public function mount(): void
    {
        $company = Auth::user()->company;
        $this->form->fill($company?->toArray() ?? []);
    }

    public function form(Form $form): Form
    {
        return $form
            ->schema([
                Section::make('Şirkət Məlumatları')
                    ->schema([
                        FileUpload::make('logo')
                            ->label('Loqo')
                            ->image()
                            ->directory('company-logos')
                            ->avatar(),
                        FileUpload::make('banner')
                            ->label('Qapaq / Banner Şəkli')
                            ->image()
                            ->directory('company-banners')
                            ->imageEditor(),
                        TextInput::make('name')->label('Şirkət Adı')->required(),
                        TextInput::make('email')->label('E-Posta')->email()->required(),
                        TextInput::make('website')->label('Veb Sayt')->url(),
                        TextInput::make('phone')->label('Telefon'),
                        Select::make('city_id')
                            ->label('Şəhər / Lokasiya')
                            ->options(fn () => \App\Modules\JobAttribute\Models\City::all()->pluck('name', 'id'))
                            ->searchable()
                            ->preload()
                            ->required(),
                        Tabs::make('AboutTranslations')
                            ->tabs([
                                Tabs\Tab::make('🇦🇿 Azərbaycan')
                                    ->schema([
                                        Textarea::make('about.az')
                                            ->label('Şirkət Hakkında (AZ)')
                                            ->rows(4),
                                    ]),
                                Tabs\Tab::make('🇬🇧 English')
                                    ->schema([
                                        Textarea::make('about.en')
                                            ->label('About Company (EN)')
                                            ->rows(4),
                                    ]),
                                Tabs\Tab::make('🇹🇷 Türkçe')
                                    ->schema([
                                        Textarea::make('about.tr')
                                            ->label('Şirket Hakkında (TR)')
                                            ->rows(4),
                                    ]),
                                Tabs\Tab::make('🇷🇺 Русский')
                                    ->schema([
                                        Textarea::make('about.ru')
                                            ->label('О Компании (RU)')
                                            ->rows(4),
                                    ]),
                            ])
                            ->columnSpanFull(),
                    ])
                    ->columns(2),
            ])
            ->statePath('data');
    }

    public function save(): void
    {
        $company = Auth::user()->company;
        if (!$company) {
            Notification::make()->title('Şirkət profili tapılmadı')->danger()->send();
            return;
        }

        $company->update($this->form->getState());

        Notification::make()
            ->title('Şirkət məlumatları yeniləndi')
            ->success()
            ->send();
    }

    public function requestVerification(): void
    {
        $company = Auth::user()->company;
        if (!$company) {
            Notification::make()->title('Şirkət profili tapılmadı')->danger()->send();
            return;
        }

        if ($company->is_verified) {
            Notification::make()->title('Şirkətiniz artıq təsdiqlənib')->success()->send();
            return;
        }

        $company->update(['verification_requested' => true]);

        Notification::make()
            ->title('Doğrulama sorğusu göndərildi')
            ->body('Admin məlumatları nəzərdən keçirdikdən sonra təsdiqləyəcək.')
            ->success()
            ->send();
    }
}
