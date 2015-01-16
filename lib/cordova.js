// code specific to cordova

// todo: test push notifications when app is in background might have to reconnect every now and then to push new data to user

if (Meteor.isCordova) {

    document.addEventListener("deviceready", function() {
        Session.set('cordovaStatus', 'ready')
        Session.set('connectionType', navigator.connection.type)
    })

    document.addEventListener("pause", function() {
        Session.set('cordovaStatus', 'paused')
        Meteor.disconnect()
    })

    document.addEventListener("resume", function() {
        Session.set('cordovaStatus', 'resumed')
        Meteor.reconnect()
    })

    document.addEventListener("offline", function() {
        Session.set('cordovaStatus', 'offline')
    })

    document.addEventListener("online", function() {
        Session.set('cordovaStatus', 'online')
    })
}