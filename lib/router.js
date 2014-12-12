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
            Meteor.subscribe('userData'),
            Meteor.subscribe('notification'),
            Meteor.subscribe('chat'),
            Meteor.subscribe('presence')
        ]
    }
})

// Permit certain routes for users not signed in
Router.onBeforeAction(function() {

    if(Meteor.isClient){
        // trailing slash safety check
        var path = this.location.get().path
        if(path[path.length-1] !== '/') path += '/'

        // toggle resolved notifications
        Notification.find({path: path, checked: false}).forEach(function (notification) {
            Meteor.call('checkNotification', notification._id)
        })
    }

    if(Meteor.isClient){
        if(!Meteor.userId()){
            this.render('signin')
            this.redirect('/signin')
        }else{
            this.next()
        }
    }else{
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

Router.route('/chat')
Router.route('/notifications')

Router.route('/messages', {
    waitOn: function(){
        return Meteor.subscribe('message')
    },
    action: function(){
        this.render('messages')
    }
})

Router.route('/messages/:username', {
    waitOn: function(){
        return Meteor.subscribe('message')
    },
    action: function(){
        this.render('message', {
            data: {
                username: this.params.username
            }
        })
    }
})

// User routes
Router.route('/profile/update', {
    action: function() {
        this.render('profileUpdate')
    }
})

// public user profiles
Router.route('/users/:username', {
    waitOn: function(){
        Meteor.subscribe('userPublic', this.params.username);
    },
    action: function(){
        this.render('user', {
            data: {
                username: this.params.username
            }
        })
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