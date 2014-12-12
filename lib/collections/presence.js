
Presences = new Meteor.Collection('presences')

Meteor.methods({
    updatePresence: function(state){
        if(!Meteor.user()) return
        check(state, Match.Any)

        var connectionId = this.isSimulation
            ? Meteor.connection._lastSessionId
            : this.connection.id

        // Should never happen
        if(!connectionId) return

        var update = {
            state: state,
            username: Meteor.user().username
        }

        Presences.update(connectionId, update)
    }
})

if(Meteor.isServer){
    var connections = {}

    var expire = function(id){
        Presences.remove(id)
        delete connections[id]
    }

    var tick = function(id){
        connections[id].lastSeen = Date.now()
    }

    Meteor.startup(function() {
        Presences.remove({})
    })

    Meteor.onConnection(function(connection) {
        Presences.insert({ _id: connection.id })

        connections[connection.id] = {}
        tick(connection.id)

        connection.onClose(function() {
            expire(connection.id)
        })
    })

    Meteor.methods({
        presenceTick: function() {
            check(arguments, [Match.Any])
            if(this.connection && connections[this.connection.id]){
                tick(this.connection.id)
            }
        }
    })

    Meteor.setInterval(function() {
        _.each(connections, function(connection, id) {
            if(connection.lastSeen < (Date.now() - 10000)){
                expire(id)
            }
        })
    }, 5000)
}

if(Meteor.isClient){
    Presence = {}

    Presence.state = function(){
      return 'online'
    }

    Meteor.startup(function(){
        Tracker.autorun(function(){
            // This also runs on sign-in/sign-out
            if(Meteor.status().status === 'connected'){
                Meteor.call('updatePresence', Presence.state())
            }
        })

        Meteor.setInterval(function(){
            Meteor.call('presenceTick')
        }, 5000)
    })
}