
Presences = new Meteor.Collection('presences')

Meteor.methods({
    updatePresence: function(state){
        if(!Meteor.user()) return
        check(state, String)

        // Available states
        if(['online','away','busy'].indexOf(state) === -1) state = 'online'

        var connectionId = this.isSimulation
            ? Meteor.connection._lastSessionId
            : this.connection.id

        // Should never happen
        if(!connectionId) return

        Presences.update(connectionId, {
            state: state,
            username: Meteor.user().username        
        })
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

    Meteor.startup(function(){

        Tracker.autorun(function(){
            // This also runs on sign-in/sign-out
            if(Meteor.status().status === 'connected'){
                Meteor.call('updatePresence', 'online')
            }
        })

        //@todo: user session.set/get
        var inactiveCount = 0

        function resetTimer(){
            if(inactiveCount>2) Meteor.call('updatePresence', 'online')
            inactiveCount = 0
        }

        document.addEventListener('mousemove', resetTimer, false)
        document.addEventListener('mousedown', resetTimer, false)
        document.addEventListener('keypress', resetTimer, false)
        document.addEventListener('DOMMouseScroll', resetTimer, false)
        document.addEventListener('mousewheel', resetTimer, false)
        document.addEventListener('touchmove', resetTimer, false)
        document.addEventListener('MSPointerMove', resetTimer, false)

        Meteor.setInterval(function(){
            inactiveCount++
            if(inactiveCount>2) Meteor.call('updatePresence', 'away')
            Meteor.call('presenceTick')
        }, 5000)
    })
}