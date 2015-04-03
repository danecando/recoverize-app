// Subscription Caching
var subs = new SubsManager();

Router.configure({
    layoutTemplate: 'layout',
    notFoundTemplate: 'notFound',
    loadingTemplate: 'loading',
    trackPageView: true,

    waitOn: function() {
        return [
            Meteor.subscribe('userData'),
            Meteor.subscribe('notification'),
            Meteor.subscribe('presence')
            //Meteor.subscribe('allUsers')
        ];
    }
});

dataReadyHold = null;

if (Meteor.isClient) {
    // Keep showing the launch screen on mobile devices until we have loaded
    // the app's data
    dataReadyHold = LaunchScreen.hold();
}

/**
 * Jail user until they've created a username, or if they have been banned
 */
Router.onBeforeAction(function() {
    if (Meteor.isClient) {
        if (Roles.userIsInRole(Meteor.user(), ['pending'])) {
            this.render('create-profile');
            this.redirect('/create-profile');
        } else if (Roles.userIsInRole(Meteor.user(), ['banned'])) {
            this.render('banned');
            this.redirect('/banned');
        } else {
            this.next();
        }
    } else {
        this.next();
    }
}, { except: ['logout'] });

/**
 * permit certain routes for users not signed in
 */
Router.onBeforeAction(function() {
    if(Meteor.isClient) {
        if (!Meteor.userId()) {
            this.render('signin');
            this.redirect('/signin');
        } else {
            this.next();
        }
    } else {
        this.next();
    }
    // these routes are open to non-registered users
}, { except: ['join', 'forgotten', 'reset', 'help', 'chat', 'daily-readings', 'speakers', 'stories'] });

/**
 * resolve notifications
 * @todo: if user is already at resolve path, don't insert to db
 */
Router.onBeforeAction(function() {
    if (Meteor.isClient) {
        // trailing slash safety check
        var path = this.location.get().path;
        if (path[path.length-1] !== '/') {
            path += '/';
        }

        // toggle resolved notifications
        Notification.find({path: path}).forEach(function(notification) {
            Meteor.call('checkNotification', notification._id);
        });

        this.next();
    } else {
        this.next();
    }
});

/**
 * public chatroom
 */
Router.route('/chat', {
    waitOn: function() {
        return Meteor.subscribe('chat');
    },
    action: function() {
        this.render('chat');
    },
    after: function() {
        document.title = 'Live 12 step recovery chat room - Recoverize';
    }
});

/**
 * list of notifications
 */
Router.route('/notifications', {
    action: function() {
        this.render('notifications');
    },
    after: function() {
        document.title = 'Notifications';
    }
});

/**
 * list of private chat (sessions/threads)?
 *
 * @todo rethink this
 * @todo why does waitOn get called many times?
 */
Router.route('/messages', {
    waitOn: function() {
        var toWaitOn = [];

        if (!Meteor.user()) {
            return toWaitOn;
        }

        function getOtherMember(member1, member2){
            return member1 === Meteor.user().username ? member2 : member1;
        }

        MessageSessions.find({members: Meteor.user().username}).map(function(session) {
            var otherMember = getOtherMember(session.members[0], session.members[1]);
            toWaitOn.push(
                Meteor.subscribe('message', otherMember),
                subs.subscribe('profilePic', otherMember)
            );
        });

        toWaitOn.push(Meteor.subscribe('message'));

        return toWaitOn;
    },
    action: function() {
        this.render('messages');
    },
    after: function() {
        document.title = 'Messages';
    }
});

/**
 * private chat (session/thread)? with :username
 */
Router.route('/messages/:username', {
    waitOn: function() {
        var toWaitOn = [];

        if (!Meteor.user()) {
            return toWaitOn;
        }

        function getOtherMember(member1, member2) {
            return member1 === Meteor.user().username ? member2 : member1;
        }

        MessageSessions.find({members: Meteor.user().username}).map(function(session) {
            var otherMember = getOtherMember(session.members[0], session.members[1]);
            toWaitOn.push(
                Meteor.subscribe('message', otherMember),
                Meteor.subscribe('profilePic', otherMember)
            );
        });

        toWaitOn.push(Meteor.subscribe('message'));

        return toWaitOn;
    },
    action: function() {
        this.render('message', {
            data: {
                username: this.params.username
            }
        });
    },
    after: function() {
        document.title = 'Private Message';
    }
});

/**
 * Status Page
 */
Router.route('/status', {
    waitOn: function() {
        return Meteor.subscribe('userStatuses', Meteor.user().username, 1);
    },
    action: function() {
        this.render('newStatus');
    },
    after: function() {
        document.title = 'Create a new share';
    }
});

/**
 * Daily Readings
 */
Router.route('/daily-readings', {
    waitOn: function() {
        var today = new Date();
        var dateKey = (today.getMonth()+1) + '-' + today.getDate();
        return subs.subscribe('dailyReadings', dateKey);
    },
    action: function() {
        this.render('dailyReadings');
    },
    after: function() {
        document.title = 'Daily 12 step meditation readings - Recoverize';
    }
});

/**
 * checklist stuff
 */
Router.route('/checklist', {
    waitOn: function() {
        return subs.subscribe('tasks');
    },
    action: function() {
        this.render('checklist');
    },
    after: function() {
        document.title = 'Your daily recovery checklist';
    }
});

/**
 * Recovery stories
 */
