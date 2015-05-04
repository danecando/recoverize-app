
Meteor.methods({

    addMessage: function (message, to) {
        check(Meteor.userId(), String);
        check(to, String);
        check(message, String);

        var from = Meteor.user().username;

        MessageSessions.update(
            {$and: [{members: from}, {members: to}]},
            {$inc: {messageCount: +1}, $setOnInsert: {members: [from, to]}},
            {upsert: true}
        );

        var messageCount = MessageSessions.findOne({$and: [{members: from}, {members: to}]}).messageCount;

        var success = MessageBuckets.update(
            {$and: [{members: from}, {members: to}], page: ~~(messageCount / 50)},
            {
                $push: {messages: {username: from, message: message, timestamp: Date.now()}},
                $setOnInsert: {members: [from, to]}
            },
            {upsert: true}
        );

        if (success) {
            var notification = {
                username: to,
                type: 'message',
                path: '/messages/' + from + '/',
                from: from
            };

            Meteor.call('sendNotification', notification);
        }

    }

});
