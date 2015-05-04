
ChatSchema = new SimpleSchema({
    message: {
        type: String,
        label: 'message'
    },
    username: {
        type: String,
        label: 'username'
    },
    timestamp: {
        type: Number,
        autoValue: Date.now
    }
});

Chat = new Mongo.Collection('chat');
Chat.attachSchema(ChatSchema);
