Presences = new Meteor.Collection('presences');

if (Meteor.isServer) {
  var connections = {};

  var expire = function(id) {

    var presence = Presences.findOne(id);
    Presences.remove(id, function(err) {
      if (err) throw new Meteor.Error(500, 'Presence update failed');
      Meteor.users.update({
        username: presence.username
      }, {
        $set: {
          status: 0
        }
      }, function() {
        // async
      });
    });
    delete connections[id];
  };

  var tick = function(id) {
    connections[id].lastSeen = Date.now();
  }

  Meteor.startup(function() {
    Presences.remove({});
  });

  Meteor.onConnection(function(connection) {
    Presences.insert({ _id: connection.id });

    connections[connection.id] = {};
    tick(connection.id);

    connection.onClose(function() {
      expire(connection.id);
    });
  });

  Meteor.setInterval(function() {
    _.each(connections, function(connection, id) {
      if (connection.lastSeen < (Date.now() - 10000)) {
        expire(id);
      }
    });
  }, 5000);
}

if (Meteor.isClient) {

  Meteor.startup(function() {

    Tracker.autorun(function(){
      // This also runs on sign-in/sign-out
      if (Meteor.status().status === 'connected') {
        Meteor.call('updatePresence', 'online');
      }
    });

    // @todo: user session.set/get
    var inactiveCount = 0;

    function resetTimer() {
      if (inactiveCount > 2) {
        Meteor.call('updatePresence', 'online');
      }
      inactiveCount = 0;
    }

    document.addEventListener('mousemove', resetTimer, false);
    document.addEventListener('mousedown', resetTimer, false);
    document.addEventListener('keypress', resetTimer, false);
    document.addEventListener('DOMMouseScroll', resetTimer, false);
    document.addEventListener('mousewheel', resetTimer, false);
    document.addEventListener('touchmove', resetTimer, false);
    document.addEventListener('MSPointerMove', resetTimer, false);

    Meteor.setInterval(function() {
      inactiveCount++;
      if (inactiveCount > 2) {
        Meteor.call('updatePresence', 'away');
      }

      Meteor.call('presenceTick');
    }, 5000);

  });

}

if (Meteor.isServer) {

  Meteor.methods({

    updatePresence: function updatePresence(state){
      check(state, String);

      if (!Meteor.user()) {
        return;
      }

      // Available states
      if (['online', 'away', 'busy'].indexOf(state) === -1) {
        state = 'online';
      }

      var connectionId = this.isSimulation
        ? Meteor.connection._lastSessionId
        : this.connection.id;

      // Should never happen
      if (!connectionId) {
        return;
      }

      Presences.update(connectionId, {
        $set: {
          state: state,
          username: Meteor.user().username
        }
      }, function() {
          // async
      });

      Meteor.users.update({
        username: Meteor.user().username
      }, {
        $set: {
          status: 1
        }
      }, function() {
        // async
      });
    },

    presenceTick: function() {
      check(arguments, [Match.Any]);
      if (this.connection && connections[this.connection.id]) {
        tick(this.connection.id);
      }
    }

  });
}