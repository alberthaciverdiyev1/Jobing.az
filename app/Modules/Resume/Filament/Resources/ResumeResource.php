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
    protected static ?string $navigationLabel = null;

    public static function getNavigationLabel(): string
    {
        return __('My CVs & Resumes');
    }
    protected static ?string $modelLabel = null;

    public static function getModelLabel(): string
    {
        return __('CV / Resume');
    }
    protected static ?string $pluralModelLabel = null;

    public static function getPluralModelLabel(): string
    {
        return __('My CVs & Resumes');
    }
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
                Forms\Components\Section::make(__('CV Title & Main Settings'))
                    ->description(__('The CV name and who can see it'))
                    ->schema([
                        Forms\Components\TextInput::make('title')
                            ->label(__('CV Title'))
                            ->placeholder(__('e.g.: Senior Full Stack Developer CV'))
                            ->required()
                            ->maxLength(255)
                            ->columnSpanFull(),

                        Forms\Components\Toggle::make('is_default')
                            ->label(__('Set as Default CV'))
                            ->helperText(__('This CV will be used automatically during applications'))
                            ->default(false),

                        Forms\Components\Toggle::make('is_public')
                            ->label(__('Visible only in the internal portal'))
                            ->helperText(__('When active, your CV is visible only to company (employer) accounts in the internal portal, not on the public site.'))
                            ->default(true),
                    ])->columns(2),

                Forms\Components\Section::make(__('1. Personal Information & Contact'))
                    ->collapsible()
                    ->schema([
                        Forms\Components\FileUpload::make('photo')
                            ->label(__('Profile Photo'))
                            ->image()
                            ->avatar()
                            ->directory('resumes/photos')
                            ->columnSpanFull(),

                        Forms\Components\TextInput::make('first_name')->label(__('Name'))->required()->default(fn () => explode(' ', auth()->user()?->name ?? '')[0] ?? ''),
                        Forms\Components\TextInput::make('last_name')->label(__('Surname'))->required()->default(fn () => implode(' ', array_slice(explode(' ', auth()->user()?->name ?? ''), 1)) ?? ''),

                        Forms\Components\TextInput::make('phone')
                            ->label(__('Phone'))
                            ->tel()
                            ->prefixIcon('heroicon-o-phone')
                            ->placeholder('+90 533 000 00 00'),

                        Forms\Components\TextInput::make('whatsapp')
                            ->label(__('WhatsApp Number'))
                            ->tel()
                            ->prefixIcon('heroicon-o-chat-bubble-left-right')
                            ->placeholder('+90 533 000 00 00')
                            ->helperText(__('Companies can contact you directly via WhatsApp')),

                        Forms\Components\TextInput::make('email')
                            ->label(__('Email'))
                            ->email()
                            ->prefixIcon('heroicon-o-envelope')
                            ->default(fn () => auth()->user()?->email),

                        Forms\Components\Select::make('location')
                            ->label(__('City / Location'))
                            ->options(\App\Enums\CityEnum::options())
                            ->searchable()
                            ->default('Lefkoşa'),
                        Forms\Components\TextInput::make('linkedin_url')->label(__('LinkedIn URL'))->url()->placeholder('https://linkedin.com/in/...'),

                        Forms\Components\TextInput::make('github_url')->label(__('GitHub URL'))->url()->placeholder('https://github.com/...'),
                        Forms\Components\TextInput::make('portfolio_url')->label(__('Portfolio / Website'))->url()->placeholder('https://myportfolio.com'),
                    ])->columns(2),

                Forms\Components\Section::make(__('2. Professional Summary'))
                    ->collapsible()
                    ->schema([
                        Forms\Components\Textarea::make('summary')
                            ->label(__('Short Summary About You'))
                            ->placeholder(__('A 2-3 sentence summary about your experience, key skills and goals...'))
                            ->rows(3)
                            ->columnSpanFull(),
                    ]),

                Forms\Components\Section::make(__('3. Work Experience'))
                    ->collapsible()
                    ->schema([
                        Forms\Components\ViewField::make('work_experiences')
                            ->view('filament.forms.components.custom-work-experiences')
                            ->columnSpanFull(),
                    ]),

                Forms\Components\Section::make(__('4. Education'))
                    ->collapsible()
                    ->schema([
                        Forms\Components\ViewField::make('education')
                            ->view('filament.forms.components.custom-education')
                            ->columnSpanFull(),
                    ]),

                Forms\Components\Section::make(__('5. Skills & Languages'))
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

                Forms\Components\Section::make(__('6. Projects'))
                    ->collapsible()
                    ->schema([
                        Forms\Components\ViewField::make('projects')
                            ->view('filament.forms.components.custom-projects')
                            ->columnSpanFull(),
                    ]),

                Forms\Components\Section::make(__('7. Certificates & Awards'))
                    ->collapsible()
                    ->schema([
                        Forms\Components\Grid::make(2)->schema([
                            Forms\Components\ViewField::make('certificates')
                                ->view('filament.forms.components.custom-certificates'),

                            Forms\Components\ViewField::make('awards')
                                ->view('filament.forms.components.custom-awards'),
                        ]),
                    ]),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\ImageColumn::make('photo')
                    ->label(__('Photo'))
                    ->circular(),

                Tables\Columns\TextColumn::make('title')
                    ->label(__('CV Title'))
                    ->searchable()
                    ->sortable()
                    ->weight('bold'),

                Tables\Columns\TextColumn::make('full_name')
                    ->label(__('Full Name'))
                    ->searchable(['first_name', 'last_name']),

                Tables\Columns\TextColumn::make('email')
                    ->label(__('Email'))
                    ->searchable(),

                Tables\Columns\IconColumn::make('is_default')
                    ->label(__('Default'))
                    ->boolean(),

                Tables\Columns\IconColumn::make('is_public')
                    ->label(__('Active'))
                    ->boolean(),

                Tables\Columns\TextColumn::make('updated_at')
                    ->label(__('Update'))
                    ->dateTime('d.m.Y H:i')
                    ->sortable(),
            ])
            ->defaultSort('updated_at', 'desc')
            ->emptyStateActions([
                Tables\Actions\CreateAction::make()->label(__('Add New CV')),
            ])
            ->actions([
                Tables\Actions\Action::make('preview')
                    ->label(__('View CV'))
                    ->icon('heroicon-o-eye')
                    ->color('info')
                    ->url(fn (Resume $record): string => route('resumes.show', $record->id), shouldOpenInNewTab: true),

                Tables\Actions\Action::make('download')
                    ->label(__('Download PDF'))
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
