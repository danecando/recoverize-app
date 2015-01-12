// Extend the user collection
Accounts.onCreateUser(function(options, user) {

    user.profile = user.profile || { }

    // setup user account for creation via facebook
    if (user.services.facebook) {
        user.emails = []
        user.emails.push({ address: user.services.facebook.email, verified: true })
        user.profile.name = user.services.facebook.name
        user.services.facebook.profileCreated = false
    }

    // setup user account for creation via twitter
    if (user.services.twitter) {
        user.profile.profilePic = user.services.twitter.profile_image_url_https
        if (!Meteor.users.find({ username: user.services.twitter.screenName})) {
            user.username = user.services.twitter.screenName
        }
        user.services.twitter.profileCreated = false
    }

    if (user.username) {
        var crypto = Npm.require('crypto')
        user.identicon = crypto.createHash('md5').update(user.username).digest('hex')
    }

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

Meteor.publish('userCount', function() {
    return Meteor.users.find({}, { fields: { id: true } })
})

Meteor.publish('chat', function(){
    return Chat.find({}, {sort: {timestamp: -1}, limit: 50})
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
    if(username) {
        return [
            Meteor.users.find({username: username}),
            Status.find({username: username})
        ]
    } else {
        return [
            Meteor.users.find(),
            Status.find()
        ]
    }
})

/**
 * returns list of users
 */
Meteor.publish('userList', function(query){

    var fields = {username: 1, createdAt: 1}

    if(query) {
        return Meteor.users.find(
            {username: {$regex: query}},
            {fields: fields, limit: 10}
        )
    } else {
        return Meteor.users.find(
            {},
            {fields: fields, limit: 10, sort: {createdAt: -1}}
        )
    }
})

/**
 * returns the profilePic and identicon of a specified username(s)
 */
Meteor.publish('profilePic', function(usernames) {
    if(!usernames){
        return []
    }
    if(!Array.isArray(usernames)){
        usernames = [usernames]
    }
    return Meteor.users.find(
        {username: {$in: usernames}},
        {fields: {'profile.profilePic': true, 'identicon': true, 'username': true}}
    )
})

Meteor.publish('message', function(username, page){
    if(this.userId && username){
        return MessageBuckets.myMessagesWith(this.userId, username, page)
    } else if (this.userId){
        return MessageSessions.myMessages(this.userId)
    } else {
        this.ready()
        return
    }
})

Meteor.publish('timeline', function() {
    if(this.userId) {
        // 604800000 = 1 week in ms
        return Status.find(
            {timestamp: {$gt: Date.now() - 604800000}},
            {sort: {serenity: -1}, limit: 50}
        )
    } else {
        this.ready()
        return
    }
})
