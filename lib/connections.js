'use strict';

if (Meteor.isServer) {

  // user has connected with the app
  Meteor.onConnection(function(connection) {

    // user connection has ended
    connection.onClose(function() {

    });
  });
}


if (Meteor.isClient) {

  // new client connection
  Meteor.startup(function() {

    var userId;

    if (Meteor.user()) {
      userId = Meteor.user()._id;
      Meteor.call('setLastActive', userId);
    }

    // reset userList sort on new connection
    Session.setDefault('userListSort', {
      lastActive: -1,
      serenity: -1,
      'profile.soberDate': -1,
      followersCount: 1,
      'profile.gender': -1
    });

    // reset timeline sort on new connection
    Session.setDefault('timelineSort', {
      timestamp: -1,
      serenity: 1
    });

  });
}
