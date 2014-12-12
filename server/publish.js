// Extend the user collection
Accounts.onCreateUser(function(options, user) {

    // Create profile object
    user.profile = {}

    return user
})

// User collection permissions (only needed for fields outside of profile)
//Meteor.users.allow({
//    insert: function(userId, doc) {
//        return doc._id === userId
//    },
//    update: function(userId, doc) {
//        return doc._id === userId
//    }
//})

// Publish user data (self account data published by default)
Meteor.publish('userData', function() {
    if (this.userId) {
       return Meteor.users.find({ _id: this.userId })
    } else {
       this.ready()
       return
    }
})

Meteor.publish('chat', function(){
    return Chat.find({}, {sort: {timestamp: -1}, limit: 20})
})

Meteor.publish('presence', function(){
    if(this.userId){
        return Presences.find({username: {$exists: true}})
    }else{
        this.ready()
        return
    }
})

Meteor.publish('notification', function(){
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