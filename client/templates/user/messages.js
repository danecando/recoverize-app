
Template.messages.helpers({
    messagesList: function(){
        return Message.find().fetch().reduce(function(arr, message){
            var name = message.to === Meteor.user().username ? message.from : message.to
            if(!arr.some(function(obj){return obj.username===name}) && name !== Meteor.user().username){
                arr.push({
                    username: name, 
                    newMessageCount: Notification.find({path:'/messages/'+name+'/', checked: false}).count()
                })
            }
            return arr
        }, [])
    }
})
