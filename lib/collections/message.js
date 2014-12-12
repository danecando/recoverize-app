
MessageSchema = new SimpleSchema({
    from: {
        type: String,
        label: 'sender'
    },
    to: {
        type: String,
        label: 'recipient'
    },
    message: {
        type: String,
        label: 'message'
    },
    timestamp: {
        type: Number,
        label: 'timestamp',
        autoValue: Date.now
    }
})

Message = new Mongo.Collection('message')
Message.attachSchema(MessageSchema)

Message.myMessages = function(userId){
    var user = Meteor.users.findOne(userId)
    if(user){
        return Message.find({ $or: [{from: user.username}, {to: user.username}] })
    }else{
        return []
    }
}

Meteor.methods({
    addMessage: function(message, to){
        check(Meteor.userId(), String)
        check(to, String)
        check(message, String)

        Message.insert({
            from: Meteor.user().username,
            to: to,
            message: message
        }, function(err){

            if(!err){
                Notification.insert({
                    username: to,
                    type: 'message',
                    path: '/messages/' + Meteor.user().username + '/'
                })
            }

        })
    }
})
