<?php

namespace App\Enums;

enum CityEnum: string
{
    case LEFKOSA = 'Lefkoşa';
    case GONYELI = 'Gönyeli';
    case DEGIRMENLIK = 'Değirmenlik';
    case ALAYKOY = 'Alayköy';
    case HASPOLAT = 'Haspolat';
    case GIRNE = 'Girne';
    case ALSANCAK = 'Alsancak';
    case LAPTA = 'Lapta';
    case CATALKOY = 'Çatalköy';
    case KARAMAN = 'Karaman';
    case KARAOGLANOGLU = 'Karaoğlanoğlu';
    case ESENTEPE = 'Esentepe';
    case DIKMEN = 'Dikmen';
    case TATLISU = 'Tatlısu';
    case GAZIMAGUSA = 'Gazimağusa';
    case MARAS = 'Maraş';
    case ISKELE = 'İskele';
    case BOGAZ = 'Boğaz';
    case YENIBOGAZICI = 'Yeniboğaziçi';
    case GECITKALE = 'Geçitkale';
    case AKDOGAN = 'Akdoğan';
    case SERDARLI = 'Serdarlı';
    case BEYARMUDU = 'Beyarmudu';
    case PASAKOY = 'Paşaköy';
    case VADILI = 'Vadili';
    case MEHMETCIK = 'Mehmetçik';
    case YENIERENKOY = 'Yenierenköy';
    case DIPKARPAZ = 'Dipkarpaz';
    case BUYUKKONUK = 'Büyükkonuk';
    case GUZELYURT = 'Güzelyurt';
    case KALKANLI = 'Kalkanlı';
    case LEFKE = 'Lefke';
    case GEMIKONAGI = 'Gemikonağı';
    case ERCAN = 'Ercan';
    case REMOTE = 'Uzaktan';

    /** İngilizce adı (çeviri anahtarı olarak kullanılır). */
    public function englishName(): string
    {
        return match ($this) {
            self::LEFKOSA => 'Nicosia',
            self::GONYELI => 'Gonyeli',
            self::DEGIRMENLIK => 'Kythrea',
            self::ALAYKOY => 'Alaykoy',
            self::HASPOLAT => 'Haspolat',
            self::GIRNE => 'Kyrenia',
            self::ALSANCAK => 'Alsancak',
            self::LAPTA => 'Lapithos',
            self::CATALKOY => 'Catalkoy',
            self::KARAMAN => 'Karmi',
            self::KARAOGLANOGLU => 'Karaoglanoglu',
            self::ESENTEPE => 'Esentepe',
            self::DIKMEN => 'Dikmen',
            self::TATLISU => 'Tatlisu',
            self::GAZIMAGUSA => 'Famagusta',
            self::MARAS => 'Varosha',
            self::ISKELE => 'Trikomo',
            self::BOGAZ => 'Bogaz',
            self::YENIBOGAZICI => 'Yenibogazici',
            self::GECITKALE => 'Lefkoniko',
            self::AKDOGAN => 'Lysi',
            self::SERDARLI => 'Serdarli',
            self::BEYARMUDU => 'Beyarmudu',
            self::PASAKOY => 'Pasakoy',
            self::VADILI => 'Vadili',
            self::MEHMETCIK => 'Mehmetcik',
            self::YENIERENKOY => 'Yialousa',
            self::DIPKARPAZ => 'Rizokarpaso',
            self::BUYUKKONUK => 'Buyukkonuk',
            self::GUZELYURT => 'Morphou',
            self::KALKANLI => 'Kalkanli',
            self::LEFKE => 'Lefka',
            self::GEMIKONAGI => 'Gemikonagi',
            self::ERCAN => 'Ercan',
            self::REMOTE => 'Remote',
        };
    }

    public static function options(): array
    {
        $options = [];
        foreach (self::cases() as $case) {
            $options[$case->value] = __('cities.' . $case->englishName());
        }
        return $options;
    }
}
