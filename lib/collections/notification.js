
/**
 * A notification is about something (object = event, friendship..) 
 * being changed (verb = added, requested..) 
 * by someone (actor) and reported to the user (subject)
 */

NotificationSchema = new SimpleSchema({
    event: {
        type: Object
    },
    checked: {
        type: Boolean,
        defaultValue: false
    },
    userId: {
        type: String,
        label: 'userId'
    }
});

Notification = new Mongo.Collection('notification');
Notification.attachSchema(NotificationSchema);

Notification.create = function() {
    check(userId, String);
    check(event, Object);

    Notification.insert({
        userId: userId,
        event: event,
        checked: false
    });
}

Meteor.methods({
    checkNotification: function(notificationId){
        check(Meteor.userId(), String);
        check(newStatus, String);

        Notification.update({
            _id: notificationId
        }, {
            checked: true
        })
    }
})
