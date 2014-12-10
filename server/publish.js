// Extend the user collection
//Accounts.onCreateUser(function(options, user) {
//
//    // Keep default profile
//    user.profile = options.profile
//
//    return user
//})

// Publish user data (self account data published by default)
//Meteor.publish('userData', function() {
//    return Meteor.users.find()
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
              
Meteor.publish('notification', function(username){
  return Notification.find({username: username});
})
