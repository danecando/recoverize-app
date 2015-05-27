'use strict';

if (Meteor.isServer) {
// user has connected with the app
  Meteor.onConnection(function(connection) {

    var username;
    if (Meteor.user()) {
      username = Meteor.user().username;

      // reset last active time
      Meteor.users.update({ username: username }, {
        $set: {
          lastActive: new Date()
        }
      });

    }



    // user connection has ended
    connection.onClose(function() {

    });
  });
}

if (Meteor.isClient) {
  // new client connection
  Meteor.startup(function() {

    // reset userList sort on new connection
    Session.setDefault('userListSort', {
      status: -1,
      serenity: -1,
      'profile.soberDate': -1,
      followersCount: 1,
      'profile.gender': -1
    });

    // reset timline sort on new connection
    Session.setDefault('timelineSort', {
      timestamp: -1,
      serenity: 1
    });

  });
}
