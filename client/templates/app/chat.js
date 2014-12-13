
Template.chat.events({
    'keydown .input-area input': function(e){
        if(e.which === 13) {
            sendMessage();
        }
    },
    'click .input-area button': function(){
        sendMessage();
    }
});

Template.chat.helpers({
    messages: function(){
        return Chat.find({}, {sort: {timestamp: +1}})
    },
    listOfUsers: function(){
        return Presences.find()
    }
});

function sendMessage(){
    var input = $('.input-area input');

    if(input.val().trim() !== '') {
        Meteor.call('addChat', input.val())
        input.val('')
    }
}
