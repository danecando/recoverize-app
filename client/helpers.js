/**
 * if equals helpers
 */
UI.registerHelper('$eq', function (a, b) {
    return (a === b); //Only text, numbers, boolean - not array & objects
});

/**
 * matches @mentions in a chunk of text and replaces them with a link
 */
UI.registerHelper('linkMentions', function(context){
    if(context){
        var str = context.replace(/\B@[a-z0-9_-]+/gi, function(match){
            return '<a class="userLink" href="/users/' + match.slice(1) + '">' + match + '</a>'
        })
        return new Handlebars.SafeString(str)
    }
})

/**
 * shows current users notification count
 */
UI.registerHelper('notificationCount', function(){
    return Notification.find({type: {$not: 'message'}, checked: false}).count()
})

/**
 * shows current users message notification count
 */
UI.registerHelper('messageNotificationCount', function(){
    return Notification.find({type: 'message', checked: false}).count()
})

/**
 * returns true if currentUser follows @username
 */
UI.registerHelper('currentUserFollows', function(username){
    if(username){
        return Meteor.user().follows.indexOf(username) !== -1
    }else{
        return false
    }
})

/**
 * return true if @username follows currentUser
 */
UI.registerHelper('followsCurrentUser', function(username){
    if(username){
        return Meteor.user().followers.indexOf(usernme) !== -1
    }else{
        return false
    }
})

/**
 * return current users username or 'Guest' as fallback
 */
UI.registerHelper('currentUserUsername', function(){
    return Meteor.user() ? Meteor.user().username : 'Guest'
})

/**
 * return current users serenity or 0 as fallback
 */
UI.registerHelper('currentUserSerenity', function(){
    return Meteor.user() ? Meteor.user().serenity : 0
})

UI.registerHelper('presenceOf', function(username){
    var user = Presences.findOne({username: username})
    return user ? user.state : 'offline'
})

/**
 * get profilePic of currentUser (by default) or specified `username`
 * returns Identicon as profilePic fallback
 */
UI.registerHelper('profilePic', function(username) {
    var user

    if(!username && Meteor.user()){
        user = Meteor.user()
    }else if(username && typeof username === 'string'){
        user = Meteor.users.findOne({username: username})
    }else{
        return false
    }

    if(!user) return false

    if(user.profile && user.profile.profilePic) {
        return user.profile.profilePic
    }else if(user.identicon){
        var identicon = new Identicon(user.identicon, 256).toString()
        return 'data:image/png;base64,' + identicon.toString()
    }else{
        return false
    }
})

/**
 * generate color for users
 */
UI.registerHelper('userColor', function(username) {
    var hash = 5381;
    for (var i = 0; i < username.length; i++) {
        hash = ((hash << 5) + hash) + username.charCodeAt(i)
    }

    var r = (hash & 0xFF0000) >> 16;
    var g = (hash & 0x00FF00) >> 8;
    var b = hash & 0x0000FF;
    return "#" + ("0" + r.toString(16)).substr(-2) + ("0" + g.toString(16)).substr(-2) + ("0" + b.toString(16)).substr(-2)
})


/**
 * Program intro
 */
UI.registerHelper('programIntro', function(program) {
    switch(program) {
        case 'aa':
            return 'alcoholic'
        break
        case 'na':
            return 'addict'
        break
        default:
            return 'addict'
        break
    }
})

/**
 * Clean or sober
 */
UI.registerHelper('cleanOrSober', function(program) {
    switch(program) {
        case 'aa':
            return 'sober'
        break
        case 'na':
            return 'clean'
        break
        default:
            return 'clean'
        break
    }
})

/**
 * Message direction
 */
UI.registerHelper('messageDirection', function(from) {
    if (from === Meteor.user().username) return 'to'
    else return 'from'
})


/**
 * Elapsed time
 */
UI.registerHelper('elapsedDays', function(date) {
    return moment().diff(date, 'days')
})

/**
 * reactive relative time using momentjs
 */
;(function(){
    var timeTick = new Deps.Dependency()

    Meteor.setInterval(function(){
        timeTick.changed()
    }, 1000)

    var reactive = function(mmt){
        timeTick.depend()
        return mmt.fromNow()
    }

    UI.registerHelper('relativeTime', function(context){
        return reactive(moment(context))
    })
})()
