<?php

namespace App\Modules\Setting\Filament\Pages;

use App\Modules\Setting\Models\SiteSetting;
use Filament\Forms\Components\Section;
use Filament\Forms\Components\Tabs;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Concerns\InteractsWithForms;
use Filament\Forms\Contracts\HasForms;
use Filament\Forms\Form;
use Filament\Notifications\Notification;
use Filament\Pages\Page;

class ManageSiteSettings extends Page implements HasForms
{
    use InteractsWithForms;

    protected static ?string $navigationIcon = 'heroicon-o-cog-6-tooth';
    protected static ?string $navigationLabel = 'Sayt Ayarları';
    protected static ?string $navigationGroup = 'Sistem';
    protected static ?string $title = 'Sayt Ayarları';
    protected static ?string $slug = 'site-settings';
    protected static string $view = 'filament.pages.manage-site-settings';
    protected static ?int $navigationSort = 90;

    public ?array $data = [];

    public function mount(): void
    {
        $this->form->fill(SiteSetting::current()->toArray());
    }

    public function form(Form $form): Form
    {
        return $form
            ->schema([
                Tabs::make('settings')
                    ->tabs([
                        Tabs\Tab::make('İletişim')
                            ->schema([
                                Section::make('İletişim Məlumatları')
                                    ->schema([
                                        TextInput::make('email')->label('E-Posta')->email(),
                                        TextInput::make('support_email')->label('Dəstək E-Postası')->email(),
                                        TextInput::make('phone')->label('Telefon'),
                                        TextInput::make('phone_secondary')->label('İkinci Telefon'),
                                        TextInput::make('whatsapp')->label('WhatsApp Nömrəsi'),
                                        TextInput::make('working_hours')->label('İş Saatları'),
                                        TextInput::make('address.az')->label('Ünvan (AZ)'),
                                        TextInput::make('address.tr')->label('Ünvan (TR)'),
                                        TextInput::make('address.en')->label('Ünvan (EN)'),
                                        TextInput::make('address.ru')->label('Ünvan (RU)'),
                                    ])->columns(2),
                            ]),
                        Tabs\Tab::make('Sosial')
                            ->schema([
                                Section::make('Sosial Linklər')
                                    ->schema([
                                        TextInput::make('facebook_url')->label('Facebook')->url(),
                                        TextInput::make('instagram_url')->label('Instagram')->url(),
                                        TextInput::make('linkedin_url')->label('LinkedIn')->url(),
                                        TextInput::make('telegram_url')->label('Telegram')->url(),
                                        TextInput::make('twitter_url')->label('Twitter / X')->url(),
                                        TextInput::make('youtube_url')->label('YouTube')->url(),
                                    ])->columns(2),
                            ]),
                        Tabs\Tab::make('İçerik')
                            ->schema([
                                Section::make('Tagline (Başlıq)')
                                    ->schema([
                                        TextInput::make('tagline.az')->label('Tagline (AZ)'),
                                        TextInput::make('tagline.tr')->label('Tagline (TR)'),
                                        TextInput::make('tagline.en')->label('Tagline (EN)'),
                                        TextInput::make('tagline.ru')->label('Tagline (RU)'),
                                    ])->columns(2),
                                Section::make('Footer Açıklaması')
                                    ->schema([
                                        Textarea::make('footer_description.az')->label('Footer (AZ)')->rows(2),
                                        Textarea::make('footer_description.tr')->label('Footer (TR)')->rows(2),
                                        Textarea::make('footer_description.en')->label('Footer (EN)')->rows(2),
                                        Textarea::make('footer_description.ru')->label('Footer (RU)')->rows(2),
                                    ])->columns(2),
                                TextInput::make('copyright_text')->label('Telif Metni (Copyright)')->columnSpanFull(),
                            ]),
                    ])->columnSpanFull(),
            ])
            ->statePath('data');
    }

    public function save(): void
    {
        $setting = SiteSetting::current();
        $setting->update($this->form->getState());

        Notification::make()
            ->title('Sayt ayarları yeniləndi')
            ->success()
            ->send();
    }
}
