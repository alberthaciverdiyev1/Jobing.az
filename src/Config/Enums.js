const Enums = Object.freeze({
    JobTypes: {
        FULL_TIME: 0x001,
        PART_TIME: 0x002,
        CONTRACT: 0x003,
        INTERNSHIP: 0x004,
        FREELANCE: 0x005,
    },
    Education: {
        Secondary: 0x001,
        Higher: 0x002,
        Incomplete_education: 0x003,
        Bachelor: 0x004,
        Master: 0x005,
        Doctor: 0x006
    },
    Experience: {
        Zero: 0x000,
        ZeroToThree: 0x001,
        ThereToFive: 0x002,
        FiveToSeven: 0x003,
        MoreThanSeven : 0x004
    },
    Sites:{
        BossAz:'https://boss.az',
        BusyAz:'https://busy.az',
    }


});

export default Enums;
