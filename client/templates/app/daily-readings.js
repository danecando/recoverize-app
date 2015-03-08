var copyrights = {
    justForToday: {
        bookName: 'Just For Today',
        copyright: 'Copyright © 1983 by Narcotics Anonymous World Services, Inc.',
        link: 'http://www.amazon.com/Narcotics-Just-Today-Meditations-Recovering/dp/B00J5T6Q1O'
    },
    dailyReflections: {
        bookName: 'Daily Reflections',
        copyright: '© Copyright 1990 by Alcoholics Anonymous World Services, Inc.',
        link: 'http://www.amazon.com/Daily-Reflections-Book-Members/dp/0916856372/ref=sr_1_1?s=books&ie=UTF8&qid=1395601079&sr=1-1&keywords=daily+reflections+alcoholics+anonymous'
    },
    twentyFourHours: {
        bookName: 'Twenty-Four Hours a Day',
        copyright: '© 1954 Hazelden, All rights reserved.',
        link: 'http://www.hazelden.org/OA_HTML/ibeCCtpItmDspRte.jsp?item=1096&sitex=10020:22372:US'
    },
    asBillSeesIt: {
        bookName: 'As Bill Sees It',
        copyright: '© Copyright 1967 by Alcoholics Anonymous World Services, Inc.',
        link: 'http://www.amazon.com/As-Bill-Sees-Selected-Co-Founder/dp/0916856038/'
    },
    walkInDryPlaces: {
        bookName: 'Walk in Dry Places',
        copyright: '© 1996 Hazelden, All rights reserved.',
        link: 'http://www.amazon.com/Walk-Dry-Places-Mel-B/dp/1568381271'
    },
    keepItSimple: {
        bookName: 'Keep It Simple',
        copyright: '© 1989 Hazelden, All rights reserved.',
        link: 'http://www.amazon.com/Keep-Simple-Meditations-Twelve-Step-Beginnings/dp/0894866257'
    },
    newBeginning: {
        bookName: 'Each Day a New Beginning',
        copyright: '© 1982 Hazelden, All rights reserved.',
        link: 'http://www.amazon.com/Each-Day-New-Beginning-Meditations/dp/0894861611'
    },
    bigBook: {
        bookName: 'Big Book of Alcoholics Anonymous',
        copyright: '© Copyright 2002 by Alcoholics Anonymous World Services, Inc.',
        link: 'http://www.amazon.com/Alcoholics-Big-Book-4th/dp/1893007170'
    },
    twelveAndTwelve: {
        bookName: 'Twelve Steps & Twelve Traditions',
        copyright: '© Copyright 2002 by Alcoholics Anonymous World Services, Inc.',
        link: 'http://www.amazon.com/Twelve-Steps-Traditions-Alcoholics/dp/0916856011'
    }
}

Template.dailyReadings.rendered = function() {
    var defaultReading = $('#readingSelect').val();
    Template.instance().currentReading.set(defaultReading);
}

Template.dailyReadings.created = function() {

    this.currentReading = new ReactiveVar();
};

Template.dailyReadings.helpers({
    currentReading: function() {
        var readings = Readings.findOne();
        return readings[Template.instance().currentReading.get()];
    },
    dateString: function() {
      return moment().format('MMMM Do');
    },
    copyright: function() {
        return copyrights[Template.instance().currentReading.get()];
    },
    default: function() {
        if (Meteor.user()) return (Meteor.user().profile.program === 'aa');
        else return false;
    }
});

Template.dailyReadings.events({
    'change #readingSelect': function(e, template) {
        template.currentReading.set(e.target.value);
    }
});


