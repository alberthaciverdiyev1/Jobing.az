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

    LimitPerRequest:10


});

export default Enums;
