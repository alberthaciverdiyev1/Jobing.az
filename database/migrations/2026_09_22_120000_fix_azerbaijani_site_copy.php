<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        $setting = DB::table('site_settings')->where('id', 1)->first();
        if ($setting?->footer_description) {
            $descriptions = json_decode($setting->footer_description, true) ?: [];
            if (($descriptions['az'] ?? null) === 'Yazılım, dizayn, məhsul, data və marketinq sahələrində aparıcı şirkətlərin açıq vəzifələrinə ani müraciət edin.') {
                $descriptions['az'] = 'Proqramlaşdırma, dizayn, məhsul, data və marketinq sahələrində aparıcı şirkətlərin açıq vəzifələrinə ani müraciət edin.';
                DB::table('site_settings')->where('id', 1)->update(['footer_description' => json_encode($descriptions, JSON_UNESCAPED_UNICODE)]);
            }
        }

        $seoSetting = DB::table('seo_settings')->where('id', 1)->first();
        if ($seoSetting?->default_meta_description) {
            $descriptions = json_decode($seoSetting->default_meta_description, true) ?: [];
            if (($descriptions['az'] ?? null) === 'Yazılım, dizayn, məhsul, data və marketinq sahələrində aparıcı şirkətlərin açıq vəzifələrinə ani müraciət edin.') {
                $descriptions['az'] = 'Proqramlaşdırma, dizayn, məhsul, data və marketinq sahələrində aparıcı şirkətlərin açıq vəzifələrinə ani müraciət edin.';
                DB::table('seo_settings')->where('id', 1)->update(['default_meta_description' => json_encode($descriptions, JSON_UNESCAPED_UNICODE)]);
            }
        }

        Cache::forget('site_settings_singleton');
        Cache::forget('seo_settings_singleton');
    }

    public function down(): void
    {
    }
};
