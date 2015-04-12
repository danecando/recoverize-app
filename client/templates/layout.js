
var MENU_KEY = 'menuOpen';
Session.setDefault(MENU_KEY, false);

var SHOW_CONNECTION_ISSUE_KEY = 'showConnectionIssue';
Session.setDefault(SHOW_CONNECTION_ISSUE_KEY, false);

var CONNECTION_ISSUE_TIMEOUT = 5000;

Meteor.startup(function() {

    // set up a swipe left / right handler
    $(document.body).touchwipe({
        wipeLeft: function () {
            Session.set(MENU_KEY, false);
        },
        wipeRight: function () {
            Session.set(MENU_KEY, true);
        },
        preventDefaultEvents: false
    });

    setTimeout(function () {
        // Launch screen handle created in lib/router.js
        dataReadyHold.release();

        // Show the connection error box
        Session.set(SHOW_CONNECTION_ISSUE_KEY, true);
    }, CONNECTION_ISSUE_TIMEOUT);

});

/**
 * Helpers
 */
Template.layout.helpers({
    menuOpen: function() {
        return Session.get(MENU_KEY) && 'menu-open';
    },
    cordova: function() {
        return Meteor.isCordova && 'cordova';
    },
    connected: function() {
        if (Session.get(SHOW_CONNECTION_ISSUE_KEY)) {
            return Meteor.status().connected;
        } else {
            return true;
        }
    }
});

/**
 * Events
 */
Template.layout.events({
    'click .menu-toggle': function() {
        Session.set(MENU_KEY, !Session.get(MENU_KEY));
    },
    'click #page-overlay': function(event) {
        Session.set(MENU_KEY, false);
        event.preventDefault();
    },
    'click #menu nav a, click .notification-nav a': function() {
        Session.set(MENU_KEY, false);
    }
});