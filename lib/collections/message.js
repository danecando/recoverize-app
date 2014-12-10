Message = new Mongo.Collection('message');

Meteor.methods({
    addMessage: function (message) {
        check(Meteor.userId(), String);
        check(message, String);

        Message.insert({
            username: Meteor.user().username,
            message: message,
            timestamp: Date.now()
        });
    }
});
