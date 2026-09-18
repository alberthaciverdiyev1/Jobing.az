<?php

namespace App\Modules\Inquiry\Filament\Resources;

use App\Modules\Inquiry\Filament\Resources\InquiryResource\Pages;
use App\Modules\Inquiry\Models\Inquiry;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;

class InquiryResource extends Resource
{
    protected static ?string $model = Inquiry::class;

    protected static ?string $navigationIcon = 'heroicon-o-chat-bubble-left-right';
    protected static ?string $navigationGroup = null;

    public static function getNavigationGroup(): string
    {
        return __('Candidate & Application Management');
    }
    protected static ?string $modelLabel = null;

    public static function getModelLabel(): string
    {
        return __('Application / Lead');
    }
    protected static ?string $pluralModelLabel = null;

    public static function getPluralModelLabel(): string
    {
        return __('Contact Inquiries');
    }
    protected static ?int $navigationSort = 4;

    public static function getNavigationBadge(): ?string
    {
        $count = static::getModel()::where('status', 'new')->count();
        return $count > 0 ? (string) $count : null;
    }

    public static function getNavigationBadgeColor(): string|array|null
    {
        return 'danger';
    }

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Section::make(__('Lead Information'))
                    ->schema([
                        Forms\Components\Select::make('user_id')
                            ->label(__('User'))
                            ->relationship('user', 'name')
                            ->searchable()
                            ->preload()
                            ->nullable(),

                        Forms\Components\TextInput::make('name')
                            ->label(__('Full Name'))
                            ->required()
                            ->maxLength(255),

                        Forms\Components\TextInput::make('email')
                            ->label(__('Email'))
                            ->email()
                            ->maxLength(255),

                        Forms\Components\TextInput::make('phone')
                            ->label(__('Phone'))
                            ->tel()
                            ->maxLength(50),

                        Forms\Components\TextInput::make('subject')
                            ->label(__('Subject'))
                            ->maxLength(255)
                            ->columnSpanFull(),

                        Forms\Components\Textarea::make('message')
                            ->label(__('Message'))
                            ->rows(4)
                            ->columnSpanFull(),
                    ])->columns(2),

                Forms\Components\Section::make(__('Evaluation'))
                    ->schema([
                        Forms\Components\Select::make('type')
                            ->label(__('Type'))
                            ->options([
                                'contact' => __('General Inquiry'),
                                'company' => __('Company / Employer'),
                                'candidate' => 'Aday',
                                'bug_report' => __('Bug Report'),
                                'other' => __('Other'),
                            ])
                            ->required()
                            ->default('contact'),

                        Forms\Components\Select::make('status')
                            ->label(__('Status'))
                            ->options([
                                'new' => __('New'),
                                'contacted' => __('Contacted'),
                                'in_progress' => __('In Progress'),
                                'closed' => __('Closed'),
                                'cancelled' => __('Cancelled'),
                            ])
                            ->required()
                            ->default('new'),

                        Forms\Components\Textarea::make('notes')
                            ->label(__('Internal Notes'))
                            ->rows(3)
                            ->columnSpanFull(),
                    ])->columns(2),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->defaultSort('id', 'desc')
            ->columns([
                Tables\Columns\TextColumn::make('name')
                    ->label(__('Full Name'))
                    ->searchable()
                    ->sortable()
                    ->weight('bold'),

                Tables\Columns\TextColumn::make('email')
                    ->label(__('Email'))
                    ->searchable()
                    ->copyable()
                    ->toggleable(),

                Tables\Columns\TextColumn::make('phone')
                    ->label(__('Phone'))
                    ->searchable()
                    ->toggleable(),

                Tables\Columns\TextColumn::make('subject')
                    ->label(__('Subject'))
                    ->limit(30)
                    ->toggleable(),

                Tables\Columns\TextColumn::make('type')
                    ->label(__('Type'))
                    ->badge()
                    ->color('gray'),

                Tables\Columns\TextColumn::make('status')
                    ->label(__('Status'))
                    ->badge()
                    ->color(fn (string $state): string => match ($state) {
                        'new' => 'danger',
                        'contacted' => 'warning',
                        'in_progress' => 'info',
                        'closed' => 'success',
                        'cancelled' => 'gray',
                        default => 'primary',
                    }),

                Tables\Columns\TextColumn::make('created_at')
                    ->label(__('Date'))
                    ->dateTime('d.m.Y H:i')
                    ->sortable(),
            ])
            ->filters([
                Tables\Filters\SelectFilter::make('status')
                    ->label(__('By Status'))
                    ->options([
                        'new' => __('New'),
                        'contacted' => __('Contacted'),
                        'in_progress' => __('In Progress'),
                        'closed' => __('Closed'),
                        'cancelled' => __('Cancelled'),
                    ]),
                Tables\Filters\SelectFilter::make('type')
                    ->label(__('By Type'))
                    ->options([
                        'contact' => __('General Inquiry'),
                        'company' => __('Company / Employer'),
                        'candidate' => 'Aday',
                        'bug_report' => __('Bug Report'),
                        'other' => __('Other'),
                    ]),
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
            'index' => Pages\ListInquiries::route('/'),
            'create' => Pages\CreateInquiry::route('/create'),
            'edit' => Pages\EditInquiry::route('/{record}/edit'),
        ];
    }
}
