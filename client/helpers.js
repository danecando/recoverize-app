/**
 * matches @mentions in a chunk of text and replaces them with a link
 */
Template.registerHelper('linkMentions', function(context){
    if (context) {
        var str = context.replace(/\B@[a-z0-9_-]+/gi, function(match) {
            return '<a class="at-mention" style="color: ' + getColor(match.slice(1)) + '" href="/users/' + match.slice(1).toLowerCase() + '">' + match.toLowerCase() + '</a>';
        });
        str = urlize(str, {
            nofollow: true,
            target: '_blank'
        }); // ghetto shoehorn for urls to links
        return new Handlebars.SafeString(str);
    }
});

/**
 * returns currentUser's notification count
 */
Template.registerHelper('notificationCount', function(){
    return Notification.find({type: {$not: 'message'}}).count();
});

/**
 * returns currentUser's message notification count
 */
Template.registerHelper('messageNotificationCount', function(){
    return Notification.find({type: 'message'}).count();
});

/**
 * returns true if currentUser follows @username
 */
Template.registerHelper('currentUserFollows', function(username){
    if (username) {
        return Meteor.user().follows.indexOf(username) !== -1;
    } else {
        return false;
    }
});

/**
 * return true if @username follows currentUser
 */
Template.registerHelper('followsCurrentUser', function(username){
    if (username) {
        return Meteor.user().followers.indexOf(usernme) !== -1;
    } else {
        return false;
    }
});

/**
 * return current users username or 'Guest' as fallback
 */
Template.registerHelper('currentUserUsername', function(){
    return Meteor.user() ? Meteor.user().username : 'Guest';
});

/**
 * return serenity points of currentUser
 */
Template.registerHelper('currentUserSerenity', function(){
    return Meteor.user() ? Meteor.user().serenity : 0;
});

Template.registerHelper('presenceOf', function(username){
    var user = Presences.findOne({username: username});
    return user ? user.state : 'offline';
});

/**
 * get profilePic of currentUser (by default) or specified @username
 */
Template.registerHelper('profilePic', function(username, size) {
    var user;

    if (!username && Meteor.user()) {
        user = Meteor.user();
    } else if (username && typeof username === 'string') {
        user = Meteor.users.findOne({username: username});
    } else {
        return false;
    }

    // fix this @see #84
    if (user && user.profile && user.profile.profilePic) {
        var profilePic = (size === 'thumb' && user.profile.profilePicThumb) ? user.profile.profilePicThumb : user.profile.profilePic;
        return new Handlebars.SafeString("https://d6gyptuog2clr.cloudfront.net/" + profilePic);
    }

    return false;
});

/**
 * generate color for users
 */
Template.registerHelper('userColor', function(username) {
    if (username) return getColor(username.toLowerCase());
});

/**
 * Program intro
 */
Template.registerHelper('programIntro', function(program) {
    var PROGRAMS = {
        'aa': 'alcoholic',
        'na': 'addict'
    };

    return PROGRAMS[program] || 'addict';
});

/**
 * Append base url to image paths
 */
Template.registerHelper('getImgURL', function(path) {
    return "https://d6gyptuog2clr.cloudfront.net/" + path;
});

/**
 * Clean or sober
 */
Template.registerHelper('cleanOrSober', function(program) {
    var PROGRAMS = {
        'aa': 'sober',
        'na': 'clean'
    };

    return PROGRAMS[program] || 'clean';
});

/**
 * Format notification message
 */
Template.registerHelper('notification', function(type, from) {

    switch(type) {
        case 'follow':
            return from + ' is now following you'
            break;
        case 'status':
            return from + ' mentioned you in a share'
            break;
        case 'chat':
            return from + ' mentioned you in the chat room'
            break;
        default:
            break;
    }
});

/**
 * Message direction
 */
Template.registerHelper('messageDirection', function(from) {
    if (from == Meteor.user().username) {
        return 'to';
    } else {
        return 'from';
    }
});

/**
 * Elapsed time
 */
Template.registerHelper('elapsedDays', function(date) {
    return moment().diff(date, 'days');
});

Template.registerHelper('sortDirection', function(dir) {
    return dir < 0 ? 'asc': 'desc';
});

Template.registerHelper('equals', function(a, b) {
    return a == b;
});

/**
 * reactive relative time using momentjs
 */
;(function(){
    var timeTick = new Deps.Dependency();

    Meteor.setInterval(function() {
        timeTick.changed();
    }, 10000);

    var reactive = function(mmt) {
        timeTick.depend();
        return mmt.fromNow(true);
    }

    Template.registerHelper('relativeTime', function(context) {
        return reactive(moment(context));
    });
})();

function getColor(username) {
    var hash = 5381;
    for (var i = 0; i < username.length; i++) {
        hash = ((hash << 5) + hash) + username.charCodeAt(i);
    }

    var r = (hash & 0xFF0000) >> 16;
    var g = (hash & 0x00FF00) >> 8;
    var b = hash & 0x0000FF;
    return "#" + ("0" + r.toString(16)).substr(-2) + ("0" + g.toString(16)).substr(-2) + ("0" + b.toString(16)).substr(-2);
}

Meteor.Spinner.options = {
    color: '#fff'
};