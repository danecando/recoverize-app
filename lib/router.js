// Subscription Caching
var subs = new SubsManager()


// Router wide configuration
Router.configure({
    layoutTemplate: 'layout',
    notFoundTemplate: 'notFound',
    loadingTemplate: 'loading',

    // wait on the following subscriptions before rendering the page to ensure
    // the data it's expecting is present
    waitOn: function() {
        return [

        ]
    }
})

// Permit certain routes for users not signed in
Router.onBeforeAction(function() {

    if (Meteor.isClient) {
        if (!Meteor.userId()) {
            this.render('signin')
            this.redirect('/signin')
        } else {
            this.next()
        }
    } else {
        this.next()
    }

    // these routes are open to non registered users
}, { except: ['join', 'help'] })


///////////////////////////////////////////////////
// Client side routes
///////////////////////////////////////////////////

// Auth routes
Router.route('join')
Router.route('signin')

// App routes
Router.route('/', {

    action: function() {
        this.render('dashboard')
    }
})

Router.route('/chat', {
    waitOn: function() {
        return Meteor.subscribe('chat')
    },
    action: function () {
        this.render('chat')
    }
})

Router.route('/notifications', {
    action: function(){
        this.render('notifications')
        if(Meteor.user()) Meteor.subscribe('notification', Meteor.user().username)
    }
})

Router.route('/messages', {
    action: function(){
        this.render('messages')
    }
})

// User routes
Router.route('/profile/update', {

    action: function() {
        this.render('profileUpdate')
    }
})

// public user profiles
Router.route('/user/:username', {
    waitOn: function(){
        Meteor.subscribe('user', this.params.username);
    },
    action: function(){
        this.render('user');
    }
})

///////////////////////////////////////////////////
// SERVER SIDE ROUTES
// are kind of buggy!!!
///////////////////////////////////////////////////

//Router.route('/profile/update', { where: 'server' })
//    .get(function () {
//        this.render('profileUpdate');
//    })
//    .post(function () {
//        this.response.end('called');
//    });