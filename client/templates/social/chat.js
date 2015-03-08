Template.chat.created = function() {
    this.listOfUsers = new ReactiveVar([]);
    this.messages = new ReactiveVar(Chat.find({}, {sort: {timestamp: +1}}));

    var self = this;

    Tracker.autorun(function() {
        var presences = Presences.find().fetch();
        presences = _.uniq(presences, function(p) {
            return p.username;
        });
        self.listOfUsers.set(presences);
    });
};


var queryHandle;

Template.chat.rendered = function() {
    Meteor.startup(function() {
        autoScroll();
        queryHandle = Template.instance().messages.get().observe({
            added: function(doc) {
                autoScroll();
            }
        });
    });
};

Template.chat.destroyed = function() {
    queryHandle.stop();
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
        return Template.instance().messages.get();
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

function autoScroll() {
    var $chatWindow = document.querySelector('.chat-area');
    if ($chatWindow) $chatWindow.scrollTop = $chatWindow.scrollHeight;
}