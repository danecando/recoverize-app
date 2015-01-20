
Template.notifications.helpers({
    notifications: function(){
        var notify = Notification.find({type: {$not: 'message'}})
        if (notify.count()) return notify
        else return false
    }
})


// todo: clear button clears events