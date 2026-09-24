<?php

namespace App\Enums;

enum CityEnum: string
{
    case BAKI = 'Bakı';
    case GANCA = 'Gəncə';
    case SUMQAYIT = 'Sumqayıt';
    case NAXCIVAN = 'Naxçıvan';
    case MINGACEVIR = 'Mingəçevir';
    case XIRDALAN = 'Xırdalan';
    case LANKARAN = 'Lənkəran';
    case SEKI = 'Şəki';
    case YEVLAX = 'Yevlax';
    case QABALA = 'Qəbələ';
    case BARDA = 'Bərdə';
    case SIRVAN = 'Şirvan';
    case QUBA = 'Quba';
    case QUSAR = 'Qusar';
    case MASALLI = 'Masallı';
    case XACMAZ = 'Xaçmaz';
    case SAMAXI = 'Şamaxı';
    case SALYAN = 'Salyan';
    case ISMAYILLI = 'İsmayıllı';
    case AGDAM = 'Ağdam';
    case SUSA = 'Şuşa';
    case XANKANDI = 'Xankəndi';
    case FUZULI = 'Füzuli';
    case ZANGILAN = 'Zəngilan';
    case LACIN = 'Laçın';
    case KALBACAR = 'Kəlbəcər';
    case CABRAYIL = 'Cəbrayıl';
    case QUBADLI = 'Qubadlı';
    case REMOTE = 'Remote (Məsafədən)';

    public function englishName(): string
    {
        return match ($this) {
            self::BAKI => 'Baku',
            self::GANCA => 'Ganja',
            self::SUMQAYIT => 'Sumqayit',
            self::NAXCIVAN => 'Nakhchivan',
            self::MINGACEVIR => 'Mingachevir',
            self::XIRDALAN => 'Khirdalan',
            self::LANKARAN => 'Lankaran',
            self::SEKI => 'Shaki',
            self::YEVLAX => 'Yevlakh',
            self::QABALA => 'Gabala',
            self::BARDA => 'Barda',
            self::SIRVAN => 'Shirvan',
            self::QUBA => 'Guba',
            self::QUSAR => 'Gusar',
            self::MASALLI => 'Masalli',
            self::XACMAZ => 'Khachmaz',
            self::SAMAXI => 'Shamakhi',
            self::SALYAN => 'Salyan',
            self::ISMAYILLI => 'Ismayilli',
            self::AGDAM => 'Aghdam',
            self::SUSA => 'Shusha',
            self::XANKANDI => 'Khankendi',
            self::FUZULI => 'Fuzuli',
            self::ZANGILAN => 'Zangilan',
            self::LACIN => 'Lachin',
            self::KALBACAR => 'Kalbajar',
            self::CABRAYIL => 'Jabrayil',
            self::QUBADLI => 'Gubadli',
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

