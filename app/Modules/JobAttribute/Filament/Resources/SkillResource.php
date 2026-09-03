<?php

namespace App\Modules\JobAttribute\Filament\Resources;

use App\Modules\JobAttribute\Models\Skill;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;

class SkillResource extends Resource
{
    protected static ?string $model = Skill::class;

    protected static ?string $navigationIcon = 'heroicon-o-hashtag';
    protected static ?string $navigationGroup = 'İlan & Şirket Yönetimi';
    protected static ?string $modelLabel = 'Bacarıq Teqi';
    protected static ?string $pluralModelLabel = 'Bacarıq Teqləri';
    protected static ?int $navigationSort = 7;

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Section::make('Teq Məlumatları & Çoxdilli Tərcümə')
                    ->schema([
                        Forms\Components\Tabs::make('NameTranslations')
                            ->tabs([
                                Forms\Components\Tabs\Tab::make('🇦🇿 Azərbaycan')
                                    ->schema([
                                        Forms\Components\TextInput::make('name.az')
                                            ->label('Bacarıq Adı (AZ)')
                                            ->required()
                                            ->maxLength(255)
                                            ->live(onBlur: true)
                                            ->afterStateUpdated(fn (string $operation, $state, Forms\Set $set) => 
                                                $operation === 'create' ? $set('slug', \Illuminate\Support\Str::slug($state)) : null
                                            ),
                                    ]),
                                Forms\Components\Tabs\Tab::make('🇬🇧 English')
                                    ->schema([
                                        Forms\Components\TextInput::make('name.en')
                                            ->label('Skill Name (EN)')
                                            ->maxLength(255),
                                    ]),
                                Forms\Components\Tabs\Tab::make('🇹🇷 Türkçe')
                                    ->schema([
                                        Forms\Components\TextInput::make('name.tr')
                                            ->label('Becerik Adı (TR)')
                                            ->maxLength(255),
                                    ]),
                                Forms\Components\Tabs\Tab::make('🇷🇺 Русский')
                                    ->schema([
                                        Forms\Components\TextInput::make('name.ru')
                                            ->label('Название навыка (RU)')
                                            ->maxLength(255),
                                    ]),
                            ])
                            ->columnSpanFull(),

                        Forms\Components\Select::make('category_id')
                            ->label('Kateqoriya')
                            ->options(fn (): array => collect(\App\Modules\Category\Models\Category::parents()->get())
                                ->sortBy(fn ($c) => (string) $c->name)
                                ->mapWithKeys(fn ($c) => [(string) $c->id => (string) $c->name])
                                ->all())
                            ->searchable()
                            ->preload()
                            ->nullable()
                            ->helperText('Bacarığın aid olduğu əsas kateqoriyanı seçin.'),

                        Forms\Components\TextInput::make('slug')
                            ->label('Slug / URL')
                            ->required()
                            ->unique(Skill::class, 'slug', ignoreRecord: true)
                            ->maxLength(255),

                        Forms\Components\TextInput::make('order')
                            ->label('Sıralama Sırası')
                            ->numeric()
                            ->default(0),

                        Forms\Components\Toggle::make('is_active')
                            ->label('Aktivlik Durumu')
                            ->default(true),
                    ])->columns(2),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('name')
                    ->label('Teq Adı')
                    ->searchable()
                    ->sortable()
                    ->weight('bold'),

                Tables\Columns\TextColumn::make('category.name')
                    ->label('Kateqoriya')
                    ->badge()
                    ->color('warning')
                    ->placeholder('—')
                    ->sortable(),

                Tables\Columns\TextColumn::make('slug')
                    ->label('Slug')
                    ->badge()
                    ->color('gray'),

                Tables\Columns\TextColumn::make('order')
                    ->label('Sıra')
                    ->sortable(),

                Tables\Columns\IconColumn::make('is_active')
                    ->label('Aktiv')
                    ->boolean()
                    ->sortable(),

                Tables\Columns\TextColumn::make('created_at')
                    ->label('Tarix')
                    ->dateTime('d.m.Y')
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                Tables\Filters\SelectFilter::make('category_id')
                    ->label('Kateqoriya')
                    ->options(fn (): array => collect(\App\Modules\Category\Models\Category::parents()->get())
                        ->sortBy(fn ($c) => (string) $c->name)
                        ->mapWithKeys(fn ($c) => [(string) $c->id => (string) $c->name])
                        ->all()),
                Tables\Filters\TernaryFilter::make('is_active')
                    ->label('Aktivlik Durumu'),
            ])
            ->actions([
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
            'index' => SkillResource\Pages\ListSkills::route('/'),
            'create' => SkillResource\Pages\CreateSkill::route('/create'),
            'edit' => SkillResource\Pages\EditSkill::route('/{record}/edit'),
        ];
    }
}
