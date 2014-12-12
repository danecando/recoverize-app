
Template.messages.helpers({
    messagesList: function(){
        return Message.find().fetch().reduce(function(arr, message){
            var name = message.to === Meteor.user().username ? message.from : message.to
            if(arr.indexOf(name) === -1 && name !== Meteor.user().username) arr.push(name)
            return arr
        }, [])
    }
})
