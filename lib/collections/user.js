ProfileSchema = new SimpleSchema({
    name: {
        type: String,
        label: "Name",
        regEx: /^[a-zA-Z\s]*$/,
        min: 3,
        max: 30,
        optional: true
    },
    soberDate: {
        type: Date,
        label: "Sober Date",
        optional: true
    },
    gender: {
        type: String,
        label: "Gender",
        allowedValues: ["male", "female"],
        optional: true
    },
    program: {
        type: String,
        label: "Program",
        allowedValues: ["aa", "na", "ca"],
        optional: true
    },
    homegroup: {
        type: String,
        label: "Home Group",
        min: 2,
        max: 30,
        optional: true
    },
    quote: {
        type: String,
        label: "User Quote",
        optional: true,
        max: 140
    },
    location: {
        type: String,
        label: "Location",
        max: 60,
        optional: true
    },
    profilePic: {
        type: String,
        label: "Profile Picture",
        optional: true
    }
})

ProfileSchema.messages({
    "regEx Name": [
        { exp: /^[a-zA-Z\s]*$/, msg: "this isn't working...."}
    ]
})

UserSchema = new SimpleSchema({
    username: {
        type: String,
        regEx: /^[a-z0-9A-Z_]/,
        min: 3,
        max: 15,
        optional: true
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

UserSchema.messages({
    'regEx profile.name': [
        { msg: 'Display names can only contain letters!'}
    ]
})

Meteor.users.attachSchema(UserSchema)

if (Meteor.isServer) {

    Meteor.methods({
        createAccount: function(user) {
            var id = Accounts.createUser({
                email: user.email,
                password: user.password,
                optin: user.optin
            })

            Roles.addUsersToRoles(id, ['pending'], Roles.GLOBAL_GROUP)

            return id
        },
        setUserRole: function(id, roles) {
            Roles.addUsersToRoles(id, roles, Roles.GLOBAL_GROUP)
        },
        updateUserRoles: function(id, roles) {
            Roles.setUserRoles(id, roles, Roles.GLOBAL_GROUP)
        },
        optIn: function(user) {
            var mailChimp = new MailChimp('1f89987ef6df82b9303cdc67887cdc0b-us9', { version: '2.0' })
            return mailChimp.call(
                'lists',
                'subscribe',
                {
                    id: '661ffeb24c',
                    email: {
                      email: user.email
                    },
                    double_optin: false
                }, function(error, result) {
                    if (error) throw error
                }

            )
        },
        updateEmail: function(user) {
            if (user.email !== Meteor.user().emails[0].address) {
                Meteor.users.update({ _id: Meteor.userId() }, {
                    $addToSet: {
                        emails: { address: user.email, verified: true }
                    }
                }, function(error) {
                    if (!error) { // if success remove old email address
                        Meteor.users.update({ _id: Meteor.userId() }, {
                            $pop: {
                                emails: -1
                            }
                        })
                    } else {
                        throw new Meteor.Error(400, "Couldn't update your email address at this time")
                    }
                })
            }
        },
        createUsername: function(username) {
            if (!Meteor.users.findOne({ username: username })) {
                Meteor.users.update({_id: Meteor.userId()}, {
                    $set: {
                        username: username
                    }
                }, function (error, updated) {
                    if (error) throw new Meteor.Error(400, "Username can only contain letters & numbers")
                })
            } else {
                throw new Meteor.Error(400, "This username is already taken")
            }
        },
        updateProfile: function(user) {
            var updated = {}
            for (var prop in user) {
                if (user.hasOwnProperty(prop) && user[prop]) {
                    updated["profile." + prop] = user[prop]
                }
            }

            Meteor.users.update({ _id: Meteor.userId() }, {
                $set: updated
            }, function(error, updated) {
                if (error) throw new Meteor.Error(error.sanitizedError.error, error.sanitizedError.reason)
            })

            return true
        }
    })
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
                path: '/users/' + Meteor.user().username + '/',
                who: Meteor.user().username
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
        }
    }
})
