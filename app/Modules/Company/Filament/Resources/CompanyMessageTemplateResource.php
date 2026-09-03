<?php

namespace App\Modules\Company\Filament\Resources;

use App\Modules\Company\Filament\Resources\CompanyMessageTemplateResource\Pages;
use App\Modules\Company\Filament\Resources\MessageTemplateResource as AdminTemplateResource;
use App\Modules\Company\Models\MessageTemplate;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;

/**
 * Company panelinə özel mesaj şablonu yönetimi (yalnız şirkətin öz şablonları).
 */
class CompanyMessageTemplateResource extends Resource
{
    protected static ?string $model = MessageTemplate::class;

    protected static ?string $navigationIcon = 'heroicon-o-chat-bubble-left-right';
    protected static ?string $navigationLabel = 'Mesaj Şablonları';
    protected static ?string $pluralModelLabel = 'Mesaj Şablonları';
    protected static ?int $navigationSort = 5;

    public static function canViewAny(): bool
    {
        return true;
    }

    public static function canCreate(): bool
    {
        return true;
    }

    public static function getEloquentQuery(): Builder
    {
        return parent::getEloquentQuery()->where('company_id', auth()->user()?->company_id);
    }

    public static function form(Form $form): Form
    {
        return AdminTemplateResource::form($form);
    }

    public static function table(Table $table): Table
    {
        return AdminTemplateResource::table($table);
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListCompanyMessageTemplates::route('/'),
            'create' => Pages\CreateCompanyMessageTemplate::route('/create'),
            'edit' => Pages\EditCompanyMessageTemplate::route('/{record}/edit'),
        ];
    }
}
