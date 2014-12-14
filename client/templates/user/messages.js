
Template.messages.helpers({
    messagesList: function(){
        return MessageSessions.find().map(function(session){
            var otherMember = session.members.indexOf(Meteor.user().username) === 0 ? session.members[1] : session.members[0]
            return {
                username: otherMember,
                unreadMessageCount: Notification.find({path:'/messages/'+otherMember+'/', checked: false}).count()
            }
        })
    }
})
