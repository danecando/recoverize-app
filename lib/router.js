// Subscription Caching
var subs = new SubsManager()

Router.configure({
    layoutTemplate: 'layout',
    notFoundTemplate: 'notFound',
    loadingTemplate: 'loading',

    waitOn: function() {
        return [
            Meteor.subscribe('userData'),
            Meteor.subscribe('notification'),
            Meteor.subscribe('chat'),
            Meteor.subscribe('presence')
        ]
    }
})


/**
 * Jail user until they've created a username
 */
Router.onBeforeAction(function() {
    if (Meteor.isClient) {
        if (Roles.userIsInRole(Meteor.user(), ['pending'])) {
            this.render('create-profile')
            this.redirect('/create-profile')
        } else {
            this.next()
        }
    }
}, { except: ['logout'] })

Router.onBeforeAction(function() {

    /**
     * resolve notifications
     * @todo: if user is already at resolve path, don't insert to db
     * @todo: garbage collect old notifications? only keep 10 per user or so?
     */
    if(Meteor.isClient){
        // trailing slash safety check
        var path = this.location.get().path
        if(path[path.length-1] !== '/') path += '/'

        // toggle resolved notifications
        Notification.find({path: path, checked: false}).forEach(function (notification) {
            Meteor.call('checkNotification', notification._id)
        })
    }

    /**
     * permit certain routes for users not signed in
     */
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

    // these routes are open to non-registered users
}, { except: ['join', 'help', 'chat', 'readings', 'speakers', 'stories', 'timeline'] })

/**
 * public chatroom
 */
Router.route('/chat', {
    action: function(){
        this.render('chat')
    }
})

/**
 * list of notifications
 */
Router.route('/notifications', {
    action: function(){
        this.render('notifications')
    }
})

/**
 * list of private chat (sessions/threads)?
 *
 * @todo rethink this
 * @todo why does waitOn get called many times?
 */
Router.route('/messages', {
    waitOn: function() {
        var toWaitOn = []

        if(!Meteor.user()) return toWaitOn

        function getOtherMember(member1, member2){
            return member1 === Meteor.user().username ? member2 : member1
        }

        MessageSessions.find({members: Meteor.user().username}).map(function(session) {
            var otherMember = getOtherMember(session.members[0], session.members[1])
            toWaitOn.push(
                Meteor.subscribe('message', otherMember),
                Meteor.subscribe('profilePic', otherMember)
            )
        })

        toWaitOn.push(Meteor.subscribe('message'))

        return toWaitOn
    },
    action: function(){
        this.render('messages')
    }
})

/**
 * private chat (session/thread)? with :username
 */
Router.route('/messages/:username', {
    waitOn: function(){
        var toWaitOn = []

        if(!Meteor.user()) return toWaitOn

        function getOtherMember(member1, member2){
            return member1 === Meteor.user().username ? member2 : member1
        }

        MessageSessions.find({members: Meteor.user().username}).map(function(session) {
            var otherMember = getOtherMember(session.members[0], session.members[1])
            toWaitOn.push(
                Meteor.subscribe('message', otherMember),
                Meteor.subscribe('profilePic', otherMember)
            )
        })

        toWaitOn.push(Meteor.subscribe('message'))

        return toWaitOn

        //return Meteor.subscribe('message', this.params.username)
    },
    action: function(){
        this.render('message', {
            data: {
                username: this.params.username
            }
        })
    }
})

/**
 * list of users
 */
Router.route('/users', {
    waitOn: function() {
        return Meteor.subscribe('userList')
    },
    action: function() {
        this.render('userlist')
    }
})

/**
 * public profile of :username
 */
Router.route('/users/:username', {
    waitOn: function(){
        return Meteor.subscribe('userPublic', this.params.username)
    },
    action: function(){
        this.render('userProfile', {
            data: {
                username: this.params.username
            }
        })
    }
})


/**
 * loading test
 */
Router.route('/loading', {
    action: function() {
        this.render('loading')
    }
})

/**
 * ??
 */
Router.route('/', {
    action: function(){
        this.render('dashboard')
    }
})

/**
 * signup form
 */
Router.route('join', {
    layoutTemplate: 'splash',
    loadingTemplate: 'loading',
    action: function(){
        this.render('join')
    }
})

/**
 * signin form
 */
Router.route('/signin', {
    layoutTemplate: 'splash',
    loadingTemplate: 'loading',

    waitOn: function() {
        return subs.subscribe('userCount')
    },
    action: function(){
        this.render('signin')
    }
})

/**
 * Profile creation page for social media logins
 */
Router.route('/create-profile', {
    action: function() {
        this.render('createProfile')
    }
})

/**
 * logout button
 * @todo could be a button with an event: 'Meteor.logout()' and a redirect?
 */
Router.route('/logout', {
    action: function() {
        Meteor.logout()
        this.render('join')
    }
})

/**
 * ?
 */
Router.route('/profile', {
    action: function() {
        this.render('profileUpdate')
    }
})

/**
 * ?
 */
Router.route('/account', {
    action: function() {
        this.render('accountSettings')
    }
})

/**
 *  list of popular statuses 
 */
Router.route('/timeline', {
    waitOn: function() {
        return Meteor.subscribe('timeline')
    },
    action: function() {
        this.render('timeline')
    }
})
