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
        if (!Meteor.users.find({ username: user.services.twitter.screenName})) {
            user.username = user.services.twitter.screenName
        }
        user.services.twitter.profileCreated = false
    }

    // no longer using identicons
    //if (user.username) {
    //    var crypto = Npm.require('crypto')
    //    user.identicon = crypto.createHash('md5').update(user.username).digest('hex')
    //}

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
    if (!this.userId) return this.ready()

    return Meteor.users.find({ _id: this.userId })
})

Meteor.publish('userCount', function() {
    return Meteor.users.find({}, { fields: { id: true } })
})

Meteor.publish('chat', function(){
    return Chat.find({}, {sort: {timestamp: -1}, limit: 100})
})

Meteor.publish('presence', function(){
    if(!this.userId) return this.ready()

    return Presences.find({username: {$exists: true}})
})

Meteor.publish('notification', function(){
    if(!this.userId) return this.ready()

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

Meteor.publish('statusUser', function(username) {
    if (username) {
        return Meteor.users.find({ username: username })
    } else this.ready()
})

/**
 * returns list of users
 */
Meteor.publish('userList', function(limit, query){

    limit = limit || 15


    var filter = {}
    if (query)
        filter = {username: {$regex: query}}

    if (typeof filter != 'string')
        filter = {}


    var fields = {username: 1, createdAt: 1}

    if(query.username) {
        return Meteor.users.find(
            filter,
            { limit: limit }
        )
    } else {
        return Meteor.users.find(
            {},
            { limit: limit, sort: {serenity: -1}}
        )
    }
})

/**
 * returns the profilePic of specified username(s)
 */
Meteor.publish('profilePic', function(usernames) {
    if(!usernames) return this.ready()

    if(!Array.isArray(usernames)) {
        usernames = [usernames]
    }

    return Meteor.users.find(
        {username: {$in: usernames}},
        {fields: {'profile.profilePic': true, 'username': true}}
    )
})

Meteor.publish('message', function(username, page){
    if(this.userId && username) {
        return MessageBuckets.myMessagesWith(this.userId, username, page)
    } else if (this.userId){
        return MessageSessions.myMessages(this.userId)
    } else {
        return this.ready()
    }
})

Meteor.publish('timeline', function(limit, sort) {
    if(!this.userId) return this.ready()

    sort = sort || {}

    return Status.find(sort,
        {sort: {timestamp: -1}, limit: limit}
    )
})

Meteor.publish('status', function(id) {
    if(!this.userId) return this.ready()

    return Status.find({_id: id})
})

Meteor.publish('tasks', function() {
    if(!this.userId) return this.ready()

    return Tasks.find({userId: this.userId})
})
