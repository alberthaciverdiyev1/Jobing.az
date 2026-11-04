<?php

namespace App\Modules\Story\Filament\Resources;

use App\Modules\Story\Filament\Resources\CompanyStoryResource\Pages;
use App\Modules\Story\Models\Story;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;

class CompanyStoryResource extends Resource
{
    protected static ?string $model = Story::class;

    protected static ?string $navigationIcon = 'heroicon-o-play-circle';

    public static function getNavigationGroup(): string
    {
        return __('Content');
    }

    public static function getModelLabel(): string
    {
        return __('Story');
    }

    public static function getPluralModelLabel(): string
    {
        return __('Stories');
    }

    protected static ?int $navigationSort = 6;

    public static function getEloquentQuery(): Builder
    {
        $user = auth()->user();

        return parent::getEloquentQuery()
            ->where(function (Builder $query) use ($user): void {
                $query->where('user_id', $user?->id);

                if ($user?->company_id) {
                    $query->orWhere('company_id', $user->company_id);
                }
            });
    }

    public static function form(Form $form): Form
    {
        return StoryResource::form($form);
    }

    public static function table(Table $table): Table
    {
        return StoryResource::table($table);
    }

    public static function getRelations(): array
    {
        return StoryResource::getRelations();
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListCompanyStories::route('/'),
            'create' => Pages\CreateCompanyStory::route('/create'),
            'edit' => Pages\EditCompanyStory::route('/{record}/edit'),
        ];
    }
}
