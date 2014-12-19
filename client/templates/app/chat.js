
Template.chat.rendered = function(template) {
    $('#page').addClass('chat')
    var $chatWindow = document.querySelector('.chat-area')
    $chatWindow.scrollTop = $chatWindow.scrollHeight
};

Template.chat.destroyed = function() {
    $('#page').removeclass('chat')
}

Template.chat.events({
    'keydown .chat-input input': function(e){
        if(e.which === 13) {
            sendMessage();
        }
    },
    'click .chat-input button': function(){
        sendMessage();
    },
    'click .ul-btn': function(event, template) {
        template.$('.chat-container').toggleClass('ul-open');
    }
});

Template.chat.helpers({
    messages: function(event, template) {
        var messages = Chat.find({}, {sort: {timestamp: +1}})
        messages.observeChanges({
            added: function () {
            }
        })
        return messages
    },
    listOfUsers: function(){
        return Presences.find()
    }
});

function sendMessage(){
    var input = $('.chat-input input');

    if(input.val().trim() !== '') {
        Meteor.call('addChat', input.val())
        input.val('')
    }
}
