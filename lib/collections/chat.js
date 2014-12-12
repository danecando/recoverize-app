Chat = new Mongo.Collection('chat');

Meteor.methods({
    addChat: function (message) {
        check(Meteor.userId(), String);
        check(message, String);

        Chat.insert({
            username: Meteor.user().username,
            message: message,
            timestamp: Date.now()
        }, function(err){
            if(!err){
                var matches = message.match(/\B@[a-z0-9_-]+/gi)
                if(matches) {
                    matches.forEach(function(username){
                        Notification.insert({
                            username: username.slice(1),
                            type: 'chat',
                            path: '/chat/'
                        });
                    });
                }
            }
        });
    }
});
