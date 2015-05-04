StatusSchema = new SimpleSchema({
    type: {
        type: String,
        defaultValue: 'original'
    },
    serenity: {
        type: Number,
        defaultValue: 0
    },
    shares: {
        type: Number,
        defaultValue: 0
    },
    serenityList: {
        type: [String],
        defaultValue: []
    },
    shareList: {
        type: [String],
        defaultValue: []
    },
    username: {
        type: String,
        label: 'username',
        index: 1
    },
    image: {
        type: String,
        label: 'status image',
        optional: true
    },
    timestamp: {
        type: Number,
        label: 'timestamp'
    },
    status: {
        type: String,
        label: 'the status itself',
        optional: true
    },
    sharedId: {
        type: String,
        label: 'id of shared original',
        optional: true
    },
    sharedUser: {
        type: String,
        label: 'username of shared status',
        optional: true
    }
});

Status = new Mongo.Collection('status');
Status.attachSchema(StatusSchema);
