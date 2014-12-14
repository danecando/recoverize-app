
Template.messages.helpers({
    messagesList: function(){
        return MessageSessions.find().map(function(session){
            return {
                username: session.members.indexOf(Meteor.user().username) === -1 ? session.members[0] : session.members[1],
                unreadMessageCount: Notification.find({path:'/messages/'+name+'/', checked: false}).count()
            }
        })
    }
})
