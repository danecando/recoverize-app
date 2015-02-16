Template.chat.created = function() {
    this.listOfUsers = new ReactiveVar([]);

    var self = this;

    Tracker.autorun(function() {
        var presences = Presences.find().fetch();
        presences = _.uniq(presences, function(p) {
            return p.username;
        });
        self.listOfUsers.set(presences);
    });
};

Template.chat.rendered = function() {
    var $chatWindow = document.querySelector('.chat-area');
    $chatWindow.scrollTop = $chatWindow.scrollHeight;
};

Template.chat.events({
    'keydown .chat-input textarea': function(e) {
        if(e.which === 13) {
            e.preventDefault();
            sendMessage();
        }
    },
    'click #send-chat': function() {
        sendMessage();
    },
    'click .ul-btn': function(event, template) {
        template.$('.chat-container').toggleClass('ul-open');
    }
});

Template.chat.helpers({
    messages: function() {
        var messages = Chat.find({}, {sort: {timestamp: +1}});
        return messages;
    },
    listOfUsers: function() {
        return Template.instance().listOfUsers.get();
    }
});

function sendMessage() {
    var input = $('.chat-input textarea');

    if (input.val().trim() !== '') {
        Meteor.call('addChat', input.val());
        input.val('');
    }
}
