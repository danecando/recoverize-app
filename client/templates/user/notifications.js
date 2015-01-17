
Template.notifications.helpers({
    notifications: function(){
        return Notification.find({type: {$not: 'message'}})
    }
})


// todo: clear button clears events