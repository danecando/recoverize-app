
/**
 * this template expects data.username
 * data.username is the username of the user currentUser is chatting with
 */

Template.message.events({
    'keydown .input-area input': function(e){
        if(e.which === 13) {
            sendMessage(this.username)
        }
    },
    'click .input-area button': function(){
        sendMessage(this.username)
    },
    'click .loadOlderPage': function(){
        Meteor.subscribe('message', this.username, getOldestPage(this.username) -1)
    }
})

Template.message.rendered = function(){
    // make sure an user doesn't chat with himself
    // @todo handle this before this template is even rendered
    if(Meteor.user() && this.data.username === Meteor.user().username){
        Router.go('/messages')
    }
}

Template.message.helpers({

    /**
     * combines message arrays from various pages into a single message array
     * @return {Array}
     */
    messages: function() {
        return MessageBuckets.find({$and: [{members: Meteor.user().username}, {members: this.username}]}, {sort: {num: +1}})
            .fetch()
            .reduce(function(arr, page){
                page.messages.forEach(function(message){
                    arr.push(message)
                })
                return arr
            }, [])
    },

    /**
     * is there another page of messages we can load?
     * @return {Boolean}
     */
    olderPages: function(){
        return (getOldestPage(this.username) > 0)
    }

})

/**
 * @param {String} username of message recipient
 */
function sendMessage(to) {
    if(!to) return

    var input = $('.input-area input')
    if(input.val().trim() !== '') {
        Meteor.call('addMessage', input.val(), to)
        input.val('')
    }
}

/**
 * returns the oldest messages page between username and currentUser loaded by client
 *
 * @param {String}
 * @return {Number}
 */
function getOldestPage(username){
    if(!Meteor.user()) return 0

    var oldestBucket = MessageBuckets.findOne(
        {$and: [{members: Meteor.user().username}, {members: username}]},  
        {sort: {num: +1}}
    )

    if(oldestBucket){
        return oldestBucket.num
    }else{
        return 0
    }
}
