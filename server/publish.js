/**
 * Publish data for use in the application
 */

// Extend the user collection
Accounts.onCreateUser(function(options, user) {

    user.profile = user.profile || {};

    // setup user account for creation via facebook
    if (user.services.facebook) {
        user.emails = [];
        user.emails.push({ address: user.services.facebook.email, verified: true });
        user.profile.name = user.services.facebook.name;
        user.profileCreated = false;
    }

    // setup user account for creation via twitter
    if (user.services.twitter) {
        if (!Meteor.users.find({ username: user.services.twitter.screenName})) {
            user.username = user.services.twitter.screenName;
        }
        user.profileCreated = false;
    }

    // no longer using identicons
    //if (user.username) {
    //    var crypto = Npm.require('crypto')
    //    user.identicon = crypto.createHash('md5').update(user.username).digest('hex')
    //}

    return user;
});

// User collection permissions (only needed for fields outside of profile)
//Meteor.users.allow({
//    insert: function(userId, doc) {
//        return doc._id === userId
//    },
//    update: function(userId, doc) {
//        return doc._id === userId
//    }
//})

//Meteor.publish('allUsers', function() {
//    return Meteor.users.find(
//        {},
//        { fields: { 'roles': false, 'emails': false, 'services': false } }
//    );
//});

// Publish user data (self account data published by default)
Meteor.publish('userData', function() {
    if (!this.userId) {
        return this.ready();
    }

    return Meteor.users.find({ _id: this.userId });
});

/**
 * Total user count
 */
Meteor.publish('userCount', function() {
    return Meteor.users.find({}, { fields: { id: true } });
});

/**
 * Chat messages
 */
Meteor.publish('chat', function() {
    return Chat.find({}, {sort: {timestamp: -1}, limit: 100});
});

/**
 * Online users
 */
Meteor.publish('presence', function() {
    if (!this.userId) {
        return this.ready();
    }

    return Presences.find({username: {$exists: true}});
});

/**
 * User notifications
 */
Meteor.publish('notification', function(){
    if (!this.userId) {
        return this.ready();
    }

    return Notification.myNotifications(this.userId);
});


/**
 * Public user information
 */
Meteor.publish('userPublic', function(username) {
    if (username) {
        return Meteor.users.find(
            { username: username },
            { fields: { 'roles': false, 'emails': false, 'services': false } }
        );
    } else {
        return Meteor.users.find(
            {},
            { fields: { 'roles': false, 'emails': false, 'services': false } }
        );
    }
});

/**
 * Get statuses for user
 */
Meteor.publish('userStatuses', function(username, limit) {
    limit = limit || 10;

    if (username) {
        return Status.find(
            { username: username },
            { limit: limit }
        );
    } else {
        this.ready();
    }
});

/**
 * List of users
 */
Meteor.publish('userList', function(limit, filter) {
    limit = limit || 15;

    filter = filter || {};
    filter.profileCreated = true;

    if (filter.username) {
        return Meteor.users.find(
            filter,
            { limit: limit }
        );
    } else {
        return Meteor.users.find(
            filter,
            { limit: limit, sort: {serenity: -1}}
        );
    }
});

/**
 * Returns the profilePic of specified username(s)
 */
Meteor.publish('profilePic', function(usernames) {
    if (!usernames) {
        return this.ready();
    }

    if (!Array.isArray(usernames)) {
        usernames = [usernames];
    }

    return Meteor.users.find(
        {username: {$in: usernames}},
        {fields: {'profile.profilePic': true, 'profile.profilePicThumb': true, 'username': true}}
    );
});

Meteor.publish('message', function(username, page){
    if (this.userId && username) {
        return MessageBuckets.myMessagesWith(this.userId, username, page);
    } else if (this.userId) {
        return MessageSessions.myMessages(this.userId);
    } else {
        return this.ready();
    }
});

Meteor.publish('timeline', function(limit, sort) {
    if (!this.userId)  {
        return this.ready();
    }

    sort = sort || {};

    return Status.find(sort,
        {sort: {timestamp: -1}, limit: limit}
    );
});

Meteor.publish('status', function(id) {
    if (!this.userId) {
        return this.ready();
    }

    return Status.find({_id: id});
});

Meteor.publish('tasks', function() {
    if (!this.userId) {
        return this.ready();
    }

    return Tasks.find({userId: this.userId});
});

Meteor.publish('dailyReadings', function(dateKey) {
    return Readings.find({ dateKey: dateKey });
});