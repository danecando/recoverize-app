
SpeakerSchema = new SimpleSchema({
    speaker: {
        type: String,
        label: 'Speaker Name'
    },
    location: {
        type: String,
        label: 'Speaker Hometown'
    },
    event: {
        type: String,
        label: 'Event'
    },
    date: {
        type: Date,
        label: 'Date',
        optional: true
    },
    votes: {
        type: Number,
        label: 'Votes',
        defaultValue: 0
    },
    listens: {
        type: Number,
        label: 'Listens',
        defaultValue: 0
    },
    program: {
        type: String,
        label: "Program",
        allowedValues: ["aa", "na", "ca", "cma", "coda", "oa", "ga", "ha", "ma", "sa", "alanon", "naranon", "gamanon"],
        optional: true
    },
    file: {
        type: String,
        label: 'File'
    },
    timestamp: {
        type: Number,
        autoValue: Date.now
    }
});

Speaker = new Mongo.Collection('speaker');
Speaker.attachSchema(SpeakerSchema);