<?php

namespace App\Modules\JobSeeker\Filament\Resources;

use App\Modules\JobSeeker\Filament\Concerns\HasSkillPicker;
use App\Modules\JobSeeker\Filament\Resources\JobSeekerResource\Pages;
use App\Modules\JobSeeker\Models\JobSeeker;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Model;

class JobSeekerResource extends Resource
{
    use HasSkillPicker;

    protected static ?string $model = JobSeeker::class;

    protected static ?string $navigationIcon = 'heroicon-o-user-group';
    protected static ?string $navigationGroup = null;

    public static function getNavigationGroup(): string
    {
        return __('Job Seeking');
    }
    protected static ?string $modelLabel = null;

    public static function getModelLabel(): string
    {
        return __('Job Seeker Listing');
    }
    protected static ?string $pluralModelLabel = null;

    public static function getPluralModelLabel(): string
    {
        return __('Job Seeker Listings');
    }
    protected static ?int $navigationSort = 1;

    public static function getNavigationBadge(): ?string
    {
        $count = static::getModel()::where('status', 'pending')->count();
        return $count > 0 ? (string) $count : null;
    }

    public static function getNavigationBadgeColor(): string|array|null
    {
        return 'warning';
    }

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Section::make(__('Listing Details'))
                    ->schema([
                        Forms\Components\TextInput::make('title')->label(__('Title'))->required()->maxLength(255),
                        Forms\Components\Select::make('category_parent_id')
                            ->label(__('Category'))
                            ->options(static::parentCategoryOptions())
                            ->searchable()->preload()->live()
                            ->default(fn (?Model $record): ?string => $record?->category?->parent_id ? (string) $record->category->parent_id : null)
                            ->afterStateUpdated(fn (Forms\Set $set) => $set('category_id', null))
                            ->dehydrated(false)
                            ->placeholder(__('Select a category…')),
                        Forms\Components\Select::make('category_id')
                            ->label(__('Position / Occupation'))
                            ->options(fn (Forms\Get $get): array => static::subcategoryOptions($get('category_parent_id') ? (int) $get('category_parent_id') : null))
                            ->searchable()->preload()->nullable()
                            ->placeholder(__('Select a category first…')),
                        Forms\Components\Select::make('job_type_id')->label(__('Job Type'))->options(static::jobTypeOptions())->searchable()->nullable(),
                        Forms\Components\Select::make('workplace_type_id')->label(__('Workplace'))->options(static::workplaceTypeOptions())->searchable()->nullable(),
                        Forms\Components\Select::make('experience_level_id')->label(__('Experience Level'))->options(static::experienceLevelOptions())->searchable()->nullable(),
                        Forms\Components\Select::make('location')->label(__('City'))->options(static::cityOptions())->searchable()->placeholder(__('Select a city…')),
                        Forms\Components\Textarea::make('description')->label(__('Experience & Skills'))->rows(4)->columnSpanFull(),
                        Forms\Components\Select::make('skills')
                            ->label(__('Skills (Admin catalog)'))
                            ->multiple()
                            ->searchable()
                            ->preload()
                            ->options(fn (Forms\Get $get): array => static::skillOptions($get('category_parent_id') ? (int) $get('category_parent_id') : null))
                            ->columnSpanFull(),
                    ])->columns(2),

                Forms\Components\Section::make(__('Salary & Contact'))
                    ->schema([
                        Forms\Components\TextInput::make('salary_min')->label(__('Min salary'))->numeric()->nullable(),
                        Forms\Components\TextInput::make('salary_max')->label(__('Max salary'))->numeric()->nullable(),
                        Forms\Components\TextInput::make('currency')->label(__('Currency'))->default('TRY'),
                        Forms\Components\Toggle::make('salary_negotiable')->label(__('Negotiable')),
                        Forms\Components\Select::make('availability')->label(__('Competition'))->options([
                            'immediate' => 'Hemen',
                            'two_weeks' => '2 hafta',
                            'one_month' => '1 ay',
                            'flexible' => 'Esnek',
                        ]),
                        Forms\Components\TextInput::make('contact_name')->label(__('Full Name'))->required(),
                        Forms\Components\TextInput::make('contact_email')->label(__('Email'))->email(),
                        Forms\Components\TextInput::make('contact_phone')->label(__('Phone')),
                    ])->columns(2),

