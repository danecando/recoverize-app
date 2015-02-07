Template.notifications.helpers({
    notifications: function(){
        var notify = Notification.find({type: {$not: 'message'}})
        if (notify.count()) return notify
        else return false
    }
})

Template.notifications.events({
    'click #clear-notifications': function(e, template) {
        Meteor.call('clearNotifications')
    }
})