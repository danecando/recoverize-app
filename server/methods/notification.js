
Meteor.methods({

    checkNotification: function (id) {
        check(Meteor.userId(), String);
        check(id, String);

        Notification.remove({_id: id, username: Meteor.user().username});
    },

    clearNotifications: function () {
        Notification.remove({username: Meteor.user().username});
    },

    sendNotification: function(obj) {
        if (!internals.hasOwnProperties(obj, ['type', 'username', 'path', 'from'])) {
            return console.log('missing fields on Notification.push');
        }

        Notification.insert({
            type: obj.type,
            username: obj.username,
            path: obj.path,
            from: obj.from,
            timestamp: Date.now()
        }, function(err) {
            if (err) {
                return;
            }

            var to = Meteor.users.findOne({ username: obj.username });
            if (to._id) {

                var notificationMsg = '';
                switch(obj.type) {
                    case 'follow':
                        notificationMsg = obj.from + ' is now following you';
                        break;
                    case 'status':
                        notificationMsg = obj.from + ' mentioned you in a share';
                        break;
                    case 'chat':
                        notificationMsg = obj.from + ' mentioned you in the chat room';
                        break;
                    default:
                        break;
                }


                Push.send({
                    from: obj.from,
                    title: 'Notification',
                    text: notificationMsg,
                    query: {
                        userId: to._id
                    }
                });
            }

        });
    }
});