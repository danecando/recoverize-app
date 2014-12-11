
/**
 * matches @mentions in a chunk of text and replaces them with a link
 */
UI.registerHelper('linkMentions', function(context){
    if(context){
        var str = context.replace(/\B@[a-z0-9_-]+/gi, function(match){
            return '<a class="userLink" href="/user/' + match.slice(1) + '">' + match + '</a>'
        })
        return new Handlebars.SafeString(str)
    }
})

/**
 * shows current users notification count
 */
UI.registerHelper('notificationCount', function(context){
    return Notification.find().count()
})
