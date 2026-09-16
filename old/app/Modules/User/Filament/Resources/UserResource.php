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
    protected static ?string $navigationGroup = 'İstifadəçi İdarəetməsi';
    protected static ?string $modelLabel = 'İstifadəçi';
    protected static ?string $pluralModelLabel = 'İstifadəçilər';
    protected static ?int $navigationSort = 1;

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Section::make('Hesab Məlumatları')
                    ->schema([
                        Forms\Components\TextInput::make('name')
                            ->label('Ad Soyad')
                            ->required()
                            ->maxLength(255),

                        Forms\Components\TextInput::make('email')
                            ->label('E-Posta')
                            ->email()
                            ->required()
                            ->unique(ignoreRecord: true)
                            ->maxLength(255),

                        Forms\Components\TextInput::make('password')
                            ->label('Şifrə')
                            ->password()
                            ->dehydrated(fn ($state) => filled($state))
                            ->required(fn (string $operation): bool => $operation === 'create')
                            ->maxLength(255)
                            ->helperText('Yalnız dəyişdirmək istədikdə doldurun.')
                            ->afterStateHydrated(fn (Forms\Components\TextInput $component) => $component->state(''))
                            ->dehydrateStateUsing(fn ($state) => filled($state) ? Hash::make($state) : $state),

                        Forms\Components\Select::make('user_type')
                            ->label('Hesab Tipi')
                            ->options([
                                'user' => 'Şəxsi istifadəçi',
                                'company' => 'Şirkət',
                                'admin' => 'Admin',
                            ])
                            ->required()
                            ->default('user')
                            ->live(),

                        Forms\Components\Toggle::make('is_admin')
                            ->label('Admin')
                            ->helperText('Admin panelinə giriş verir.'),

                        Forms\Components\Select::make('company_id')
                            ->label('Şirkət')
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
                    ->label('Ad Soyad')
                    ->searchable()
                    ->sortable()
                    ->weight('bold'),

                Tables\Columns\TextColumn::make('email')
                    ->label('E-Posta')
                    ->searchable()
                    ->sortable()
                    ->copyable(),

                Tables\Columns\TextColumn::make('user_type')
                    ->label('Tip')
                    ->badge()
                    ->formatStateUsing(fn (string $state): string => match ($state) {
                        'company' => 'Şirkət',
                        'admin' => 'Admin',
                        default => 'İstifadəçi',
                    })
                    ->color(fn (string $state): string => match ($state) {
                        'admin' => 'danger',
                        'company' => 'info',
                        default => 'success',
                    })
                    ->sortable(),

                Tables\Columns\IconColumn::make('is_admin')
                    ->label('Admin')
                    ->boolean()
                    ->sortable(),

                Tables\Columns\TextColumn::make('company.name')
                    ->label('Şirkət')
                    ->searchable()
                    ->placeholder('—'),

                Tables\Columns\TextColumn::make('applications_count')
                    ->label('Başvuru')
                    ->counts('applications')
                    ->badge()
                    ->color('primary')
                    ->sortable(),

                Tables\Columns\TextColumn::make('created_at')
                    ->label('Qeydiyyat')
                    ->dateTime('d.m.Y')
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                Tables\Filters\SelectFilter::make('user_type')
                    ->label('Hesab Tipi')
                    ->options([
                        'user' => 'İstifadəçi',
                        'company' => 'Şirkət',
                        'admin' => 'Admin',
                    ]),
                Tables\Filters\TernaryFilter::make('is_admin')
                    ->label('Admin'),
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
            //
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
