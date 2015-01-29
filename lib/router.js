// Subscription Caching
var subs = new SubsManager()

Router.configure({
    layoutTemplate: 'layout',
    notFoundTemplate: 'notFound',
    loadingTemplate: 'loading',

    waitOn: function() {
        return [
            Meteor.subscribe('notification'),
            Meteor.subscribe('chat'),
            Meteor.subscribe('presence')
        ]
    }
})

/**
 * Jail user until they've created a username, or if they have been banned
 */
Router.onBeforeAction(function() {
    if (Meteor.isClient) {
        if (Roles.userIsInRole(Meteor.user(), ['pending'])) {
            this.render('create-profile')
            this.redirect('/create-profile')
        } else if (Roles.userIsInRole(Meteor.user(), ['banned'])) {
            this.render('banned')
            this.redirect('/banned')
        } else {
            this.next()
        }
    } else {
        this.next()
    }
}, { except: ['logout'] })

/**
 * permit certain routes for users not signed in
 */
Router.onBeforeAction(function() {
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
 * resolve notifications
 * @todo: if user is already at resolve path, don't insert to db
 */
Router.onBeforeAction(function() {
    if(Meteor.isClient){

        // trailing slash safety check
        var path = this.location.get().path
        if(path[path.length-1] !== '/') path += '/'

        // toggle resolved notifications
        Notification.find({path: path}).forEach(function (notification) {
            Meteor.call('checkNotification', notification._id)
        })

        this.next()
    }else{
        this.next()
    }
})

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
 * Status Page
 */
Router.route('/status', {
    waitOn: function(){
        return Meteor.subscribe('userPublic', Meteor.user().username)
    },
    action: function() {
        this.render('newStatus')
    }
})

/**
 * Daily Readings
 */
Router.route('/daily-readings', {
    action: function() {
        this.render('dailyReadings')
    }
})

/**
 * checklist stuff
 */
Router.route('/checklist', {
    waitOn: function() {
        return Meteor.subscribe('tasks')
    },
    action: function() {
        this.render('checklist')
    }
})

/**
 * Recovery stories
 */
Router.route('/recovery-stories', {
    action: function() {
        this.render('recoveryStories')
    }
})

/**
 * Speaker tapes
 */
Router.route('/speaker-tapes', {
    action: function() {
        this.render('speakerTapes')
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
 * status routes
 */
Router.route('/status/:id', {
    waitOn: function(){
        return Meteor.subscribe('status', this.params.id)
    },
    action: function(){
        this.render('statusPage', {
            data: {
                id: this.params.id
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
    layoutTemplate: 'splash',
    loadingTemplate: 'loading',
    action: function() {
        this.render('createProfile')
    }
})

/**
 * Banned user
 */
Router.route('/banned', {
    action: function() {
        if (Roles.userIsInRole(Meteor.user(), ['banned'])) {
            this.render('banned')
        } else {
            this.render('notFound')
        }
    }
})

/**
 * Get help page
 */
Router.route('/help', {
    action: function() {
        this.render('help')
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
