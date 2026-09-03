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

    public static function options(): array
    {
        $options = [];
        foreach (self::cases() as $case) {
            $options[$case->value] = $case->value;
        }
        return $options;
    }
}
