// Extend the user collection
Accounts.onCreateUser(function(options, user) {

    // Keep default profile
    user.profile = options.profile

    return user
})

// Publish user data (self account data published by default)
//Meteor.publish('userData', function() {
//    if (this.userId) {
//        return Meteor.users.find({ _id: this.userId })
//    } else {
//        this.ready()
//    }
//})

// User collection permissions (only needed for fields outside of profile)
//Meteor.users.allow({
//    insert: function(userId, doc) {
//        return doc._id === userId
//    },
//    update: function(userId, doc) {
//        return doc._id === userId
//    }
//})

Meteor.publish('chat', function(){
    return Chat.find({}, {sort: {timestamp: -1}, limit: 20})
})

Meteor.publish(null, function(){
    if(!this.userId){
        this.ready()
        return
    }
    return Notification.myNotifications(this.userId)
})

// @todo: expose public fields only
Meteor.publish('userPublic', function(username){
    return Meteor.users.find({username: username})
})

Meteor.publish('message', function(){
    if(!this.userId){
        this.ready()
        return
    }
    return Message.myMessages(this.userId)
})