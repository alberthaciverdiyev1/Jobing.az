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
            ['name' => ['az' => 'Bakı', 'en' => 'Baku', 'tr' => 'Bakü', 'ru' => 'Баку'], 'slug' => 'baki', 'order' => 1],
            ['name' => ['az' => 'Gəncə', 'en' => 'Ganja', 'tr' => 'Gence', 'ru' => 'Гянджа'], 'slug' => 'ganca', 'order' => 2],
            ['name' => ['az' => 'Sumqayıt', 'en' => 'Sumgait', 'tr' => 'Sumgayıt', 'ru' => 'Сумгаит'], 'slug' => 'sumqayit', 'order' => 3],
            ['name' => ['az' => 'Xırdalan', 'en' => 'Khirdalan', 'tr' => 'Hırdalan', 'ru' => 'Хырдалан'], 'slug' => 'xirdalan', 'order' => 4],
            ['name' => ['az' => 'Naxçıvan', 'en' => 'Nakhchivan', 'tr' => 'Nahçıvan', 'ru' => 'Нахчыван'], 'slug' => 'naxcivan', 'order' => 5],
            ['name' => ['az' => 'Mingəçevir', 'en' => 'Mingachevir', 'tr' => 'Mingeçevir', 'ru' => 'Мингечевир'], 'slug' => 'mingacevir', 'order' => 6],
            ['name' => ['az' => 'Lənkəran', 'en' => 'Lankaran', 'tr' => 'Lenkeran', 'ru' => 'Ленкорань'], 'slug' => 'lankaran', 'order' => 7],
            ['name' => ['az' => 'Şəki', 'en' => 'Sheki', 'tr' => 'Şeki', 'ru' => 'Шеки'], 'slug' => 'seki', 'order' => 8],
            ['name' => ['az' => 'Yevlax', 'en' => 'Yevlakh', 'tr' => 'Yevlah', 'ru' => 'Евлах'], 'slug' => 'yevlax', 'order' => 9],
            ['name' => ['az' => 'Qəbələ', 'en' => 'Gabala', 'tr' => 'Gebele', 'ru' => 'Габала'], 'slug' => 'qabala', 'order' => 10],
            ['name' => ['az' => 'Quba', 'en' => 'Guba', 'tr' => 'Guba', 'ru' => 'Губа'], 'slug' => 'quba', 'order' => 11],
            ['name' => ['az' => 'Qusar', 'en' => 'Gusar', 'tr' => 'Gusar', 'ru' => 'Гусар'], 'slug' => 'qusar', 'order' => 12],
            ['name' => ['az' => 'Xaçmaz', 'en' => 'Khachmaz', 'tr' => 'Haçmaz', 'ru' => 'Хачмаз'], 'slug' => 'xacmaz', 'order' => 13],
            ['name' => ['az' => 'Bərdə', 'en' => 'Barda', 'tr' => 'Berde', 'ru' => 'Барда'], 'slug' => 'barda', 'order' => 14],
            ['name' => ['az' => 'Şirvan', 'en' => 'Shirvan', 'tr' => 'Şirvan', 'ru' => 'Ширван'], 'slug' => 'sirvan', 'order' => 15],
            ['name' => ['az' => 'Şamaxı', 'en' => 'Shamakhi', 'tr' => 'Şamahı', 'ru' => 'Шемаха'], 'slug' => 'samaxi', 'order' => 16],
            ['name' => ['az' => 'İsmayıllı', 'en' => 'Ismayilli', 'tr' => 'İsmayıllı', 'ru' => 'Исмаиллы'], 'slug' => 'ismayilli', 'order' => 17],
            ['name' => ['az' => 'Şuşa', 'en' => 'Shusha', 'tr' => 'Şuşa', 'ru' => 'Шуша'], 'slug' => 'susa', 'order' => 18],
            ['name' => ['az' => 'Xankəndi', 'en' => 'Khankendi', 'tr' => 'Hankendi', 'ru' => 'Ханкенди'], 'slug' => 'xankandi', 'order' => 19],
            ['name' => ['az' => 'Ağdam', 'en' => 'Aghdam', 'tr' => 'Ağdam', 'ru' => 'Агдам'], 'slug' => 'agdam', 'order' => 20],
            ['name' => ['az' => 'Füzuli', 'en' => 'Fuzuli', 'tr' => 'Fuzuli', 'ru' => 'Физули'], 'slug' => 'fuzuli', 'order' => 21],
            ['name' => ['az' => 'Laçın', 'en' => 'Lachin', 'tr' => 'Laçın', 'ru' => 'Лачин'], 'slug' => 'lacin', 'order' => 22],
            ['name' => ['az' => 'Kəlbəcər', 'en' => 'Kalbajar', 'tr' => 'Kelbecer', 'ru' => 'Кельбаджар'], 'slug' => 'kalbacar', 'order' => 23],
            ['name' => ['az' => 'Cəbrayıl', 'en' => 'Jabrayil', 'tr' => 'Cebrail', 'ru' => 'Джебраил'], 'slug' => 'cabrayil', 'order' => 24],
            ['name' => ['az' => 'Zəngilan', 'en' => 'Zangilan', 'tr' => 'Zengilan', 'ru' => 'Зангилан'], 'slug' => 'zangilan', 'order' => 25],
            ['name' => ['az' => 'Qubadlı', 'en' => 'Gubadli', 'tr' => 'Gubadlı', 'ru' => 'Губадлы'], 'slug' => 'qubadli', 'order' => 26],
            ['name' => ['az' => 'Ağcabədi', 'en' => 'Aghjabadi', 'tr' => 'Ağcabedi', 'ru' => 'Агджабеди'], 'slug' => 'agcabedi', 'order' => 27],
            ['name' => ['az' => 'Ağdaş', 'en' => 'Agdash', 'tr' => 'Ağdaş', 'ru' => 'Агдаш'], 'slug' => 'agdas', 'order' => 28],
            ['name' => ['az' => 'Ağdərə', 'en' => 'Aghdara', 'tr' => 'Ağdere', 'ru' => 'Агдере'], 'slug' => 'agdere', 'order' => 29],
            ['name' => ['az' => 'Ağstafa', 'en' => 'Agstafa', 'tr' => 'Ağstafa', 'ru' => 'Агстафа'], 'slug' => 'agstafa', 'order' => 30],
            ['name' => ['az' => 'Ağsu', 'en' => 'Agsu', 'tr' => 'Ağsu', 'ru' => 'Ахсу'], 'slug' => 'agsu', 'order' => 31],
            ['name' => ['az' => 'Astara', 'en' => 'Astara', 'tr' => 'Astara', 'ru' => 'Астара'], 'slug' => 'astara', 'order' => 32],
            ['name' => ['az' => 'Balakən', 'en' => 'Balakan', 'tr' => 'Balaken', 'ru' => 'Балакен'], 'slug' => 'balaken', 'order' => 33],
            ['name' => ['az' => 'Beyləqan', 'en' => 'Beylagan', 'tr' => 'Beylegan', 'ru' => 'Бейлаган'], 'slug' => 'beyleqan', 'order' => 34],
            ['name' => ['az' => 'Biləsuvar', 'en' => 'Bilasuvar', 'tr' => 'Bilesuvar', 'ru' => 'Билясувар'], 'slug' => 'bilesuvar', 'order' => 35],
            ['name' => ['az' => 'Cəlilabad', 'en' => 'Jalilabad', 'tr' => 'Celilabad', 'ru' => 'Джалилабад'], 'slug' => 'calilabad', 'order' => 36],
            ['name' => ['az' => 'Culfa', 'en' => 'Julfa', 'tr' => 'Culfa', 'ru' => 'Джульфа'], 'slug' => 'culfa', 'order' => 37],
            ['name' => ['az' => 'Daşkəsən', 'en' => 'Dashkasan', 'tr' => 'Daşkesen', 'ru' => 'Дашкесан'], 'slug' => 'daskesen', 'order' => 38],
            ['name' => ['az' => 'Əli-Bayramlı', 'en' => 'Ali-Bayramli', 'tr' => 'Ali Bayramlı', 'ru' => 'Али-Байрамлы'], 'slug' => 'eli-bayramli', 'order' => 39],
            ['name' => ['az' => 'Gədəbəy', 'en' => 'Gadabay', 'tr' => 'Gedebey', 'ru' => 'Гедабек'], 'slug' => 'gedebey', 'order' => 40],
            ['name' => ['az' => 'Goranboy', 'en' => 'Goranboy', 'tr' => 'Goranboy', 'ru' => 'Геранбой'], 'slug' => 'goranboy', 'order' => 41],
            ['name' => ['az' => 'Göyçay', 'en' => 'Goychay', 'tr' => 'Göyçay', 'ru' => 'Геокчай'], 'slug' => 'goycay', 'order' => 42],
            ['name' => ['az' => 'Göygöl', 'en' => 'Goygol', 'tr' => 'Göygöl', 'ru' => 'Гейгель'], 'slug' => 'goygol', 'order' => 43],
            ['name' => ['az' => 'Göytəpə', 'en' => 'Goytapa', 'tr' => 'Göytepe', 'ru' => 'Гейтепе'], 'slug' => 'goytepe', 'order' => 44],
            ['name' => ['az' => 'Hacıqabul', 'en' => 'Hajigabul', 'tr' => 'Hacıgabul', 'ru' => 'Гаджигабул'], 'slug' => 'haciqabul', 'order' => 45],
            ['name' => ['az' => 'İmişli', 'en' => 'Imishli', 'tr' => 'İmişli', 'ru' => 'Имишли'], 'slug' => 'imisli', 'order' => 46],
            ['name' => ['az' => 'Kürdəmir', 'en' => 'Kurdamir', 'tr' => 'Kürdemir', 'ru' => 'Кюрдамир'], 'slug' => 'kurdemir', 'order' => 47],
            ['name' => ['az' => 'Lerik', 'en' => 'Lerik', 'tr' => 'Lerik', 'ru' => 'Лерик'], 'slug' => 'lerik', 'order' => 48],
            ['name' => ['az' => 'Masallı', 'en' => 'Masalli', 'tr' => 'Masallı', 'ru' => 'Масаллы'], 'slug' => 'masalli', 'order' => 49],
            ['name' => ['az' => 'Naftalan', 'en' => 'Naftalan', 'tr' => 'Naftalan', 'ru' => 'Нафталан'], 'slug' => 'naftalan', 'order' => 50],
            ['name' => ['az' => 'Neftçala', 'en' => 'Neftchala', 'tr' => 'Neftçala', 'ru' => 'Нефтечала'], 'slug' => 'neftcala', 'order' => 51],
            ['name' => ['az' => 'Oğuz', 'en' => 'Oguz', 'tr' => 'Oğuz', 'ru' => 'Огуз'], 'slug' => 'oguz', 'order' => 52],
            ['name' => ['az' => 'Ordubad', 'en' => 'Ordubad', 'tr' => 'Ordubad', 'ru' => 'Ордубад'], 'slug' => 'ordubad', 'order' => 53],
            ['name' => ['az' => 'Qaradağ', 'en' => 'Garadagh', 'tr' => 'Karadağ', 'ru' => 'Гарадаг'], 'slug' => 'qaradag', 'order' => 54],
            ['name' => ['az' => 'Qax', 'en' => 'Gakh', 'tr' => 'Gah', 'ru' => 'Гах'], 'slug' => 'qax', 'order' => 55],
            ['name' => ['az' => 'Qazax', 'en' => 'Gazakh', 'tr' => 'Kazah', 'ru' => 'Газах'], 'slug' => 'qazax', 'order' => 56],
            ['name' => ['az' => 'Qobustan', 'en' => 'Gobustan', 'tr' => 'Gobustan', 'ru' => 'Гобустан'], 'slug' => 'qobustan', 'order' => 57],
            ['name' => ['az' => 'Saatlı', 'en' => 'Saatli', 'tr' => 'Saatlı', 'ru' => 'Саатлы'], 'slug' => 'saatli', 'order' => 58],
            ['name' => ['az' => 'Sabirabad', 'en' => 'Sabirabad', 'tr' => 'Sabirabad', 'ru' => 'Сабирабад'], 'slug' => 'sabirabad', 'order' => 59],
            ['name' => ['az' => 'Şabran', 'en' => 'Shabran', 'tr' => 'Şabran', 'ru' => 'Шабран'], 'slug' => 'sabran', 'order' => 60],
            ['name' => ['az' => 'Şahbuz', 'en' => 'Shahbuz', 'tr' => 'Şahbuz', 'ru' => 'Шахбуз'], 'slug' => 'sahbuz', 'order' => 61],
            ['name' => ['az' => 'Salyan', 'en' => 'Salyan', 'tr' => 'Salyan', 'ru' => 'Сальяны'], 'slug' => 'salyan', 'order' => 62],
            ['name' => ['az' => 'Samux', 'en' => 'Samukh', 'tr' => 'Samuh', 'ru' => 'Самух'], 'slug' => 'samux', 'order' => 63],
            ['name' => ['az' => 'Şəmkir', 'en' => 'Shamkir', 'tr' => 'Şemkir', 'ru' => 'Шамкир'], 'slug' => 'semkir', 'order' => 64],
            ['name' => ['az' => 'Şərur', 'en' => 'Sharur', 'tr' => 'Şerur', 'ru' => 'Шарур'], 'slug' => 'serur', 'order' => 65],
            ['name' => ['az' => 'Siyəzən', 'en' => 'Siyazan', 'tr' => 'Siyezen', 'ru' => 'Сиязань'], 'slug' => 'siyezen', 'order' => 66],
            ['name' => ['az' => 'Tərtər', 'en' => 'Tartar', 'tr' => 'Terter', 'ru' => 'Тертер'], 'slug' => 'terter', 'order' => 67],
            ['name' => ['az' => 'Tovuz', 'en' => 'Tovuz', 'tr' => 'Tovuz', 'ru' => 'Товуз'], 'slug' => 'tovuz', 'order' => 68],
            ['name' => ['az' => 'Ucar', 'en' => 'Ujar', 'tr' => 'Ucar', 'ru' => 'Уджар'], 'slug' => 'ucar', 'order' => 69],
            ['name' => ['az' => 'Xızı', 'en' => 'Khizi', 'tr' => 'Hızı', 'ru' => 'Хызы'], 'slug' => 'xizi', 'order' => 70],
            ['name' => ['az' => 'Xocalı', 'en' => 'Khojaly', 'tr' => 'Hocalı', 'ru' => 'Ходжалы'], 'slug' => 'xocali', 'order' => 71],
            ['name' => ['az' => 'Xocavənd', 'en' => 'Khojavend', 'tr' => 'Hocavend', 'ru' => 'Ходжавенд'], 'slug' => 'xocavend', 'order' => 72],
            ['name' => ['az' => 'Xudat', 'en' => 'Khudat', 'tr' => 'Hudat', 'ru' => 'Худат'], 'slug' => 'xudat', 'order' => 73],
            ['name' => ['az' => 'Yardımlı', 'en' => 'Yardimli', 'tr' => 'Yardımlı', 'ru' => 'Ярдымлы'], 'slug' => 'yardimli', 'order' => 74],
            ['name' => ['az' => 'Zaqatala', 'en' => 'Zagatala', 'tr' => 'Zakatala', 'ru' => 'Загатала'], 'slug' => 'zaqatala', 'order' => 75],
            ['name' => ['az' => 'Zərdab', 'en' => 'Zardab', 'tr' => 'Zerdab', 'ru' => 'Зердаб'], 'slug' => 'zerdab', 'order' => 76],
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
