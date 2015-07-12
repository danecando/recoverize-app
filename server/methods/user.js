'use strict';

// server methods related to user accounts
Meteor.methods({

  /**
   * Get total user count
   * @returns {Number}
   */
  getUserCount: function getUserCount() {
    return Meteor.users.find({}).count();
  },

  /**
   * Get a list of users based on filter / sort options
   * @param filter
   * @param sort
   * @param limit
   * @param skip
   * @returns {{users: *, userCount: *}}
   */
  getUsers: function getUsers(filter, sort, limit, skip) {
    filter = filter || {};
    filter.profileCreated = true;
    sort = sort || {};
    limit = limit || 15;
    skip = skip || 0;

    var users = Meteor.users.find(filter, {
      sort: sort,
      limit: limit,
      skip: skip
    }).fetch();

    var count = Meteor.users.find(filter).count();

    return {
      users: users,
      userCount: count
    };
  },

  /**
   * Get a users profile picture
   * @param username
   * @returns {Object}
   */
  getProfilePic: function getProfilePic(username) {
    check(username, String);
    return Meteor.users.findOne({ username: username }, {
      fields: {
        'profile.profilePic': 1,
        'profile.profilePicThumb': 1
      }
    });
  },

  /**
   * Creates a new user account
   * @param user
   * @returns {*}
   */
  createAccount: function createAccount(user) {
    check(user, {
      email: String,
      password: String
    });

    var id = Accounts.createUser({
      email: user.email.toLowerCase(),
      password: user.password
    });

    // users are put in pending role until profile creation is finished
    Roles.addUsersToRoles(id, ['pending'], Roles.GLOBAL_GROUP);

    return id;
  },

  /**
   * Assign a user to a role
   * @todo take a look at these methods make sure they're secure
   * @param id
   * @param roles
   */
  setUserRole: function setUserRole(id, roles) {
    check(id, String);
    check(roles, [String]);
    Roles.addUsersToRoles(id, roles, Roles.GLOBAL_GROUP);
  },

  /**
   * Update a users' roles
   * @param id
   * @param roles
   */
  updateUserRoles: function updateUserRoles(id, roles) {
    check(id, String);
    check(roles, [String]);
    Roles.setUserRoles(id, roles, Roles.GLOBAL_GROUP);
  },

  /**
   * Flag to indicate if an account has finished creating a profile
   * @returns {Number} number of documents affected
   */
  setProfileCreated: function setProfileCreated() {
    var id = Utility.getUserId();
    check(id, String);

    return Meteor.users.update({ _id: id }, {
      $set: {
        profileCreated: true
      }
    });
  },

  /**
   * Ban a user from the site
   * @param id
   * @returns {boolean}
   */
  banUser: function banUser(id) {
    var userId = id;
    var adminId = Utility.getUserId();
    check(userId, String);
    check(adminId, String);

    if (Roles.userIsInRole(adminId, ['admin'])) {
      Roles.addUsersToRoles(userId, ['banned'], Roles.GLOBAL_GROUP);
      return true;
    } else {
      throw new Meteor.Error(401, 'User does not have ban authority');
    }

  },

  /**
   * Opt a user in to mailing list
   * @param user
   * @returns {*}
   */
  optIn: function optIn(user) {
    check(user.email, String);

    var mailChimp = new MailChimp('1f89987ef6df82b9303cdc67887cdc0b-us9', {
      version: '2.0'
    });

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
    } catch (e) {
      throw new Meteor.Error(400, e.message);
    }
  },

  /**
   * Update own email address
   * Throws if can't add new, returns false if old email not removed
   * @param user
   * @returns {boolean}
   */
  updateEmail: function updateEmail(user) {
    var id = Utility.getUserId();
    var updated = 0;

    check(id, String);

    if (user.email !== Meteor.user().emails[0].address) {
      updated += Meteor.users.update({ _id: id }, {
        $addToSet: {
          emails: { address: user.email.toLowerCase(), verified: true }
        }
      }, function(err) {
        if (err) {
          throw new Meteor.Error(400, 'Couldn\'t update your email address at this time')
        }

        updated += Meteor.users.update({ _id: id }, {
          $pop: {
            emails: -1
          }
        });
      });
    }

    return updated === 2;
  },


  /**
   * Create a new username
   * @param username
   */
  createUsername: function createUsername(username) {
    var id = Utility.getUserId();
    check(id, String);

    if (!Meteor.users.findOne({ username: username })) {
      Meteor.users.update({ _id: id }, {
        $set: {
          username: username.toLowerCase()
        }
      }, function(error) {
        if (error) {
          throw new Meteor.Error(400, 'Username can only contain letters & numbers')
        }
      });
    } else {
      throw new Meteor.Error(400, 'This username is already taken');
    }
  },


  /**
   * Update profile fields
   * @todo validate fields
   * @param fields
   * @returns {*}
   */
  updateProfile: function updateProfile(fields) {
    var id = Utility.getUserId();
    check(id, String);

    var updated = {};
    for (var prop in fields) {
      if (fields.hasOwnProperty(prop) && fields[prop]) {
        updated["profile." + prop] = fields[prop];
      }
    }

    return Meteor.users.update({ _id: Meteor.userId() }, {
      $set: updated
    }, function(error) {
      if (error) {
        throw new Meteor.Error(error.sanitizedError.error, error.sanitizedError.reason)
      }
    });
  },

  /**
   * Follow another user
   * @param usernameToFollow
   * @returns {boolean}
   */
  follow: function follow(usernameToFollow) {
    var id = Utility.getUserId();
    check(id, String);
    check(usernameToFollow, String);

    // make sure user doesn't follow himself
    if (Meteor.user().username === usernameToFollow) return false;

    var affected = Meteor.users.update({
      _id: id,
      follows: { $ne: usernameToFollow }
    }, {
      $addToSet: {
        follows: usernameToFollow
      },
      $inc: {
        followsCount: 1
      }
    });

    if (affected) {
      Meteor.users.update({ username: usernameToFollow }, {
        $addToSet: {
          followers: Meteor.user().username
        },
        $inc: {
          followersCount: 1
        }
      }, function() {
        return; // run async
      });

      var notification = {
        username: usernameToFollow,
        type: 'follow',
        path: '/users/' + Meteor.user().username + '/',
        from: Meteor.user().username
      };

      Meteor.call('sendNotification', notification);
    }
  },

  /**
   * Unfollow a user
   * @param usernameToUnfollow
   */
  unfollow: function unfollow(usernameToUnfollow) {
    var id = Utility.getUserId();
    check(id, String);
    check(usernameToUnfollow, String);

    var affected = Meteor.users.update({
      _id: id,
      follows: usernameToUnfollow
    }, {
      $pull: {
        follows: usernameToUnfollow
      },
      $inc: {
        followsCount: -1
      }
    });

    if (affected) {
      Meteor.users.update({ username: usernameToUnfollow }, {
        $pull: {
          followers: Meteor.user().username
        },
        $inc: {
          followersCount: -1
        }
      }, function() {
        return; // run async
      });
    }
  },

  /**
   * Sets lastActive date for user by id
   * @param userId
   */
  setLastActive: function setLastActive(userId) {
    Meteor.users.update(userId, {
      $set: {
        lastActive: new Date()
      }
    }, function() {
      return;
    });
  }

});
