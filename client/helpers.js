
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
