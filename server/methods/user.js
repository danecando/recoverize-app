Meteor.methods({
    getUserCount: function() {
        return Meteor.users.find({}).count();
    },
    getUsers: function(filter, sort, limit, skip) {
        filter = filter || {};
        filter.profileCreated = true;

        sort = sort || {};
        limit = limit || 15;
        skip = skip || 0;

        return {
            users: Meteor.users.find(filter,
                {
                    sort: sort,
                    limit: limit,
                    skip: skip
                }).fetch(),
            userCount: Meteor.users.find(filter).count()
        };
    },
    createAccount: function(user) {
        var id = Accounts.createUser({
            email: user.email.toLowerCase(),
            password: user.password
        });

        Roles.addUsersToRoles(id, ['pending'], Roles.GLOBAL_GROUP);

        return id;
    },

    setUserRole: function(id, roles) {
        Roles.addUsersToRoles(id, roles, Roles.GLOBAL_GROUP);
    },

    updateUserRoles: function(id, roles) {
        Roles.setUserRoles(id, roles, Roles.GLOBAL_GROUP);
    },

    setProfileCreated: function() {
        Meteor.users.update({ _id: Meteor.userId() }, {
            $set: {
                profileCreated: true
            }
        });
    },

    banUser: function(id) {
        if (Roles.userIsInRole(this.userId, ['admin'])) {
            Roles.addUsersToRoles(id, ['banned'], Roles.GLOBAL_GROUP);
            return true;
        } else {
            throw new Meteor.Error(401, 'User does not have ban authority');
        }
    },

    optIn: function(user) {
        var mailChimp = new MailChimp('1f89987ef6df82b9303cdc67887cdc0b-us9', { version: '2.0' });

        try {
            return mailChimp.call(
                'lists',
                'subscribe',
                {
                    id: '661ffeb24c',
                    email: {
                        email: user.email
                    },
                    double_optin: false
                });
        } catch(e) {
            throw new Meteor.Error(400, e.message);
        }
    },

    updateEmail: function(user) {
        if (user.email !== Meteor.user().emails[0].address) {
            Meteor.users.update({ _id: Meteor.userId() }, {
                $addToSet: {
                    emails: { address: user.email.toLowerCase(), verified: true }
                }
            }, function(error) {
                if (error) {
                    throw new Meteor.Error(400, 'Couldn\'t update your email address at this time')
                }

                Meteor.users.update({ _id: Meteor.userId() }, {
                    $pop: {
                        emails: -1
                    }
                });
            });
        }
    },

    createUsername: function(username) {
        if (!Meteor.users.findOne({ username: username })) {
            Meteor.users.update({_id: Meteor.userId()}, {
                $set: {
                    username: username.toLowerCase()
                }
            }, function (error, updated) {
                if (error) {
                    throw new Meteor.Error(400, 'Username can only contain letters & numbers')
                }
            });
        } else {
            throw new Meteor.Error(400, 'This username is already taken');
        }
    },

    updateProfile: function(fields) {
        var updated = Object.create(null);
        for (var prop in fields) {
            if (fields.hasOwnProperty(prop) && fields[prop]) {
                updated["profile." + prop] = fields[prop];
            }
        }

        Meteor.users.update({_id: Meteor.userId()}, {
            $set: updated
        }, function (error, updated) {
            if (error) {
                throw new Meteor.Error(error.sanitizedError.error, error.sanitizedError.reason)
            }
        });

        return true;
    },

    follow: function (usernameToFollow) {
        check(Meteor.userId(), String);
        check(usernameToFollow, String);

        // make sure user doesn't follow himself
        if (Meteor.user().username === usernameToFollow) return;

        var affected = Meteor.users.update(
            {_id: Meteor.userId(), follows: {$ne: usernameToFollow}},
            {$addToSet: {follows: usernameToFollow}, $inc: {followsCount: 1}}
        );

        if (affected) {
            Meteor.users.update(
                {username: usernameToFollow},
                {$addToSet: {followers: Meteor.user().username}, $inc: {followersCount: 1}}
            );

            var notification = {
                username: usernameToFollow,
                type: 'follow',
                path: '/users/' + Meteor.user().username + '/',
                from: Meteor.user().username
            };

            Meteor.call('sendNotification', notification);
        }
    },

    unfollow: function (usernameToUnfollow) {
        check(Meteor.userId(), String);
        check(usernameToUnfollow, String);

        var affected = Meteor.users.update(
            {_id: Meteor.userId(), follows: usernameToUnfollow},
            {$pull: {follows: usernameToUnfollow}, $inc: {followsCount: -1}}
        );

        if (affected) {
            Meteor.users.update(
                {username: usernameToUnfollow},
                {$pull: {followers: Meteor.user().username}, $inc: {followersCount: -1}}
            );
        }
    }

});
