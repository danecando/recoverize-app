// code specific to cordova

// todo: test push notifications when app is in background might have to reconnect every now and then to push new data to user

if (Meteor.isCordova) {

    document.addEventListener("deviceready", function() {
        Session.set('cordovaStatus', 'ready')
        Session.set('connectionType', navigator.connection.type)
    })

    document.addEventListener("pause", function() {
        Meteor.disconnect()
    })

    document.addEventListener("resume", function() {
        Meteor.reconnect()
    })

}