
/**
 * A notification is about something (object = event, friendship..) 
 * being changed (verb = added, requested..) 
 * by someone (actor) and reported to the user (subject)
 */

NotificationSchema = new SimpleSchema({
    type: {
        type: String,
        label: 'type'
    },
    username: {
        type: String,
        label: 'username',
        index: 1
    },
    path: {
        type: String,
        label: 'resolution path'
    },
    from: {
        type: String,
        optional: true
    },
    timestamp: {
        type: Number,
        label: 'timestamp'
    }
});

Notification = new Mongo.Collection('notification');
Notification.attachSchema(NotificationSchema);

Notification.push = function(obj) {
    if (!Utility.hasOwnProperties(obj, ['type', 'username', 'path', 'from'])) {
        throw new Meteor.Error(400, 'Missing fields on Notification.push');
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

        var to = Meteor.users.findOne({ username: obj.username })
        if (to._id && Meteor.isCordova) {

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
                title: obj.type,
                text: notificationMsg,
                query: {
                    userId: to._id
                }
            });
        }

    });
};

Notification.myNotifications = function(userId){
    var user = Meteor.users.findOne(userId);
    if (user) {
        return Notification.find({username: user.username});
    } else {
        return [];
    }
};
