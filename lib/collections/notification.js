
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
        label: 'username'
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
})

Notification = new Mongo.Collection('notification')
Notification.attachSchema(NotificationSchema)


Notification.push = function(obj) {
    if(!hasOwnProperties(obj, ['type', 'username', 'path', 'from'])) {
        return console.log('missing fields on Notification.push')
    }

    // todo: formatted titles and messages
    Notification.insert({
        type: obj.type,
        username: obj.username,
        path: obj.path,
        from: obj.from,
        timestamp: Date.now()
    }, function(err) {
        if(err) return

        var to = Meteor.users.findOne({ username: obj.username })
        if (to._id) {
            Push.send({
                from: obj.from,
                title: obj.type,
                text: obj.type + ' ' + obj.from,
                query: {
                    userId: to._id
                }
            })
        }

    })
}

Notification.myNotifications = function(userId){
    var user = Meteor.users.findOne(userId)
    if(user){
        return Notification.find({username: user.username})
    }else{
        return []
    }
}

Meteor.methods({
    checkNotification: function(id){
        check(Meteor.userId(), String)
        check(id, String)

        Notification.remove({_id: id, username: Meteor.user().username})
    }
})

function hasOwnProperties(obj, arr) {
    return arr.every(function(x) {
        return obj.hasOwnProperty(x)
    })
}