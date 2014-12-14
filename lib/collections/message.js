
MessageSessions = new Mongo.Collection('messagesessions')
MessageBuckets = new Mongo.Collection('messagebuckets')

MessageSessions.myMessages = function(userId){
    var user = Meteor.users.findOne(userId)
    if(user){
        return MessageSessions.find({members: user.username})
    }else{
        return []
    }
}

MessageBuckets.myMessagesWith = function(userId, username, page){
    var user = Meteor.users.findOne(userId)
    if(user){
        page = typeof page === 'number' ? page : getLastPage(user.username, username)
        return MessageBuckets.find({$and: [{members: username}, {members: user.username}], num: {$gte: page}})
    }else{
        return []
    }
}

function getLastPage(username1, username2){
    if(!username1||!username2){
        return 0
    }

    var session = MessageSessions.findOne({$and: [{members: username1}, {members: username2}]})
    if(session){
        return ~~(session.messageCount/50)
    }else{
        return 0
    }
}

Meteor.methods({
    addMessage: function(message, to){
        check(Meteor.userId(), String)
        check(to, String)
        check(message, String)

        var from = Meteor.user().username

        MessageSessions.update(
            {$and: [{members: from}, {members: to}]},
            {$inc: {messageCount: +1}, $setOnInsert: {members: [from, to]}},
            {upsert: true}
        )

        var messageCount = MessageSessions.findOne({$and: [{members: from}, {members: to}]}).messageCount

        var success = MessageBuckets.update(
            {$and: [{members: from}, {members: to}], num: ~~(messageCount/50)},
            {$push: {messages: {username: from, message: message, timestamp: Date.now()}}, $setOnInsert: {members: [from, to]}},
            {upsert: true}
        )

        if(success){
            Notification.insert({
                username: to,
                type: 'message',
                path: '/messages/' + from + '/'
            })     
        }

    }
})


