var subs = new SubsManager();


// Router wide configuration
Router.configure({
    // we use the  appBody template to define the layout for the entire app
    layoutTemplate: 'layout',

    // the appNotFound template is used for unknown routes and missing lists
    notFoundTemplate: 'notFound',

    // show the appLoading template whilst the subscriptions below load their data
    loadingTemplate: 'loading',

    // wait on the following subscriptions before rendering the page to ensure
    // the data it's expecting is present
    waitOn: function() {
        return [

            //Meteor.subscribe('publicLists'),
            //Meteor.subscribe('privateLists')
        ];
    }
});

// Permit certain routes for users not signed in
Router.onBeforeAction(function() {

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


// Client Routes
Router.route('/', {

    waitOn: function() {
        return subs.subscribe('userData');
    },

    action: function() {
        this.render('home');
    }
});

Router.route('signin');

Router.route('join');


Router.route('/follow/:username', {where: 'server'})
    .get(function () {
        this.response.end('get request\n');
    })
    .post(function () {

        this.response.end(this.params.username);
    });
// Server Routes
//Router.route('follow', {
//    path: '/follow/:username',
//    where: 'server',
//    method: 'post',
//    action: function() {
//
//        this.response.end(this.params.username + this.params.method);
//    }
//});