<?php

namespace App\Modules\Vacancy\Filament\Resources;

use App\Modules\Vacancy\Filament\Resources\CompanyVacancyResource\Pages;
use App\Modules\Vacancy\Filament\Resources\VacancyResource as AdminVacancyResource;
use App\Modules\Vacancy\Models\Vacancy;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;

/**
 * Company panelinin öz vakansiya yönetimi.
 * Form/şema admin ilə eynidir; kapsam yalnız şirkətin öz elanlarıdır.
 */
class CompanyVacancyResource extends Resource
{
    protected static ?string $model = Vacancy::class;

    protected static ?string $navigationIcon = 'heroicon-o-briefcase';
    protected static ?string $navigationLabel = 'Vakansiyalarım';
    protected static ?string $modelLabel = 'Vakansiya';
    protected static ?string $pluralModelLabel = 'Vakansiyalarım';
    protected static ?int $navigationSort = 1;

    public static function canViewAny(): bool
    {
        return true;
    }

    public static function getEloquentQuery(): Builder
    {
        return parent::getEloquentQuery()->where('company_id', auth()->user()?->company_id);
    }

    public static function form(Form $form): Form
    {
        return AdminVacancyResource::form($form);
    }

    public static function table(Table $table): Table
    {
        return AdminVacancyResource::table($table);
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListCompanyVacancies::route('/'),
            'create' => Pages\CreateCompanyVacancy::route('/create'),
            'edit' => Pages\EditCompanyVacancy::route('/{record}/edit'),
        ];
    }
}
