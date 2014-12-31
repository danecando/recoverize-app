// Extend the user collection
Accounts.onCreateUser(function(options, user) {

    user.profile = user.profile || { }

    // setup user account for creation via facebook
    if (user.services.facebook) {
        user.emails = []
        user.emails.push({ address: user.services.facebook.email, verified: true })
        user.username = user.services.facebook.email.substring(0, user.services.facebook.email.indexOf("@")) + (Math.floor(Math.random() * (99999 - 10000 + 1)) + 10000).toString()
        user.profile.name = user.services.facebook.name
    }

    // setup user account for creation via twitter
    if (user.services.twitter) {
        user.username = user.services.twitter.screenName + (Math.floor(Math.random() * (99999 - 10000 + 1)) + 10000).toString()
        user.profile.profilePic = user.services.twitter.profile_image_url_https
    }

    var crypto = Npm.require('crypto')
    user.identicon = crypto.createHash('md5').update(user.username).digest('hex')

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
    return [
        Meteor.users.find({username: username}),
        Status.find({username: username})
    ]
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