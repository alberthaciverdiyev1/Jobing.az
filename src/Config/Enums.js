const Enums = Object.freeze({
    JobTypes: {
        FULL_TIME: 0x001,
        PART_TIME: 0x002,
        CONTRACT: 0x003,
        INTERNSHIP: 0x004,
        FREELANCE: 0x005,
    },
    Education: {
        Secondary: 6,
        Higher: 5,
        IncompleteEducation: 4,
        Bachelor:3,
        Master: 2,
        Doctor: 1
    },
    Experience: {
        Entry: 1,
        Middle: 2,
        Senior: 3,
        Director: 4,
    },
    Sites:{
        BossAz:'boss.az', 
        BusyAz:'https://busy.az',
        SmartJobAz:'smartjob.az',
        OfferAz:'offer.az',
        HelloJobAz:'hellojob.az',
        JobSearchAz:'jobsearch.az'
    },
    SitesWithId:{
        BossAz:'0x001', 
        BusyAz:'0x002',
        SmartJobAz:'0x003',
        OfferAz:'0x004',
        HelloJobAz:'0x005',
        JobSearchAz:'0x006'
    },

    LimitPerRequest:10,

    Cities:{
        JobSearchAz:{ "17647": "Ağcabədi", "17648": "Ağdam", "17649": "Ağdaş", "17650": "Ağdərə", "17651": "Ağstafa", "17652": "Ağsu", "17653": "Astara", "17654": "Babək",
            "17655": "Bakı", "17656": "Balakən", "17657": "Beyləqan", "17658": "Bərdə", "17659": "Biləsuvar", "17660": "Cəbrayıl", "17661": "Cəlilabad", "17662": "Culfa", "17663": "Daşkəsən",
            "17664": "Dəliməmmədli", "17665": "Xocalı", "17666": "Füzuli", "17667": "Gədəbəy", "17668": "Gəncə", "17669": "Goranboy", "17670": "Göyçay", "17671": "Göygöl", "17672": "Göytəpə",
            "17673": "Hacıqabul", "17674": "Horadiz", "17675": "Xaçmaz", "17676": "Xankəndi", "17677": "Xocavənd", "17678": "Xırdalan", "17679": "Xızı", "17680": "Xudat", "17681": "İmişli",
            "17682": "İsmayıllı", "17683": "Kəlbəcər", "17684": "Kürdəmir", "17685": "Qax", "17686": "Qazax", "17687": "Qəbələ", "17688": "Qobustan", "17689": "Qovlar", "17690": "Quba",
            "17691": "Qubadlı", "17692": "Qusar", "17693": "Laçın", "17694": "Lerik", "17695": "Lənkəran", "17696": "Liman", "17697": "Masallı", "17698": "Mingəçevir", "17699": "Naftalan",
            "17700": "Naxçıvan", "17701": "Neftçala", "17702": "Oğuz", "17703": "Ordubad", "17704": "Saatlı", "17705": "Sabirabad", "17706": "Salyan", "17707": "Samux", "17708": "Siyəzən",
            "17709": "Sumqayıt", "17710": "Şabran", "17711": "Şahbuz", "17712": "Şamaxı", "17713": "Şəki", "17714": "Şəmkir", "17715": "Şərur", "17716": "Şirvan", "17717": "Şuşa",
            "17718": "Tərtər", "17719": "Tovuz", "17720": "Ucar", "17721": "Yardımlı", "17722": "Yevlax", "17723": "Zaqatala", "17724": "Zəngilan", "17725": "Zərdab"
        }
    }

});

export default Enums;
