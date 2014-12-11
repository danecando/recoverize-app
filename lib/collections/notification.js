
/**
 * A notification is about something (object = event, friendship..) 
 * being changed (verb = added, requested..) 
 * by someone (actor) and reported to the user (subject)
 */

NotificationSchema = new SimpleSchema({
    type: {
        type: String
    },
    checked: {
        type: Boolean,
        defaultValue: false
    },
    username: {
        type: String,
        label: 'username'
    }
});

Notification = new Mongo.Collection('notification');
Notification.attachSchema(NotificationSchema);

Notification.myNotifications = function(){
    return Notification.find({username: Meteor.user().username})
}

Meteor.methods({

    // @todo make sure only notification owner can modify notification
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
