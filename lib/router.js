// Subscription Caching
var subs = new SubsManager();


// Router wide configuration
Router.configure({
    layoutTemplate: 'layout',
    notFoundTemplate: 'notFound',
    loadingTemplate: 'loading',

    // wait on the following subscriptions before rendering the page to ensure
    // the data it's expecting is present
    waitOn: function() {
        return [

        ];
    }
});

// Permit certain routes for users not signed in
Router.onBeforeAction(function() {

    Session.set('BACK_KEY', true);


    if (Meteor.isClient) {
        if (!Meteor.userId()) {
            this.render('signin');
            this.redirect('/signin');
        } else {
            this.next();
        }
    } else {
        this.next();
    }

}, { except: ['join', 'help'] });


/**
 * Client side routes
 */

// Auth routes
Router.route('join');
Router.route('signin');

// App routes
Router.route('/', {

    action: function() {
        this.render('dashboard');
    }
});

// User routes

Router.route('/profile/update', {

    action: function() {
        this.render('profileUpdate');
    }
});


Router.route('/test', {
    waitOn: function() {
        return subs.subscribe('test');
    },

    action: function() {
        this.render('test');
    }
});


/**
 * Server Side Routes
 */

//Router.route('/profile/update',{
//    where: 'server',
//    method: 'get',
//    action: function() {
//        this.render('profileUpdate');
//    }
//});
//Router.route('profile/update', {
//    where: 'server',
//    method: 'post',
//    action: function() {
//
//        this.response.end('called');
//    }
//});
//
//Router.route('/profile/update', { where: 'server' })
//    .get(function () {
//        this.render('profileUpdate');
//    })
//    .post(function () {
//        this.response.end('called');
//    });