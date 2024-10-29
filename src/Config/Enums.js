const Enums = Object.freeze({
    JobTypes: {
        FULL_TIME: 0x001,
        PART_TIME: 0x002,
        CONTRACT: 0x003,
        INTERNSHIP: 0x004,
        FREELANCE: 0x005,
    },
    Education: {
        Secondary: 1,
        Higher: 2,
        Incomplete_education: 3,
        Bachelor: 4,
        Master: 5,
        Doctor: 6
    },
    Experience: {
        Zero: 0x000,
        ZeroToThree: 0x001,
        ThereToFive: 0x002,
        FiveToSeven: 0x003,
        MoreThanSeven : 0x004
    },
    Sites:{
        BossAz:'boss.az', 
        BusyAz:'https://busy.az',
        SmartJobAz:'https://smartjob.az',
    },
    SitesWithId:{
        BossAz:'0x001', 
        BusyAz:'0x002',
        SmartJobAz:'0x003',
    }


});

export default Enums;
