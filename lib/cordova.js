/**
 * Code specific to cordova builds
 */

if (Meteor.isCordova) {

    document.addEventListener('deviceready', function() {
        Session.set('cordovaStatus', 'ready');
        Session.set('connectionType', navigator.connection.type);
    });

    document.addEventListener('pause', function() {
        Session.set('cordovaStatus', 'paused')
        Meteor.disconnect()
    });

    document.addEventListener('resume', function() {
        Session.set('cordovaStatus', 'resumed')
        Meteor.reconnect()
    });

    document.addEventListener('offline', function() {
        Session.set('cordovaStatus', 'offline')
    });

    document.addEventListener('online', function() {
        Session.set('cordovaStatus', 'online')
    });

}