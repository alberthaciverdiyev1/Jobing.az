<?php

namespace App\Modules\Company\Filament\Resources;

use App\Modules\Company\Filament\Resources\MessageTemplateResource\Pages;
use App\Modules\Company\Models\MessageTemplate;
use Filament\Facades\Filament;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\Auth;

class MessageTemplateResource extends Resource
{
    protected static ?string $model = MessageTemplate::class;

    protected static ?string $navigationIcon = 'heroicon-o-chat-bubble-bottom-center-text';
    protected static ?string $navigationGroup = null;

    public static function getNavigationGroup(): string
    {
        return __('Company Settings');
    }
    protected static ?string $modelLabel = null;

    public static function getModelLabel(): string
    {
        return __('Message Template');
    }
    protected static ?string $pluralModelLabel = null;

    public static function getPluralModelLabel(): string
    {
        return __('Message Templates');
    }
    protected static ?int $navigationSort = 3;

    public static function getEloquentQuery(): Builder
    {
        $query = parent::getEloquentQuery();

        if (Filament::getCurrentPanel()?->getId() === 'company') {
            $companyId = Auth::user()?->company_id;
            $query->where(function ($q) use ($companyId) {
                $q->whereNull('company_id');
                if ($companyId) {
                    $q->orWhere('company_id', $companyId);
                }
            });
        }

        return $query;
    }

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Section::make(__('Template Information'))
                    ->description('Mesaj şablonunu 4 dilde düzenleyin. Gönderim sırasında { } içindeki parametreler otomatik doldurulur: '
                        . \App\Modules\Company\Support\MessagePlaceholders::tokensText())
                    ->schema([
                        Forms\Components\Select::make('type')
                            ->label(__('Template Type'))
                            ->options([
                                'rejected' => 'Ret Mektubu (Reject)',
                                'interview' => 'Mülakat Daveti (Interview)',
                                'accepted' => __('Job Offer (Accept)'),
                                'custom' => 'Xüsusi Şablon (Custom)',
                            ])
                            ->required()
                            ->default('custom'),

                        Forms\Components\Toggle::make('is_active')
                            ->label(__('Active'))
                            ->default(true),

                        Forms\Components\Tabs::make('Translations')
                            ->tabs([
                                Forms\Components\Tabs\Tab::make('🇦🇿 ' . __('languages.Azerbaijani'))
                                    ->schema([
                                        Forms\Components\TextInput::make('title.az')
                                            ->label(__('Template Title (AZ)'))
                                            ->maxLength(255),
                                        Forms\Components\Textarea::make('content.az')
                                            ->label(__('Message Text (AZ)'))
                                            ->rows(6),
                                    ]),

                                Forms\Components\Tabs\Tab::make('🇬🇧 ' . __('languages.English'))
                                    ->schema([
                                        Forms\Components\TextInput::make('title.en')
                                            ->label(__('Template Title (EN)'))
                                            ->maxLength(255),
                                        Forms\Components\Textarea::make('content.en')
                                            ->label(__('Message Content (EN)'))
                                            ->rows(6),
                                    ]),

                                Forms\Components\Tabs\Tab::make('🇹🇷 ' . __('languages.Turkish') . ' (' . __('Default') . ')')
                                    ->schema([
                                        Forms\Components\TextInput::make('title.tr')
                                            ->label(__('Template Title (TR)'))
                                            ->maxLength(255)
                                            ->required(),
                                        Forms\Components\Textarea::make('content.tr')
                                            ->label(__('Message Content (TR)'))
                                            ->rows(6)
                                            ->required(),
                                    ]),

                                Forms\Components\Tabs\Tab::make('🇷🇺 ' . __('languages.Russian'))
                                    ->schema([
                                        Forms\Components\TextInput::make('title.ru')
                                            ->label(__('Template Title (RU)'))
                                            ->maxLength(255),
                                        Forms\Components\Textarea::make('content.ru')
                                            ->label(__('Message Text (RU)'))
                                            ->rows(6),
                                    ]),
                            ])
                            ->columnSpanFull(),
                    ])->columns(2),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('title')
                    ->label(__('Template Title'))
                    ->formatStateUsing(fn ($state) => is_array($state) ? ($state['az'] ?? reset($state)) : (string) $state)
                    ->searchable()
                    ->sortable()
                    ->weight('bold'),

                Tables\Columns\TextColumn::make('type')
                    ->label(__('Type'))
                    ->badge()
                    ->color(fn (string $state): string => match ($state) {
                        'rejected' => 'danger',
                        'interview' => 'warning',
                        'accepted' => 'success',
                        default => 'info',
                    })
                    ->formatStateUsing(fn (string $state): string => match ($state) {
                        'rejected' => 'İmtina',
                        'interview' => 'Mülakat',
                        'accepted' => __('Job Offer'),
                        default => 'Xüsusi',
                    }),

                Tables\Columns\TextColumn::make('company_id')
                    ->label(__('Source'))
                    ->formatStateUsing(fn ($state) => $state ? 'Şirketinize Özel' : 'Sistem Standardı')
                    ->badge()
                    ->color(fn ($state) => $state ? 'primary' : 'gray'),

                Tables\Columns\IconColumn::make('is_active')
                    ->label(__('Status'))
                    ->boolean(),

                Tables\Columns\TextColumn::make('created_at')
                    ->label(__('Creation Date'))
                    ->dateTime('d.m.Y H:i')
                    ->sortable(),
            ])
            ->filters([
                Tables\Filters\SelectFilter::make('type')
                    ->options([
                        'rejected' => 'Ret Mektubu',
                        'interview' => 'Mülakat Daveti',
                        'accepted' => __('Job Offer'),
                        'custom' => 'Xüsusi',
                    ])
                    ->label(__('By Type')),
            ])
            ->actions([
                Tables\Actions\EditAction::make(),
                Tables\Actions\DeleteAction::make()
                    ->visible(fn (MessageTemplate $record) => !is_null($record->company_id)),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),
                ]),
            ]);
    }

    public static function getRelations(): array
    {
        return [];
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListMessageTemplates::route('/'),
            'create' => Pages\CreateMessageTemplate::route('/create'),
            'edit' => Pages\EditMessageTemplate::route('/{record}/edit'),
        ];
    }
}
