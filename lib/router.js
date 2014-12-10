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

// User routes
Router.route('/profile/update', {

    action: function() {
        this.render('profileUpdate')
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