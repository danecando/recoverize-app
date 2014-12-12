
Template.notifications.helpers({
    notifications: function(){
        return Notification.find({type: {$not: 'message'}, checked: false}).fetch()
    }
})
