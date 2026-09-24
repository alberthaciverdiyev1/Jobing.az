<?php

namespace App\Modules\User\Filament\Resources;

use App\Modules\Company\Models\Company;
use App\Modules\User\Filament\Resources\UserResource\Pages;
use App\Models\User;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\Hash;

class UserResource extends Resource
{
    protected static ?string $model = User::class;

    protected static ?string $navigationIcon = 'heroicon-o-users';
    protected static ?string $navigationGroup = null;

    public static function getNavigationGroup(): string
    {
        return __('User Management');
    }
    protected static ?string $modelLabel = null;

    public static function getModelLabel(): string
    {
        return __('User');
    }
    protected static ?string $pluralModelLabel = null;

    public static function getPluralModelLabel(): string
    {
        return __('Users');
    }
    protected static ?int $navigationSort = 1;

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Section::make(__('Account Information'))
                    ->schema([
                        Forms\Components\TextInput::make('name')
                            ->label(__('Full Name'))
                            ->required()
                            ->maxLength(255),

                        Forms\Components\TextInput::make('email')
                            ->label(__('Email'))
                            ->email()
                            ->required()
                            ->unique(ignoreRecord: true)
                            ->maxLength(255),

                        Forms\Components\TextInput::make('password')
                            ->label(__('Password'))
                            ->password()
                            ->dehydrated(fn ($state) => filled($state))
                            ->required(fn (string $operation): bool => $operation === 'create')
                            ->maxLength(255)
                            ->helperText(__('Fill in only if you want to change it.'))
                            ->afterStateHydrated(fn (Forms\Components\TextInput $component) => $component->state(''))
                            ->dehydrateStateUsing(fn ($state) => filled($state) ? Hash::make($state) : $state),

                        Forms\Components\Select::make('user_type')
                            ->label(__('Account Type'))
                            ->options([
                                'user' => 'Şəxsi istifadəçi',
                                'company' => 'Şirkət',
                                'admin' => 'Admin',
                            ])
                            ->required()
                            ->default('user')
                            ->live(),

                        Forms\Components\Toggle::make('is_admin')
                            ->label(__('Admin'))
                            ->helperText(__('Grants access to the admin panel.')),

                        Forms\Components\Select::make('company_id')
                            ->label(__('Company'))
                            ->relationship('company', 'name')
                            ->searchable()
                            ->preload()
                            ->visible(fn (Forms\Get $get): bool => $get('user_type') === 'company'),
                    ])->columns(2),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('name')
                    ->label(__('Full Name'))
                    ->searchable()
                    ->sortable()
                    ->weight('bold'),

                Tables\Columns\TextColumn::make('email')
                    ->label(__('Email'))
                    ->searchable()
                    ->sortable()
                    ->copyable(),

                Tables\Columns\TextColumn::make('user_type')
                    ->label(__('Type'))
                    ->badge()
                    ->formatStateUsing(fn (string $state): string => match ($state) {
                        'company' => 'Şirkət',
                        'admin' => 'Admin',
                        default => __('User'),
                    })
                    ->color(fn (string $state): string => match ($state) {
                        'admin' => 'danger',
                        'company' => 'info',
                        default => 'success',
                    })
                    ->sortable(),

                Tables\Columns\IconColumn::make('is_admin')
                    ->label(__('Admin'))
                    ->boolean()
                    ->sortable(),

                Tables\Columns\TextColumn::make('company.name')
                    ->label(__('Company'))
                    ->searchable()
                    ->placeholder('—'),

                Tables\Columns\TextColumn::make('applications_count')
                    ->label(__('Application'))
                    ->counts('applications')
                    ->badge()
                    ->color('primary')
                    ->sortable(),

                Tables\Columns\TextColumn::make('created_at')
                    ->label(__('Registration'))
                    ->dateTime('d.m.Y')
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                Tables\Filters\SelectFilter::make('user_type')
                    ->label(__('Account Type'))
                    ->options([
                        'user' => __('User'),
                        'company' => 'Şirkət',
                        'admin' => 'Admin',
                    ]),
                Tables\Filters\TernaryFilter::make('is_admin')
                    ->label(__('Admin')),
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

    public static function getRelations(): array
    {
        return [
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListUsers::route('/'),
            'create' => Pages\CreateUser::route('/create'),
            'edit' => Pages\EditUser::route('/{record}/edit'),
        ];
    }
}
