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
        },
        HelloJobAz:{
                "1": "Bakı", "2": "Gəncə", "3": "Sumqayıt", "5": "Şəki", "6": "Lənkəran", "8": "Göyçay", "7": "Yevlax", "9": "Tovuz", "10": "Qəbələ", "11": "Gədəbəy",
                "12": "Goranboy", "13": "Oğuz", "14": "Zaqatala", "15": "Mingəçevir", "16": "Xızı", "17": "Xırdalan", "20": "Ağstafa", "21": "Ucar", "22": "Göygöl",
                "24": "Xaçmaz", "26": "Yardımlı", "27": "Daşkəsən", "28": "Kürdəmir", "29": "Hacıqabul", "30": "Qax", "31": "Qazax", "32": "Tərtər", "33": "Biləsuvar",
                "34": "Şəmkir", "36": "Quba", "37": "Qusar", "38": "Babək", "39": "Füzuli", "40": "Cəbrayıl", "41": "Salyan", "43": "Astara", "44": "Culfa", "45": "Ağdaş",
                "47": "Masallı", "49": "Beyləqan", "50": "Ağsu", "51": "Qobustan", "52": "Bərdə", "53": "Ordubad", "54": "Balakən", "55": "İsmayıllı", "56": "Şuşa",
                "57": "Samux", "58": "Ağcabədi", "59": "Ağdam", "60": "Dəvəçi", "61": "İmişli", "62": "Saatlı", "63": "Naxçıvan", "64": "Siyəzən", "65": "Şahbuz",
                "66": "Cəlilabad", "67": "Sabirabad", "68": "Neftçala", "69": "Laçın", "70": "Naftalan", "71": "Zərdab", "72": "Şərur", "73": "Qıvraq", "74": "Şirvan", "75": "Şamaxı"
        },
        SmartJobAz:{
            "81": "Abşeron", "11": "Ağcabədi", "58": "Ağdam", "40": "Ağdaş", "82": "Ağdərə", "15": "Ağstafa", "50": "Ağsu", "33": "Astara", "3": "Bakı", "61": "Balakən",
            "35": "Beyləqan", "31": "Bərdə", "57": "Biləsuvar", "80": "Binəqədi", "56": "Cəbrayıl", "27": "Cəlilabad", "47": "Daşkəsən", "37": "Füzuli", "9": "Gədəbəy", 
            "6": "Gəncə", "54": "Goranboy", "12": "Göyçay", "65": "Göygöl", "42": "Hacıqabul", "49": "Hacıqabul", "10": "İmişli", "29": "İsmayıllı", "70": "Kəlbəcər", 
            "32": "Kürdəmir", "69": "Laçın", "52": "Lerik", "22": "Lənkəran", "59": "Lökbatan", "21": "Masallı", "60": "Mehdiabad", "20": "Mingəçevir", "55": "Naftalan", 
            "48": "Naxçıvan", "7": "Neftçala", "53": "Oğuz", "78": "Qarabağ", "67": "Qaradağ", "62": "Qax", "13": "Qazax", "38": "Qəbələ", "71": "Qobustan", "26": "Quba", 
            "72": "Qubadlı", "25": "Qusar", "43": "Saatlı", "34": "Sabirabad", "23": "Şabran", "8": "Salyan", "45": "Şamaxı", "66": "Samux", "73": "Sədərək", "28": "Şəki", 
            "30": "Şəmkir", "64": "Şərur", "36": "Şirvan", "41": "Siyəzən", "17": "Sumqayıt", "74": "Şuşa", "46": "Tərtər", "14": "Tovuz", "63": "Ucar", "19": "Xaçmaz", 
            "76": "Xankəndi", "18": "Xırdalan", "39": "Xızı", "77": "Xocalı", "75": "Xocavənd", "79": "Xudat", "51": "Yardımlı", "24": "Yevlax", "16": "Zaqatala",
            "68": "Zəngilan", "44": "Zərdab"
        },
        OfferAz:{
            "696": "Ağcabədi", "2815": "Ağdam", "849": "Ağdaş", "894": "Ağstafa", "693": "Ağsu", "695": "Astara", "4131": "Babək", "9": "Bakı", "1515": "Balakən", 
            "1190": "Beyləqan", "931": "Bərdə", "1147": "Biləsuvar", "4952": "Cəbrayıl", "750": "Cəlilabad", "4132": "Culfa", "1303": "Daşkəsən", "1273": "Fizuli", 
            "5589": "Füzuli", "2120": "Gədəbəy", "175": "Gəncə", "4880": "Goran", "699": "Goranboy", "694": "Göyçay", "1206": "Göygöl", "742": "Hacıqabul", 
            "692": "İmişli", "1903": "İsmayıllı", "4519": "Kəlbəcər", "3553": "Kəngərli", "951": "Kürdəmir", "1640": "Laçın", "3765": "Lerik", "482": "Lənkəran",
            "332": "Masallı", "1067": "Mingəçevir", "697": "Naftalan", "2069": "Naxçıvan", "1352": "Neftçala", "2523": "Oğuz", "4133": "Ordubad", "812": "Qax", 
            "848": "Qazax", "257": "Qəbələ", "4051": "Qobustan", "5782": "Qovlar", "604": "Quba", "5058": "Qubadlı", "826": "Qusar", "691": "Saatlı", "850": "Sabirabad", 
            "824": "Şabran", "4134": "Şahbuz", "689": "Salyan", "690": "Şamaxı", "616": "Samux", "991": "Şəki", "700": "Şəmkir", "847": "Şirvan", "829": "Siyəzən", 
            "174": "Sumqayıt", "6475": "Şuşa", "2814": "Tərtər", "813": "Tovuz", "854": "Ucar", "827": "Xaçmaz", "398": "Xırdalan", "825": "Xızı", "7209": "Xocalı", 
            "7210": "Xocalı", "828": "Xudat", "698": "Yardımlı", "1115": "Yevlax", "447": "Zaqatala", "4974": "Zəngilan", "2813": "Zərdab"
          },
        BossAz:{"28": "Ağcabədi", "12": "Ağdam", "83": "Ağdaş", "87": "Ağdərə", "85": "Ağstafa", "34": "Ağsu", "88": "Astara", "1": "Bakı", "73": "Balakən",
                "30": "Beyləqan", "31": "Bərdə", "26": "Biləsuvar", "93": "Cəbrayıl", "72": "Cəlilabad", "94": "Culfa", "84": "Daşkəsən", "7": "Əli-Bayramlı",
                "23": "Füzuli", "86": "Gədəbəy", "4": "Gəncə", "81": "Goranboy", "29": "Göyçay", "90": "Göygöl", "91": "Göytəpə", "110": "Hacıqabul",
                "25": "İmişli", "3": "İsmayıllı", "97": "Kəlbəcər", "27": "Kürdəmir", "99": "Laçın", "82": "Lerik", "89": "Lənkəran", "16": "Masallı",
                "6": "Mingəçevir", "14": "Naftalan", "8": "Naxçıvan", "100": "Neftçala", "101": "Oğuz", "102": "Ordubad", "39": "Qaradağ", "38": "Qax",
                "15": "Qazax", "76": "Qəbələ", "92": "Qobustan", "18": "Quba", "98": "Qubadlı", "19": "Qusar", "33": "Saatlı", "24": "Sabirabad",
                "80": "Şabran", "108": "Şahbuz", "22": "Salyan", "21": "Şamaxı", "35": "Samux", "9": "Şəki", "13": "Şəmkir", "79": "Şərur", "78": "Şirvan",
                "74": "Siyəzən", "5": "Sumqayıt", "109": "Şuşa", "32": "Tərtər", "17": "Tovuz", "103": "Ucar", "20": "Xaçmaz", "104": "Xankəndi",
                "75": "Xırdalan", "37": "Xızı", "106": "Xocalı", "105": "Xocavənd", "107": "Xudat", "77": "Yardımlı", "10": "Yevlax", "2": "Zaqatala",
                "95": "Zəngilan", "96": "Zərdab"
        }


    }

});

export default Enums;
