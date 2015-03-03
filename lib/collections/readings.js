bookSchema = new SimpleSchema({
    date: {
        type: Date,
        label: 'date object',
        optional: true
    },
    title: {
        type: String,
        label: 'Reading title',
        optional: true
    },
    content: {
        type: String,
        label: 'Reading content'
    }
})

readingsSchema = new SimpleSchema({
    date: {
      type: Date,
        label: 'an actual shit object'
    },
    dateKey: {
        type: String,
        label: 'Date of reading',
        index: 1,
        unique: true
    },
    dailyReflections: {
        type: bookSchema,
        label: 'Daily Reflections Reading',
        optional: true
    },
    justForToday: {
        type: bookSchema,
        label: 'Just For Today Reading',
        optional: true
    },
    twentyFourHours: {
        type: bookSchema,
        label: 'Twenty-Four Hours Reading',
        optional: true
    },
    asBillSeesIt: {
        type: bookSchema,
        label: 'As bill sees it',
        optional: true
    },
    walkInDryPlaces: {
        type: bookSchema,
        label: 'Walk in dry places',
        optional: true
    },
    keepItSimple: {
        type: bookSchema,
        label: 'Keep it simple book',
        optional: true
    },
    newBeginning: {
        type: bookSchema,
        label: 'New beginning book',
        optional: true
    },
    bigBook: {
        type: bookSchema,
        label: 'AA Big Book',
        optional: true
    },
    twelveAndTwelve: {
        type: bookSchema,
        label: '12 and 12',
        optional: true
    },
    fatherLeos: {
        type: bookSchema,
        label: 'father leos',
        optional: true
    },
    dailyInspiration: {
        type: bookSchema,
        label: 'daily inspiration',
        optional: true
    },
    dayAtATime: {
        type: bookSchema,
        label: 'day at a time',
        optional: true
    },
    journeyToTheHeart: {
        type: bookSchema,
        label: 'Journey to the heart',
        optional: true
    },
    todaysGift: {
        type: bookSchema,
        label: 'Todays\'s Gift',
        optional: true
    },
    languageOfLettingGo: {
        type: bookSchema,
        label: 'Language of Letting Go',
        optional: true
    }
});


Readings = new Mongo.Collection('readings')
Readings.attachSchema(readingsSchema)