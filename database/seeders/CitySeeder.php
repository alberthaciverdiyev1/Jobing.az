<?php

namespace Database\Seeders;

use App\Modules\JobAttribute\Models\City;
use Illuminate\Database\Seeder;

class CitySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $cities = [
            ['name' => ['az' => 'Lefkoşa', 'en' => 'Nicosia', 'tr' => 'Lefkoşa', 'ru' => 'Никосия'], 'slug' => 'lefkosa', 'order' => 1],
            ['name' => ['az' => 'Gönyeli', 'en' => 'Gonyeli', 'tr' => 'Gönyeli', 'ru' => 'Гёнйели'], 'slug' => 'gonyeli', 'order' => 2],
            ['name' => ['az' => 'Değirmenlik', 'en' => 'Kythrea', 'tr' => 'Değirmenlik', 'ru' => 'Кифрея'], 'slug' => 'degirmenlik', 'order' => 3],
            ['name' => ['az' => 'Alayköy', 'en' => 'Alaykoy', 'tr' => 'Alayköy', 'ru' => 'Алайкёй'], 'slug' => 'alaykoy', 'order' => 4],
            ['name' => ['az' => 'Haspolat', 'en' => 'Haspolat', 'tr' => 'Haspolat', 'ru' => 'Хасполат'], 'slug' => 'haspolat', 'order' => 5],
            ['name' => ['az' => 'Girne', 'en' => 'Kyrenia', 'tr' => 'Girne', 'ru' => 'Кирения'], 'slug' => 'girne', 'order' => 6],
            ['name' => ['az' => 'Alsancak', 'en' => 'Alsancak', 'tr' => 'Alsancak', 'ru' => 'Алсанджак'], 'slug' => 'alsancak', 'order' => 7],
            ['name' => ['az' => 'Lapta', 'en' => 'Lapithos', 'tr' => 'Lapta', 'ru' => 'Лапитос'], 'slug' => 'lapta', 'order' => 8],
            ['name' => ['az' => 'Çatalköy', 'en' => 'Catalkoy', 'tr' => 'Çatalköy', 'ru' => 'Чаталкёй'], 'slug' => 'catalkoy', 'order' => 9],
            ['name' => ['az' => 'Karaman', 'en' => 'Karmi', 'tr' => 'Karaman', 'ru' => 'Карми'], 'slug' => 'karaman', 'order' => 10],
            ['name' => ['az' => 'Karaoğlanoğlu', 'en' => 'Karaoglanoglu', 'tr' => 'Karaoğlanoğlu', 'ru' => 'Караогланоглу'], 'slug' => 'karaoglanoglu', 'order' => 11],
            ['name' => ['az' => 'Esentepe', 'en' => 'Esentepe', 'tr' => 'Esentepe', 'ru' => 'Эсентепе'], 'slug' => 'esentepe', 'order' => 12],
            ['name' => ['az' => 'Dikmen', 'en' => 'Dikmen', 'tr' => 'Dikmen', 'ru' => 'Дикмен'], 'slug' => 'dikmen', 'order' => 13],
            ['name' => ['az' => 'Tatlısu', 'en' => 'Tatlisu', 'tr' => 'Tatlısu', 'ru' => 'Татлысу'], 'slug' => 'tatlisu', 'order' => 14],
            ['name' => ['az' => 'Gazimağusa', 'en' => 'Famagusta', 'tr' => 'Gazimağusa', 'ru' => 'Фамагуста'], 'slug' => 'gazimagusa', 'order' => 15],
            ['name' => ['az' => 'Maraş', 'en' => 'Varosha', 'tr' => 'Maraş', 'ru' => 'Вароша'], 'slug' => 'maras', 'order' => 16],
            ['name' => ['az' => 'İskele', 'en' => 'Trikomo', 'tr' => 'İskele', 'ru' => 'Трикомо'], 'slug' => 'iskele', 'order' => 17],
            ['name' => ['az' => 'Boğaz', 'en' => 'Bogaz', 'tr' => 'Boğaz', 'ru' => 'Боаз'], 'slug' => 'bogaz', 'order' => 18],
            ['name' => ['az' => 'Yeniboğaziçi', 'en' => 'Yenibogazici', 'tr' => 'Yeniboğaziçi', 'ru' => 'Енибогазчи'], 'slug' => 'yenibogazici', 'order' => 19],
            ['name' => ['az' => 'Geçitkale', 'en' => 'Lefkoniko', 'tr' => 'Geçitkale', 'ru' => 'Лефконико'], 'slug' => 'gecitkale', 'order' => 20],
            ['name' => ['az' => 'Akdoğan', 'en' => 'Lysi', 'tr' => 'Akdoğan', 'ru' => 'Лиси'], 'slug' => 'akdogan', 'order' => 21],
            ['name' => ['az' => 'Serdarlı', 'en' => 'Serdarli', 'tr' => 'Serdarlı', 'ru' => 'Сердарлы'], 'slug' => 'serdarli', 'order' => 22],
            ['name' => ['az' => 'Beyarmudu', 'en' => 'Beyarmudu', 'tr' => 'Beyarmudu', 'ru' => 'Бейармуду'], 'slug' => 'beyarmudu', 'order' => 23],
            ['name' => ['az' => 'Paşaköy', 'en' => 'Pasakoy', 'tr' => 'Paşaköy', 'ru' => 'Пашакёй'], 'slug' => 'pasakoy', 'order' => 24],
            ['name' => ['az' => 'Vadili', 'en' => 'Vadili', 'tr' => 'Vadili', 'ru' => 'Вадили'], 'slug' => 'vadili', 'order' => 25],
            ['name' => ['az' => 'Mehmetçik', 'en' => 'Mehmetcik', 'tr' => 'Mehmetçik', 'ru' => 'Мехметчик'], 'slug' => 'mehmetcik', 'order' => 26],
            ['name' => ['az' => 'Yenierenköy', 'en' => 'Yialousa', 'tr' => 'Yenierenköy', 'ru' => 'Ялуса'], 'slug' => 'yenierenkoy', 'order' => 27],
            ['name' => ['az' => 'Dipkarpaz', 'en' => 'Rizokarpaso', 'tr' => 'Dipkarpaz', 'ru' => 'Ризокарпасо'], 'slug' => 'dipkarpaz', 'order' => 28],
            ['name' => ['az' => 'Büyükkonuk', 'en' => 'Buyukkonuk', 'tr' => 'Büyükkonuk', 'ru' => 'Бюйюкконук'], 'slug' => 'buyukkonuk', 'order' => 29],
            ['name' => ['az' => 'Güzelyurt', 'en' => 'Morphou', 'tr' => 'Güzelyurt', 'ru' => 'Морфу'], 'slug' => 'guzelyurt', 'order' => 30],
            ['name' => ['az' => 'Kalkanlı', 'en' => 'Kalkanli', 'tr' => 'Kalkanlı', 'ru' => 'Калканлы'], 'slug' => 'kalkanli', 'order' => 31],
            ['name' => ['az' => 'Lefke', 'en' => 'Lefka', 'tr' => 'Lefke', 'ru' => 'Лефка'], 'slug' => 'lefke', 'order' => 32],
            ['name' => ['az' => 'Gemikonağı', 'en' => 'Gemikonagi', 'tr' => 'Gemikonağı', 'ru' => 'Гемиконагы'], 'slug' => 'gemikonagi', 'order' => 33],
            ['name' => ['az' => 'Ercan', 'en' => 'Ercan', 'tr' => 'Ercan', 'ru' => 'Эрджан'], 'slug' => 'ercan', 'order' => 34],
            ['name' => ['az' => 'Məsafədən', 'en' => 'Remote', 'tr' => 'Uzaktan', 'ru' => 'Удалённо'], 'slug' => 'remote', 'order' => 35],
        ];

        foreach ($cities as $cityData) {
            City::updateOrCreate(
                ['slug' => $cityData['slug']],
                [
                    'name' => $cityData['name'],
                    'order' => $cityData['order'],
                    'is_active' => true,
                ]
            );
        }
    }
}
