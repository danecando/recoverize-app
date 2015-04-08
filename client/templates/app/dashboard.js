

Template.dashboard.created = function() {
    this.annis = new ReactiveVar([]);

    var self = this;
    Meteor.call('getAnniversaries', function(error, annis) {
        if (!error) {
            self.annis.set(annis);
        }
    });

};

Template.dashboard.helpers({
    todaysDate: function() {
        return moment().format('dddd, MMMM Do YYYY');
    },
    user: function() {
        return Meteor.user();
    },
    notifications: function(){
        var notify = Notification.find({type: {$not: 'message'}});
        return notify.count() ? notify : false;
    },
    tasks: function() {
        return Tasks.find({}, { sort: { position: 1 }}).map(function(task, index) {
            task.index = index;
            return task;
        });
    },
    completed: function() {
        return Tasks.find({ checked: true })
    },
    newUsers: function() {
        var username = Meteor.user().username || null;
        return Meteor.users.find(
            { username: { $not: username }},
            { limit: 6, reactive: false, sort: { createdAt: -1 } }
        );
    },
    anniversaries: function() {
        return Template.instance().annis.get();
    }
});

Template.dashboard.events({
    'click .btn-welcome': function(e, template) {
        properties.greetUser = $(e.target).attr('data-username');
    },
    'click .btn-congrats': function(e, template) {
        properties.congratulateUser = $(e.target).attr('data-username')
    }
});
