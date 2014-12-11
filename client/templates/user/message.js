
Template.message.helpers({
    messages: function(){
        return Message.find()
    }
})


// copy pasted from chatroom
// fix
Template.message.events({
    'keydown .input-area input': function (e) {
        if(e.which === 13) {
            sendMessage(this.username);
        }
    },
    'click .input-area button': function () {
        sendMessage(this.username);
    }
});

Template.chat.helpers({
    messages: function() {
        return Chat.find({}, {sort: {timestamp: +1}});
    }
});

function sendMessage(to) {
    var input = $('.input-area input');

    if(input.val().trim() !== '') {
        Meteor.call('addMessage', input.val(), to);
        input.val('')
    }
}
