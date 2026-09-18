<?php

namespace App\Modules\Seo\Filament\Pages;

use App\Modules\Seo\Models\PageSeo;
use App\Modules\Seo\Models\SeoSetting;
use Filament\Actions\Action;
use Filament\Forms\Components\Grid;
use Filament\Forms\Components\Section;
use Filament\Forms\Components\Tabs;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Concerns\InteractsWithForms;
use Filament\Forms\Contracts\HasForms;
use Filament\Forms\Form;
use Filament\Notifications\Notification;
use Filament\Pages\Page;

class ManageSeoSettings extends Page implements HasForms
{
    use InteractsWithForms;

    protected static ?string $navigationIcon = 'heroicon-o-globe-alt';
    protected static ?string $navigationGroup = null;

    public static function getNavigationGroup(): string
    {
        return __('System');
    }
    protected static ?string $navigationLabel = null;

    public static function getNavigationLabel(): string
    {
        return __('SEO Settings');
    }
    protected static ?string $title = null;

    public function getTitle(): string
    {
        return __('SEO Settings & Global Scripts');
    }
    protected static ?int $navigationSort = 91;
    protected static ?string $slug = 'seo-settings';

    protected static string $view = 'filament.pages.manage-seo-settings';

    public ?array $data = [];

    public function mount(): void
    {
        $setting = SeoSetting::current();
        PageSeo::ensureDefaults();
        $pages = PageSeo::orderBy('sort_order')->get();

        $pageData = [];
        foreach ($pages as $page) {
            $pageData[$page->page_key] = [
                'page_name' => $page->page_name,
                'h1' => $page->h1,
                'title' => $page->title,
                'description' => $page->description,
                'keywords' => $page->keywords,
                'canonical_url' => $page->canonical_url,
                'og_image' => $page->og_image,
            ];
        }

        $this->form->fill(array_merge($setting->toArray(), ['pages' => $pageData]));
    }

