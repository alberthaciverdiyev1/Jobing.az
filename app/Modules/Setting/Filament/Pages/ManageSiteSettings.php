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
    protected static ?string $navigationLabel = null;

    public static function getNavigationLabel(): string
    {
        return __('Site Settings');
    }
    protected static ?string $navigationGroup = null;

    public static function getNavigationGroup(): string
    {
        return __('System');
    }
    protected static ?string $title = null;

    public function getTitle(): string
    {
        return __('Site Settings');
    }
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
                        Tabs\Tab::make(__('Contact'))
                            ->schema([
                                Section::make(__('Contact Information'))
                                    ->schema([
                                        TextInput::make('email')->label(__('Email'))->email(),
                                        TextInput::make('support_email')->label(__('Support Email'))->email(),
                                        TextInput::make('phone')->label(__('Phone')),
                                        TextInput::make('phone_secondary')->label(__('Second Phone')),
                                        TextInput::make('whatsapp')->label(__('WhatsApp Number')),
                                        TextInput::make('working_hours')->label(__('Working Hours')),
                                        TextInput::make('address.az')->label(__('Address (AZ)')),
                                        TextInput::make('address.tr')->label(__('Address (TR)')),
                                        TextInput::make('address.en')->label(__('Address (EN)')),
                                        TextInput::make('address.ru')->label(__('Address (RU)')),
                                    ])->columns(2),
                            ]),
                        Tabs\Tab::make(__('Social'))
                            ->schema([
                                Section::make(__('Social Links'))
                                    ->schema([
                                        TextInput::make('facebook_url')->label(__('Facebook'))->url(),
                                        TextInput::make('instagram_url')->label(__('Instagram'))->url(),
                                        TextInput::make('linkedin_url')->label(__('LinkedIn'))->url(),
                                        TextInput::make('telegram_url')->label(__('Telegram'))->url(),
                                        TextInput::make('twitter_url')->label(__('Twitter / X'))->url(),
                                        TextInput::make('youtube_url')->label(__('YouTube'))->url(),
                                    ])->columns(2),
                            ]),
                        Tabs\Tab::make(__('Content'))
                            ->schema([
                                Section::make(__('Tagline'))
                                    ->schema([
                                        TextInput::make('tagline.az')->label(__('Tagline (AZ)')),
                                        TextInput::make('tagline.tr')->label(__('Tagline (TR)')),
                                        TextInput::make('tagline.en')->label(__('Tagline (EN)')),
                                        TextInput::make('tagline.ru')->label(__('Tagline (RU)')),
                                    ])->columns(2),
                                Section::make(__('Footer Description'))
                                    ->schema([
                                        Textarea::make('footer_description.az')->label(__('Footer (AZ)'))->rows(2),
                                        Textarea::make('footer_description.tr')->label(__('Footer (TR)'))->rows(2),
                                        Textarea::make('footer_description.en')->label(__('Footer (EN)'))->rows(2),
                                        Textarea::make('footer_description.ru')->label(__('Footer (RU)'))->rows(2),
                                    ])->columns(2),
                                TextInput::make('copyright_text')->label(__('Copyright Text'))->columnSpanFull(),
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
            ->title(__('Site settings updated'))
            ->success()
            ->send();
    }
}