Router.route('/recovery-stories', {
    action: function() {
        this.render('recoveryStories');
    },
    after: function() {
        document.title = 'Real 12 step recovery stories - Recoverize';
    }
});

/**
 * Speaker tapes
 */
Router.route('/speaker-tapes', {
    action: function() {
        this.render('speakerTapes');
    },
    after: function() {
        document.title = 'Speaker tapes from AA, NA, CA, and more - Recoverize';
    }
});

/**
 * list of users
 */
Router.route('/users', {
    waitOn: function() {
        return subs.subscribe('userCount');
    },
    action: function() {
        this.render('userlist');
    },
    after: function() {
        document.title = 'Connect with others working a program of recovery - Recoverize';
    }
});

/**
 * public profile of :username
 */
Router.route('/users/:username', {
    waitOn: function() {
        return [
            Meteor.subscribe('userPublic', this.params.username),
        ];
    },
    action: function() {
        this.render('userProfile', {
            data: {
                username: this.params.username
            }
        });
    },
    after: function() {
        document.title = this.params.username + '\'s profile';
    }
});

/**
 * status routes
 */
Router.route('/status/:id', {
    waitOn: function() {
        return Meteor.subscribe('status', this.params.id);
    },
    action: function() {
        this.render('statusPage', {
            data: {
                id: this.params.id
            }
        });
    },
    after: function() {
        document.title = 'User share';
    }
});

/**
 * loading test
 */
Router.route('/loading', {
    action: function() {
        this.render('loading');
    }
});

/**
 * User dashboard
 */
Router.route('/', {
    waitOn: function() {
        return subs.subscribe('tasks');
    },
    action: function() {
        this.render('dashboard');
    },
    after: function() {
        if (Meteor.user()) {
            document.title = Meteor.user().username + '\'s Dashboard';
        }
    }
});

/**
 * Signup form
 */
Router.route('join', {
    layoutTemplate: 'splash',
    loadingTemplate: 'loading',
    action: function() {
        this.render('join');
    },
    after: function() {
        document.title = 'Join Recoverize. The social 12 step recovery app';
    }
});

/**
 * signin form
 */
Router.route('/signin', {
    layoutTemplate: 'splash',
    loadingTemplate: 'loading',

    waitOn: function() {
        return subs.subscribe('userCount');
    },
    action: function() {
        this.render('signin');
    },
    after: function() {
        document.title = 'Recoverize - The social 12 step recovery app';
    }
});

/**
 * Forgotten password submit
 */
Router.route('/forgotten', {
    layoutTemplate: 'splash',
    loadingTemplate: 'loading',
    action: function() {
        this.render('forgotten');
    },
    after: function() {
        document.title = 'Reset your password';
    }
});

/**
 * Password reset page
 */

Router.route('/reset', {
    layoutTemplate: 'splash',
    loadingTemplate: 'loading',
    action: function() {
        this.render('reset', {
            data: {
                token: this.params.query.t
            }
        });
    },
    before: function() {
      if (!this.params.query.t) {
          this.render('signin');
          this.redirect('/signin');
          return;
      } else {
          this.next();
      }
    },
    after: function() {
        document.title = 'Reset your password';
    }
});

/**
 * Profile creation page for social media logins
 */
Router.route('/create-profile', {
    layoutTemplate: 'splash',
    loadingTemplate: 'loading',
    action: function() {
        this.render('createProfile');
    },
    after: function() {
        document.title = 'Create your user profile';
    }
});

/**
 * Page just for updating profile picture on cordova devices
 */
Router.route('/profile-picture', {
    action: function() {
        this.render('profilePicture');
    },
    after: function() {
        document.title = 'Upload a profile picture';
    }
});

/**
 * Banned user
 */
Router.route('/banned', {
    action: function() {
        if (Roles.userIsInRole(Meteor.user(), ['banned'])) {
            this.render('banned');
        } else {
            this.render('notFound');
        }
    },
    after: function() {
        document.title = 'You have been banned';
    }
});

/**
 * Get help page
 */
Router.route('/help', {
    action: function() {
        this.render('help');
    },
    after: function() {
        document.title = 'Get addiction treatment help from a specialist'
    }
});

/**
 * logout button
 */
Router.route('/logout', {
    action: function() {
        Meteor.logout();
        this.render('join');
    }
});

/**
 * Settings page
 */
Router.route('/settings', {
    action: function() {
        this.render('settings');
    }
});

/**
 * Users profile page
 */
Router.route('/profile', {
    action: function() {
        this.render('profileUpdate');
    },
    after: function() {
        document.title = 'Update your profile';
    }
});

/**
 * Update account settings
 */
Router.route('/account', {
    action: function() {
        this.render('accountSettings');
    },
    after: function() {
        document.title = 'Update your account settings';
    }
});

/**
 *  Status timeline
 */
Router.route('/timeline', {
    waitOn: function() {
        // todo: only subscribe users with shares showing
        return subs.subscribe('userPublic');
    },
    action: function() {
        this.render('timeline');
    },
    after: function() {
        document.title = 'User status timeline';
    }
});

/**
 * Invite a friend
 */
Router.route('/invite', {
    action: function() {
        this.render('invite');
    }
});

/**
 * Report
 */
Router.route('/report', {
    action: function() {
        this.render('report');
    }
});

/**
 * Faqs
 */
Router.route('/faqs', {
    action: function() {
        this.render('faqs');
    }
});

/**
 * Serenity points
 */
Router.route('/serenity', {
    action: function() {
        this.render('serenity');
    }
});