    public function form(Form $form): Form
    {
        PageSeo::ensureDefaults();
        $pages = PageSeo::orderBy('sort_order')->get();

        $pageTabs = [];
        foreach ($pages as $p) {
            $key = $p->page_key;
            $pageTabs[] = Tabs\Tab::make("page_{$key}")
                ->label($p->page_name)
                ->schema([
                    Section::make("{$p->page_name} — H1 Başlığı")
                        ->description(__('The page\'s main H1 heading for search engines (kept hidden in the HTML).'))
                        ->schema([
                            Grid::make(2)->schema([
                                TextInput::make("pages.{$key}.h1.az")->label(__('H1 (Azerbaijani)')),
                                TextInput::make("pages.{$key}.h1.tr")->label(__('H1 (Turkish)')),
                                TextInput::make("pages.{$key}.h1.en")->label(__('H1 (English)')),
                                TextInput::make("pages.{$key}.h1.ru")->label(__('H1 (Russian)')),
                            ]),
                        ])
                        ->collapsible(),

                    Section::make("{$p->page_name} — SEO Başlığı (Meta Title)")
                        ->schema([
                            Grid::make(2)->schema([
                                TextInput::make("pages.{$key}.title.az")->label(__('Title (Azerbaijani)')),
                                TextInput::make("pages.{$key}.title.tr")->label(__('Title (Turkish)')),
                                TextInput::make("pages.{$key}.title.en")->label(__('Title (English)')),
                                TextInput::make("pages.{$key}.title.ru")->label(__('Title (Russian)')),
                            ]),
                        ])
                        ->collapsible(),

                    Section::make("{$p->page_name} — SEO Təsviri (Meta Description)")
                        ->schema([
                            Grid::make(2)->schema([
                                Textarea::make("pages.{$key}.description.az")->label(__('Description (Azerbaijani)'))->rows(2),
                                Textarea::make("pages.{$key}.description.tr")->label(__('Description (Turkish)'))->rows(2),
                                Textarea::make("pages.{$key}.description.en")->label(__('Description (English)'))->rows(2),
                                Textarea::make("pages.{$key}.description.ru")->label(__('Description (Russian)'))->rows(2),
                            ]),
                        ])
                        ->collapsible(),

                    Section::make("{$p->page_name} — Açar Sözlər (Meta Keywords)")
                        ->schema([
                            Grid::make(2)->schema([
                                TextInput::make("pages.{$key}.keywords.az")->label(__('Keywords (Azerbaijani)'))->placeholder(__('Comma separated')),
                                TextInput::make("pages.{$key}.keywords.tr")->label(__('Keywords (Turkish)'))->placeholder(__('Comma separated')),
                                TextInput::make("pages.{$key}.keywords.en")->label(__('Keywords (English)'))->placeholder(__('Comma separated')),
                                TextInput::make("pages.{$key}.keywords.ru")->label(__('Keywords (Russian)'))->placeholder(__('Comma separated')),
                            ]),
                        ])
                        ->collapsible()
                        ->collapsed(),

                    Section::make("{$p->page_name} — Qabaqcıl")
                        ->description(__('Canonical URL and social (OG) image.'))
                        ->schema([
                            Grid::make(2)->schema([
                                TextInput::make("pages.{$key}.canonical_url")
                                    ->label(__('Canonical URL'))
                                    ->url()
                                    ->maxLength(255)
                                    ->placeholder(__('If left empty, the current URL is used')),
                                \Filament\Forms\Components\FileUpload::make("pages.{$key}.og_image")
                                    ->label(__('OG Image'))
                                    ->image()
                                    ->directory('seo'),
                            ]),
                        ])
                        ->collapsible()
                        ->collapsed(),
                ]);
        }

        return $form
            ->schema([
                Tabs::make('SeoSettingsTabs')
                    ->tabs([
                        Tabs\Tab::make(__('Global Scripts'))
                            ->icon('heroicon-o-code-bracket')
                            ->schema([
                                Section::make(__('<head> Scripts'))
                                    ->description(__('Google Analytics, GTM (<head>), Meta Pixel, Yandex Metrika, etc. Executed raw inside <head> on all pages.'))
                                    ->schema([
                                        Textarea::make('head_scripts')
                                            ->label(__('HTML / JS (<head>)'))
                                            ->rows(6)
                                            ->extraAttributes(['class' => 'font-mono text-xs']),
                                    ]),
                                Section::make(__('<body> Scripts'))
                                    ->description(__('GTM <noscript> or code that must run as soon as <body> opens.'))
                                    ->schema([
                                        Textarea::make('body_scripts')
                                            ->label(__('HTML / JS (<body>)'))
                                            ->rows(5)
                                            ->extraAttributes(['class' => 'font-mono text-xs']),
                                    ]),
                                Section::make(__('Footer / </body> Scripts'))
                                    ->description(__('Live chat (Tawk.to, etc.), reCAPTCHA or code before </body>.'))
                                    ->schema([
                                        Textarea::make('footer_scripts')
                                            ->label(__('HTML / JS (before </body>)'))
                                            ->rows(5)
                                            ->extraAttributes(['class' => 'font-mono text-xs']),
                                    ]),
                            ]),

                        Tabs\Tab::make(__('Page Titles & Meta'))
                            ->icon('heroicon-o-document-text')
                            ->schema([
                                Tabs::make('PageTabs')->tabs($pageTabs),
                            ]),

                        Tabs\Tab::make(__('Global Default Meta'))
                            ->icon('heroicon-o-sparkles')
                            ->schema([
                                Section::make(__('Default Meta Title'))
                                    ->schema([
                                        Grid::make(2)->schema([
                                            TextInput::make('default_meta_title.az')->label(__('Title (Azerbaijani)')),
                                            TextInput::make('default_meta_title.tr')->label(__('Title (Turkish)')),
                                            TextInput::make('default_meta_title.en')->label(__('Title (English)')),
                                            TextInput::make('default_meta_title.ru')->label(__('Title (Russian)')),
                                        ]),
                                    ]),
                                Section::make(__('Default Meta Description'))
                                    ->schema([
                                        Grid::make(2)->schema([
                                            Textarea::make('default_meta_description.az')->label(__('Description (Azerbaijani)'))->rows(2),
                                            Textarea::make('default_meta_description.tr')->label(__('Description (Turkish)'))->rows(2),
                                            Textarea::make('default_meta_description.en')->label(__('Description (English)'))->rows(2),
                                            Textarea::make('default_meta_description.ru')->label(__('Description (Russian)'))->rows(2),
                                        ]),
                                    ]),
                                Section::make(__('Default Keywords'))
                                    ->schema([
                                        Grid::make(2)->schema([
                                            TextInput::make('default_meta_keywords.az')->label(__('Keywords (Azerbaijani)')),
                                            TextInput::make('default_meta_keywords.tr')->label(__('Keywords (Turkish)')),
                                            TextInput::make('default_meta_keywords.en')->label(__('Keywords (English)')),
                                            TextInput::make('default_meta_keywords.ru')->label(__('Keywords (Russian)')),
                                        ]),
                                    ]),
                                TextInput::make('og_image')
                                    ->label(__('Default Social Image (OG:Image URL)'))
                                    ->placeholder('https://jobing.az/uploads/og-share.jpg'),
                            ]),
                    ]),
            ])
            ->statePath('data');
    }

    public function save(): void
    {
        $data = $this->form->getState();

        $setting = SeoSetting::firstOrNew(['id' => 1]);
        $setting->fill([
            'head_scripts' => $data['head_scripts'] ?? null,
            'body_scripts' => $data['body_scripts'] ?? null,
            'footer_scripts' => $data['footer_scripts'] ?? null,
            'default_meta_title' => $data['default_meta_title'] ?? null,
            'default_meta_description' => $data['default_meta_description'] ?? null,
            'default_meta_keywords' => $data['default_meta_keywords'] ?? null,
            'og_image' => $data['og_image'] ?? null,
        ])->save();

        if (isset($data['pages']) && is_array($data['pages'])) {
            foreach ($data['pages'] as $pageKey => $pData) {
                PageSeo::updateOrCreate(
                    ['page_key' => $pageKey],
                    [
                        'h1' => $pData['h1'] ?? null,
                        'title' => $pData['title'] ?? null,
                        'description' => $pData['description'] ?? null,
                        'keywords' => $pData['keywords'] ?? null,
                        'canonical_url' => $pData['canonical_url'] ?? null,
                        'og_image' => $pData['og_image'] ?? null,
                    ]
                );
            }
        }

        Notification::make()
            ->title(__('SEO and script settings saved!'))
            ->success()
            ->send();
    }

    protected function getFormActions(): array
    {
        return [
            Action::make('save')
                ->label(__('Save'))
                ->submit('save')
                ->color('primary'),
        ];
    }
}
