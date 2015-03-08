/**
 * this template expects data.username
 * data.username is the username of the user currentUser is chatting with
 */


Template.message.created = function() {
    this.messages = new ReactiveVar(MessageBuckets.find({$and: [{members: Meteor.user().username}, {members: Template.instance().data.username}]}, {sort: {page: +1}}));
};

var queryHandle;
Template.message.rendered = function() {
    Meteor.startup(function() {
        autoScroll();

        queryHandle = Template.instance().messages.get().observe({
            added: function() {
                autoScroll();
            },
            changed: function(id, fields) {
                autoScroll();
            }
        });
    });

    // make sure an user doesn't chat with himself
    // @todo handle this before this template is even rendered
    if (Meteor.user() && this.data.username === Meteor.user().username) {
        Router.go('/messages');
    }
};

Template.message.destroyed = function() {
  queryHandle.stop();
};

Template.message.events({
    'keydown .message-input textarea': function(e) {
        if (e.which === 13) {
            e.preventDefault();
            sendMessage(this.username);
        }
    },
    'click #send-message': function() {
        sendMessage(this.username);
    },
    'click .older-messages': function(){
        Meteor.subscribe('message', this.username, getOldestPage(this.username) -1);
    }
});


Template.message.helpers({

    /**
     * combines message arrays from various pages into a single message array
     * @return {Array}
     */
    messages: function() {
        return Template.instance().messages.get()
            .fetch()
            .reduce(function(arr, page) {
                page.messages.forEach(function(message){
                    arr.push(message)
                });
                return arr;
            }, []);
    },

    /**
     * is there another page of messages we can load?
     * @return {Boolean}
     */
    olderPages: function(){
        return (getOldestPage(this.username) > 0);
    }

});

/**
 * @param {String} username of message recipient
 */
function sendMessage(to) {
    if (!to) return;

    var input = $('.message-input textarea')
    if (input.val().trim() !== '') {
        Meteor.call('addMessage', input.val(), to);
        input.val('');
        autoScroll();
    }
}

/**
 * returns the oldest messages page between username and currentUser loaded by client
 *
 * @param {String}
 * @return {Number}
 */
function getOldestPage(username) {
    if (!Meteor.user()) return 0;

    var oldestBucket = MessageBuckets.findOne(
        {$and: [{members: Meteor.user().username}, {members: username}]},
        {sort: {page: +1}}
    );

    if (oldestBucket) {
        return oldestBucket.page;
    } else {
        return 0;
    }
}


function autoScroll() {
    var $messageWindow = document.querySelector('.conversation');
    if ($messageWindow) $messageWindow.scrollTop = $messageWindow.scrollHeight;
}