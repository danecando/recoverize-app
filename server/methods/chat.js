Meteor.methods({

    addChat: function (message) {
        check(Meteor.userId(), String);
        check(message, String);

        // limit 250 chat messages (could change to bulk remove at certain number)
        // also could store them elsewhere to keep an archive
        if (Chat.find().count() >= 250) {
            var popMsg = Chat.findOne({}, {sort: {timestamp: 1}});
            Chat.remove({_id: popMsg._id});
        }

        Chat.insert({
            username: Meteor.user().username,
            message: message,
            timestamp: Date.now()
        }, function (err) {

            if (!err) {
                var matches = message.match(/\B@[a-z0-9_-]+/gi);
                if (matches) {
                    matches.forEach(function (username) {
                        var notification = {
                            username: username.slice(1),
                            type: 'chat',
                            path: '/chat/',
                            from: Meteor.user().username
                        };

                        Meteor.call('sendNotification', notification);
                    });
                }
            }

        });
    }

});