
Template.dashboard.helpers({
    todaysDate: function() {
        return moment().format('dddd, MMMM Do YYYY')
    },
    user: function() {
        return Meteor.user()
    },
    notifications: function(){
        var notify = Notification.find({type: {$not: 'message'}})
        if (notify.count()) return notify
        else return false
    },
    tasks: function() {
        return Tasks.find({}, { sort: { position: 1 }}).map(function(task, index) {
            task.index = index
            return task
        })
    },
    completed: function() {
        return Tasks.find({ checked: true })
    },
    newUsers: function() {
        return Meteor.users.find(
            { username: { $not: Meteor.user().username }}
        );
    }
});

Template.dashboard.events({

});
