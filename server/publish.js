var Joi = Meteor.npmRequire('joi');

// Extend the user collection
Accounts.onCreateUser(function(options, user) {

    // keep default profile
    user.profile = options.profile;

    user.followers = [];
    user.posts = [];
    user.checklist = [];

    return user;
});

Meteor.users.allow({
    insert: function(userId, doc) {
        return doc._id === userId;
    },
    update: function(userId, doc) {
        return doc._id === userId;
    },
    remove: function(userId, doc) {
        return doc._id === userId;
    }
});

Meteor.publish('posts', function() {
    return Posts.find();
});

//Meteor.publish(null, function () {
//    var UserId = this.UserId,
//        fields = {
//        followers:1
//    }
//
//    return Meteor.users.find({_id: userId}, {fields: fields})
//});

Meteor.publish('userData', function() {
    return Meteor.users.find();
});