
ChatSchema = new SimpleSchema({
    message: {
        type: String,
        label: 'message'
    },
    username: {
        type: String,
        label: 'username'
    },
    timestamp: {
        type: Number,
        autoValue: Date.now
    }
})

Chat = new Mongo.Collection('chat')
Chat.attachSchema(ChatSchema)

Meteor.methods({
    addChat: function(message){
        check(Meteor.userId(), String);
        check(message, String);

        // limit 250 chat messages (could change to bulk remove at certain number)
        if (Chat.find().count() >= 250) {
            var popMsg = Chat.findOne({}, { sort: { timestamp: 1 }})
            Chat.remove({ _id: popMsg._id })
        }

        Chat.insert({
            username: Meteor.user().username,
            message: message,
            timestamp: Date.now()
        }, function(err){

            if(!err){
                var matches = message.match(/\B@[a-z0-9_-]+/gi)
                if(matches) {
                    matches.forEach(function(username){
                        Notification.push({
                            username: username.slice(1),
                            type: 'chat',
                            path: '/chat/',
                            from: Meteor.user().username
                        })
                    })
                }
            }

        })
    }
})
