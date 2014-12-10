// Extend the user collection
Accounts.onCreateUser(function(options, user) {

    // Keep default profile
    user.profile = options.profile

    return user
})

// Publish user data
Meteor.publish('userData', function() {
    return Meteor.users.find()
})

// User collection permissions
Meteor.users.allow({
    insert: function(userId, doc) {
        return doc._id === userId
    },
    update: function(userId, doc) {
        return doc._id === userId
    }
})

Meteor.publish('messages', function(){
    return Message.find({}, {sort: {timestamp: -1}, limit: 20})
})