                Forms\Components\Section::make(__('Status'))
                    ->schema([
                        Forms\Components\Select::make('status')->label(__('Status'))->options([
                            'published' => 'Yayınlandı',
                            'pending' => __('Pending'),
                            'rejected' => 'İmtina edilib',
                            'closed' => 'Bağlanıb',
                        ])->required()->default('published'),
                        Forms\Components\TextInput::make('views_count')->label(__('View Count'))->numeric()->disabled(),
                    ])->columns(2),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->defaultSort('updated_at', 'desc')
            ->columns([
                Tables\Columns\TextColumn::make('title')->label(__('Title'))->searchable()->sortable()->weight('bold')->limit(40),
                Tables\Columns\TextColumn::make('position')->label(__('Position'))->searchable()->toggleable(),
                Tables\Columns\TextColumn::make('category.name')->label(__('Category'))->toggleable(),
                Tables\Columns\TextColumn::make('location')->label(__('City'))->toggleable(),
                Tables\Columns\TextColumn::make('contact_name')->label(__('Contact'))->searchable(),
                Tables\Columns\TextColumn::make('status')->label(__('Status'))->badge()->color(fn (string $state): string => match ($state) {
                    'published' => 'success',
                    'pending' => 'warning',
                    'rejected' => 'danger',
                    'closed' => 'gray',
                    default => 'primary',
                }),
                Tables\Columns\IconColumn::make('is_featured')->label(__('Premium'))->boolean()->sortable(),
                Tables\Columns\TextColumn::make('views_count')->label(__('Views'))->sortable(),
                Tables\Columns\TextColumn::make('created_at')->label(__('Date'))->dateTime('d.m.Y')->sortable(),
            ])
            ->filters([
                Tables\Filters\SelectFilter::make('status')->label(__('Status'))->options([
                    'published' => 'Yayınlandı',
                    'pending' => __('Pending'),
                    'rejected' => 'İmtina edilib',
                    'closed' => 'Bağlanıb',
                ]),
                Tables\Filters\SelectFilter::make('category')
                    ->label(__('Category'))
                    ->options(static::categoryOptions())
                    ->attribute('category_id'),
            ])
            ->actions([
                Tables\Actions\Action::make('bump')
                    ->label(__('Boost'))
                    ->icon('heroicon-o-arrow-up-circle')
                    ->color('warning')
                    ->requiresConfirmation()
                    ->modalHeading(__('Boost the Listing'))
                    ->modalDescription(__('This job-seeking listing will immediately rise to the very first position.'))
                    ->modalSubmitActionLabel(__('Boost'))
                    ->action(function (JobSeeker $record) {
                        $record->bumped_at = now();
                        $record->save();
                        \Filament\Notifications\Notification::make()
                            ->title(__('Listing boosted successfully!'))
                            ->success()
                            ->send();
                    }),

                Tables\Actions\Action::make('toggle_featured')
                    ->label(fn (JobSeeker $record): string => $record->is_featured ? 'Premiumu Kaldır' : 'Premium Et')
                    ->icon('heroicon-o-sparkles')
                    ->color('amber')
                    ->requiresConfirmation()
                    ->modalHeading(fn (JobSeeker $record): string => $record->is_featured ? 'Premium Durumunu Kaldır' : 'Premium Durumu Ver')
                    ->action(function (JobSeeker $record) {
                        $record->is_featured = !$record->is_featured;
                        if ($record->is_featured) {
                            $record->featured_until = now()->addDays(30);
                        } else {
                            $record->featured_until = null;
                        }
                        $record->save();
                        \Filament\Notifications\Notification::make()
                            ->title($record->is_featured ? 'İlana Premium durumu verildi!' : 'Premium durumu kaldırıldı.')
                            ->success()
                            ->send();
                    }),

                Tables\Actions\EditAction::make(),
                Tables\Actions\DeleteAction::make(),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),
                ]),
            ]);
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListJobSeekers::route('/'),
            'create' => Pages\CreateJobSeeker::route('/create'),
            'edit' => Pages\EditJobSeeker::route('/{record}/edit'),
        ];
    }
}
