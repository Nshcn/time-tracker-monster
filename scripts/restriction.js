'use strict';
console.log('restriction');

class Restriction {
    constructor(domain, time) {
        this.domain = domain;
        this.time = convertTimeToSummaryTime(time);
    }
};

class Notification{
    constructor(domain, time) {
        this.domain = domain;
        this.time = convertTimeToSummaryTime(time);
    }
};