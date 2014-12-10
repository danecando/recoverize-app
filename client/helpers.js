
/**
 * matches @mentions in a chunk of text and replaces them with a link
 * @todo give it a css class
 */
UI.registerHelper('linkMentions', function(context){
    if(context){
        var str = context.replace(/\B@[a-z0-9_-]+/gi, function(match){
            return '<a href="/user/' + match.slice(1) + '">' + match + '</a>'
        });
        return new Handlebars.SafeString(str);
    }
});
