Message = new Mongo.Collection('message');

Meteor.methods({
    addMessage: function (message, to) {
        check(Meteor.userId(), String);
        check(to, String);
        check(message, String);

        Message.insert({
            from: Meteor.user().username,
            to: to, 
            message: message,
            timestamp: Date.now()
        }, function (err) {

            if(!err){
                Notification.insert({
                    userId: to,
                    type: 'message'
                });
            }

        });
    }
});
