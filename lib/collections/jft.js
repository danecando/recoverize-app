JFTSchema = new SimpleSchema({
    date: {
        type: String,
        label: 'Date of reading',
        index: 1,
        unique: true
    },
    title: {
        type: String,
        label: 'Page title',
        optional: true
    },
    bookQuote: {
        type: String,
        optional: true
    },
    quotePage: {
        type: String,
        optional: true
    },
    jftQuote: {
        type: String,
        optional: true
    },
    paragraphs: {
        type: [String],
        optional: true
    }
})

JustForToday = new Mongo.Collection('JustForToday')
JustForToday.attachSchema(JFTSchema)