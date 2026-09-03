<?php

namespace App\Modules\JobSeeker\Filament\Resources;

use App\Modules\JobSeeker\Filament\Resources\JobSeekerResource\Pages;
use App\Modules\JobSeeker\Models\JobSeeker;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;

class JobSeekerResource extends Resource
{
    protected static ?string $model = JobSeeker::class;

    protected static ?string $navigationIcon = 'heroicon-o-user-group';
    protected static ?string $navigationGroup = 'İş Arıyorum';
    protected static ?string $modelLabel = 'İş Arayan Elanı';
    protected static ?string $pluralModelLabel = 'İş Arayan Elanları';
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
                Forms\Components\Section::make('Elan Məlumatları')
                    ->schema([
                        Forms\Components\TextInput::make('title')->label('Başlıq')->required()->maxLength(255),
                        Forms\Components\TextInput::make('position')->label('Vəzifə / Mövqe')->maxLength(255),
                        Forms\Components\Select::make('category_id')->label('Kateqoriya')->relationship('category', 'name')->searchable()->preload()->nullable(),
                        Forms\Components\Select::make('job_type_id')->label('İş Rejimi')->relationship('jobType', 'name')->nullable(),
                        Forms\Components\Select::make('workplace_type_id')->label('Çalışma Yeri')->relationship('workplaceType', 'name')->nullable(),
                        Forms\Components\Select::make('experience_level_id')->label('Təcrübə Səviyyəsi')->relationship('experienceLevel', 'name')->nullable(),
                        Forms\Components\TextInput::make('location')->label('Şəhər'),
                        Forms\Components\Textarea::make('description')->label('Təcrübə və bacarıqlar')->rows(4)->columnSpanFull(),
                        Forms\Components\Textarea::make('skills')->label('Bacarıqlar')->formatStateUsing(fn ($state) => is_array($state) ? implode(', ', $state) : $state)->columnSpanFull(),
                    ])->columns(2),

                Forms\Components\Section::make('Maaş & Əlaqə')
                    ->schema([
                        Forms\Components\TextInput::make('salary_min')->label('Min maaş')->numeric()->nullable(),
                        Forms\Components\TextInput::make('salary_max')->label('Max maaş')->numeric()->nullable(),
                        Forms\Components\TextInput::make('currency')->label('Valyuta')->default('AZN'),
                        Forms\Components\Toggle::make('salary_negotiable')->label('Razılaşma yolu ilə'),
                        Forms\Components\Select::make('availability')->label('Müsabiqə')->options([
                            'immediate' => 'Dərhal',
                            'two_weeks' => '2 həftə',
                            'one_month' => '1 ay',
                            'flexible' => 'Esnek',
                        ]),
                        Forms\Components\TextInput::make('contact_name')->label('Ad Soyad')->required(),
                        Forms\Components\TextInput::make('contact_email')->label('E-Posta')->email(),
                        Forms\Components\TextInput::make('contact_phone')->label('Telefon'),
                    ])->columns(2),

                Forms\Components\Section::make('Status')
                    ->schema([
                        Forms\Components\Select::make('status')->label('Status')->options([
                            'published' => 'Yayınlandı',
                            'pending' => 'Gözləmədə',
                            'rejected' => 'İmtina edilib',
                            'closed' => 'Bağlanıb',
                        ])->required()->default('published'),
                        Forms\Components\TextInput::make('views_count')->label('Baxış sayı')->numeric()->disabled(),
                    ])->columns(2),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->defaultSort('id', 'desc')
            ->columns([
                Tables\Columns\TextColumn::make('title')->label('Başlıq')->searchable()->sortable()->weight('bold')->limit(40),
                Tables\Columns\TextColumn::make('position')->label('Vəzifə')->searchable()->toggleable(),
                Tables\Columns\TextColumn::make('category.name')->label('Kateqoriya')->toggleable(),
                Tables\Columns\TextColumn::make('location')->label('Şəhər')->toggleable(),
                Tables\Columns\TextColumn::make('contact_name')->label('Əlaqə')->searchable(),
                Tables\Columns\TextColumn::make('status')->label('Status')->badge()->color(fn (string $state): string => match ($state) {
                    'published' => 'success',
                    'pending' => 'warning',
                    'rejected' => 'danger',
                    'closed' => 'gray',
                    default => 'primary',
                }),
                Tables\Columns\IconColumn::make('is_featured')->label('Premium')->boolean()->sortable(),
                Tables\Columns\TextColumn::make('views_count')->label('Baxış')->sortable(),
                Tables\Columns\TextColumn::make('created_at')->label('Tarix')->dateTime('d.m.Y')->sortable(),
            ])
            ->filters([
                Tables\Filters\SelectFilter::make('status')->label('Status')->options([
                    'published' => 'Yayınlandı',
                    'pending' => 'Gözləmədə',
                    'rejected' => 'İmtina edilib',
                    'closed' => 'Bağlanıb',
                ]),
                Tables\Filters\SelectFilter::make('category')->label('Kateqoriya')->relationship('category', 'name'),
            ])
            ->actions([
                Tables\Actions\Action::make('bump')
                    ->label('İrəli Çək')
                    ->icon('heroicon-o-arrow-up-circle')
                    ->color('warning')
                    ->requiresConfirmation()
                    ->modalHeading('Elanı İrəli Çək')
                    ->modalDescription('Bu iş axtarış elanı dərhal ən birinci sıraya yüksələcək.')
                    ->modalSubmitActionLabel('İrəli Çək')
                    ->action(function (JobSeeker $record) {
                        $record->bumped_at = now();
                        $record->save();
                        \Filament\Notifications\Notification::make()
                            ->title('Elan uğurla irəli çəkildi!')
                            ->success()
                            ->send();
                    }),

                Tables\Actions\Action::make('toggle_featured')
                    ->label(fn (JobSeeker $record): string => $record->is_featured ? 'Premiumu Ləğv Et' : 'Premium Et')
                    ->icon('heroicon-o-sparkles')
                    ->color('amber')
                    ->requiresConfirmation()
                    ->modalHeading(fn (JobSeeker $record): string => $record->is_featured ? 'Premium Statusunu Ləğv Et' : 'Premium Statusu Ver')
                    ->action(function (JobSeeker $record) {
                        $record->is_featured = !$record->is_featured;
                        if ($record->is_featured) {
                            $record->featured_until = now()->addDays(30);
                        } else {
                            $record->featured_until = null;
                        }
                        $record->save();
                        \Filament\Notifications\Notification::make()
                            ->title($record->is_featured ? 'Elana Premium statusu verildi!' : 'Premium statusu ləğv edildi.')
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
