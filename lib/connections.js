
if (Meteor.isServer) {
// user has connected with the app
  Meteor.onConnection(function(connection) {

    // user connection has ended
    connection.onClose(function() {

    });
  });
}
