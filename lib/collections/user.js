ProfileSchema = new SimpleSchema({
    name: {
        type: String,
        optional: true
    },
    soberDate: {
        type: Date,
        optional: true
    },
    gender: {
        type: String,
        allowedValues: ['Male', 'Female'],
        optional: true
    },
    program: {
        type: String,
        allowedValues: ['aa', 'na', 'ca'],
        optional: true
    },
    homegroup: {
        type: String,
        optional: true
    },
    quote: {
        type: String,
        optional: true
    },
    location: {
        type: String,
        optional: true
    }
})

UserSchema = new SimpleSchema({
    username: {
        type: String,
        regEx: /^[a-z0-9A-Z_]{3,15}$/
    },
    emails: {
        type: [Object],
        // this must be optional if you also use other login services like facebook,
        // but if you use only accounts-password, then it can be required
        optional: true
    },
    "emails.$.address": {
        type: String,
        regEx: SimpleSchema.RegEx.Email
    },
    "emails.$.verified": {
        type: Boolean
    },
    createdAt: {
        type: Date
    },
    profile: {
        type: ProfileSchema,
        optional: true
    },
    services: {
        type: Object,
        optional: true,
        blackbox: true
    },
    roles: {
        type: Object,
        optional: true,
        blackbox: true
    },
    followers: {
        type: [String],
        defaultValue: []
    },
    follows: {
        type: [String],
        defaultValue: []
    },
    followersCount: {
        type: Number,
        defaultValue: 0
    },
    followsCount: {
        type: Number,
        defaultValue: 0
    },
    serenity: {
        type: Number,
        defaultValue: 0
    }
})

Meteor.users.attachSchema(UserSchema)

if (Meteor.isServer) {

    Meteor.methods({

        createAccount: function(user) {
            var id = Accounts.createUser({
                email: user.email,
                password: user.password,
                username: user.username
            })

            Roles.addUsersToRoles(id, user.roles, Roles.GLOBAL_GROUP)

            return id
        }
    })
}

Meteor.users.giveSerenity = function(username, serenity){
    Meteor.users.update(
        {username: username},
        {$inc: {serenity: serenity}}
    )
}

Meteor.methods({
    follow: function(usernameToFollow){
        check(Meteor.userId(), String)
        check(usernameToFollow, String)

        // make sure user doesn't follow himself
        if(Meteor.user().username === usernameToFollow) return

        var affected = Meteor.users.update(
            {_id: Meteor.userId(), follows: {$ne: usernameToFollow}},
            {$addToSet: {follows: usernameToFollow}, $inc: {followsCount: 1}}
        )

        if(affected){
            Meteor.users.update(
                {username: usernameToFollow},
                {$addToSet: {followers: Meteor.user().username}, $inc: {followersCount: 1}}
            )
            Notification.insert({
                username: usernameToFollow,
                type: 'follow',
                path: '/users/' + Meteor.user().username + '/'
            })
        }
    },
    unfollow: function(usernameToUnfollow){
        check(Meteor.userId(), String)
        check(usernameToUnfollow, String)

        var affected = Meteor.users.update(
            {_id: Meteor.userId(), follows: usernameToUnfollow},
            {$pull: {follows: usernameToUnfollow}, $inc: {followsCount: -1}}
        )

        if(affected){
            Meteor.users.update(
                {username: usernameToUnfollow},
                {$pull: {followers: Meteor.user().username}, $inc: {followersCount: -1}}
            )
            Notification.insert({
                username: usernameToUnfollow,
                type: 'unfollow',
                path: '/users/' + Meteor.user().username + '/'
            })
        }
    }
})
