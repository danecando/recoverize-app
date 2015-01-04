
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
    },
    path: {
        type: String,
        label: 'resolution path'
    },
    who: {
        type: String
    },
    timestamp: {
        type: Number,
        label: 'timestamp',
        autoValue: Date.now
    }
})

Notification = new Mongo.Collection('notification')
Notification.attachSchema(NotificationSchema)

Notification.myNotifications = function(userId){
    var user = Meteor.users.findOne(userId)
    if(user){
        return Notification.find({username: user.username})
    }else{
        return []
    }
}

Meteor.methods({
    checkNotification: function(notificationId){
        check(Meteor.userId(), String)
        check(notificationId, String)

        Notification.update(
            {_id: notificationId, username: Meteor.user().username}, 
            {$set: {checked: true}}
        )
    }
})
