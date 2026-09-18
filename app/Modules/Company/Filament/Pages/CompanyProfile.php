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
    protected static ?string $navigationLabel = null;

    public static function getNavigationLabel(): string
    {
        return __('Company Profile');
    }
    protected static ?string $title = null;

    public function getTitle(): string
    {
        return __('Company Profile');
    }
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
                Section::make(__('Company Information'))
                    ->schema([
                        FileUpload::make('logo')
                            ->label(__('Logo'))
                            ->image()
                            ->directory('company-logos')
                            ->avatar(),
                        FileUpload::make('banner')
                            ->label(__('Cover / Banner Image'))
                            ->image()
                            ->directory('company-banners')
                            ->imageEditor(),
                        TextInput::make('name')->label(__('Company Name'))->required(),
                        TextInput::make('email')->label(__('Email'))->email()->required(),
                        TextInput::make('website')->label(__('Website'))->url(),
                        TextInput::make('phone')->label(__('Phone')),
                        Select::make('city_id')
                            ->label(__('City / Location'))
                            ->options(fn () => \App\Modules\JobAttribute\Models\City::all()->pluck('name', 'id'))
                            ->searchable()
                            ->preload()
                            ->required(),
                        Tabs::make('AboutTranslations')
                            ->tabs([
                                Tabs\Tab::make('🇦🇿 ' . __('languages.Azerbaijani'))
                                    ->schema([
                                        Textarea::make('about.az')
                                            ->label(__('About Company (AZ)'))
                                            ->rows(4),
                                    ]),
                                Tabs\Tab::make('🇬🇧 ' . __('languages.English'))
                                    ->schema([
                                        Textarea::make('about.en')
                                            ->label(__('About Company (EN)'))
                                            ->rows(4),
                                    ]),
                                Tabs\Tab::make('🇹🇷 ' . __('languages.Turkish'))
                                    ->schema([
                                        Textarea::make('about.tr')
                                            ->label(__('About Company (TR)'))
                                            ->rows(4),
                                    ]),
                                Tabs\Tab::make('🇷🇺 ' . __('languages.Russian'))
                                    ->schema([
                                        Textarea::make('about.ru')
                                            ->label(__('About Company (RU)'))
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
            Notification::make()->title(__('Company profile not found'))->danger()->send();
            return;
        }

        $company->update($this->form->getState());

        Notification::make()
            ->title(__('Company information updated'))
            ->success()
            ->send();
    }

    public function requestVerification(): void
    {
        $company = Auth::user()->company;
        if (!$company) {
            Notification::make()->title(__('Company profile not found'))->danger()->send();
            return;
        }

        if ($company->is_verified) {
            Notification::make()->title(__('Your company is already verified'))->success()->send();
            return;
        }

        $company->update(['verification_requested' => true]);

        // Notify every admin so the request shows up in the admin notification bell.
        $reviewUrl = null;
        try {
            $reviewUrl = \App\Modules\Company\Filament\Resources\CompanyResource::getUrl(
                'edit',
                ['record' => $company],
                isAbsolute: true,
                panel: 'admin',
            );
        } catch (\Throwable $e) {
            $reviewUrl = null;
        }

        \App\Models\User::where('is_admin', true)->get()->each(
            fn (\App\Models\User $admin) => $admin->notify(
                new \App\Modules\Company\Notifications\CompanyVerificationRequestedNotification(
                    (string) $company->name,
                    $reviewUrl,
                )
            )
        );

        Notification::make()
            ->title(__('Verification request sent'))
            ->body(__('The admin will confirm after reviewing the information.'))
            ->success()
            ->send();
    }
}
