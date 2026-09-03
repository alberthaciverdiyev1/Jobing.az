<?php

namespace App\Modules\JobSeeker\Filament\Concerns;

use App\Modules\Category\Models\Category;
use App\Modules\JobAttribute\Models\City;
use App\Modules\JobAttribute\Models\ExperienceLevel;
use App\Modules\JobAttribute\Models\JobType;
use App\Modules\JobAttribute\Models\Skill;
use App\Modules\JobAttribute\Models\WorkplaceType;

/**
 * İş axtarışı elanı formlarında skiller, admin tarafından eklenen Skill
 * kataloğundan gelir ve seçilen kategorinin (alt ağacı dahil) üzerinden
 * filtrelenir. Kullanıcıdan ayrıca alt kategori seçmesi istenmez.
 */
trait HasSkillPicker
{
    /**
     * Seçilen kategoriye (kendisi + alt kategorileri) ait aktif skiller.
     * Kategorisiz (genel) skiller her zaman gösterilir.
     *
     * @return array<string, string>  [skill adı => skill adı]
     */
    public static function skillOptions(?int $categoryId = null): array
    {
        $query = Skill::active();

        if ($categoryId) {
            $ids = static::categorySubtreeIds($categoryId);
            $query->where(function ($q) use ($ids) {
                $q->whereIn('category_id', $ids)
                    ->orWhereNull('category_id');
            });
        }

        return $query->get()
            ->mapWithKeys(fn (Skill $skill) => [(string) $skill->name => (string) $skill->name])
            ->all();
    }

    /**
     * Üst (ana) kategori seçenekleri.
     *
     * @return array<string, string>  [id => ad]
     */
    public static function parentCategoryOptions(): array
    {
        return Category::parents()
            ->get()
            ->mapWithKeys(fn ($category) => [(string) $category->id => $category->name])
            ->all();
    }

    /**
     * Seçilen üst kategorinin alt kategorileri (subcategory).
     * Üst kategori seçilmeden önce boş dizi döner.
     *
     * @return array<string, string>  [id => ad]
     */
    public static function subcategoryOptions(?int $parentCategoryId = null): array
    {
        if (! $parentCategoryId) {
            return [];
        }

        return Category::where('parent_id', $parentCategoryId)
            ->get()
            ->mapWithKeys(fn ($category) => [(string) $category->id => $category->name])
            ->all();
    }

    /**
     * Backend'deki City kayıtlarından şehir seçenekleri.
     *
     * @return array<string, string>  [şəhər adı => şəhər adı]
     */
    public static function cityOptions(): array
    {
        return City::all()
            ->sortBy(fn (City $city) => is_array($city->name) ? ($city->name['az'] ?? reset($city->name)) : $city->name)
            ->map(fn (City $city) => is_array($city->name) ? ($city->name['az'] ?? reset($city->name)) : $city->name)
            ->filter()
            ->unique()
            ->values()
            ->mapWithKeys(fn (string $cityName) => [$cityName => $cityName])
            ->all();
    }

    /**
     * Translatable (json) name kolonu Postgres'te ORDER BY yapılamaz;
     * bu yüzden seçenekler localized PHP tarafında üretilir.
     *
     * @return array<string, string>  [id => lokalize ad]
     */
    public static function jobTypeOptions(): array
    {
        return static::localizedIdLabelOptions(JobType::active()->get());
    }

    public static function workplaceTypeOptions(): array
    {
        return static::localizedIdLabelOptions(WorkplaceType::active()->get());
    }

    public static function experienceLevelOptions(): array
    {
        return static::localizedIdLabelOptions(ExperienceLevel::active()->get());
    }

    public static function categoryOptions(): array
    {
        return static::localizedIdLabelOptions(Category::all());
    }

    /**
     * [id => lokalize ad] üretir; json name kolonunu DB'de sıralamaz.
     *
     * @param  iterable<\Illuminate\Database\Eloquent\Model>  $models
     * @return array<string, string>
     */
    protected static function localizedIdLabelOptions(iterable $models): array
    {
        return collect($models)
            ->sortBy(fn ($model) => (string) $model->getAttribute('name'))
            ->mapWithKeys(fn ($model) => [(string) $model->getKey() => (string) $model->getAttribute('name')])
            ->all();
    }

    /**
     * Seçilen kategori id'si + tüm alt kategorilerinin id'leri (tüm derinlik).
     *
     * @return array<int, int>
     */
    protected static function categorySubtreeIds(int $categoryId): array
    {
        $ids = [$categoryId];
        $level = [$categoryId];

        do {
            $level = Category::whereIn('parent_id', $level)->pluck('id')->all();
            $ids = array_merge($ids, $level);
        } while (! empty($level));

        return array_values(array_unique($ids));
    }
}
