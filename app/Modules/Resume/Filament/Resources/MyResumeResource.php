<?php

namespace App\Modules\Resume\Filament\Resources;

use App\Modules\Resume\Filament\Resources\MyResumeResource\Pages;
use App\Modules\Resume\Models\Resume;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;

/**
 * User panelinin kendi CV yönetimi. Yalnızca kullanıcının kendi CV-ləri.
 * Form/şema ResumeResource (admin) ilə eynidir, yalnız kapsam ayrıdır.
 */
class MyResumeResource extends Resource
{
    protected static ?string $model = Resume::class;

    protected static ?string $navigationIcon = 'heroicon-o-identification';
    protected static ?string $navigationLabel = 'CV & Rezümələrim';
    protected static ?string $modelLabel = 'CV / Rezüme';
    protected static ?string $pluralModelLabel = 'CV & Rezümələrim';
    protected static ?int $navigationSort = 3;

    public static function canViewAny(): bool
    {
        return true;
    }

    public static function getEloquentQuery(): Builder
    {
        return parent::getEloquentQuery()->where('user_id', auth()->id());
    }

    public static function form(Form $form): Form
    {
        return ResumeResource::form($form);
    }

    public static function table(Table $table): Table
    {
        return ResumeResource::table($table);
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListMyResumes::route('/'),
            'create' => Pages\CreateMyResume::route('/create'),
            'edit' => Pages\EditMyResume::route('/{record}/edit'),
        ];
    }
}
