
Template.messages.helpers({
    messagesList: function(){
        return MessageSessions.find().map(function(session){
            var otherMember = getOtherMember(session.members[0], session.members[1])
            return {
                username: otherMember,
                unreadMessageCount: Notification.find({path:'/messages/'+otherMember+'/', checked: false}).count(),
                totalMessageCount: session.messageCount,
                lastMessage: getLastMessage(otherMember)
            }
        }).sort(function(b, a){
            return a.lastMessage.timestamp - b.lastMessage.timestamp
        })
    }
})

function getOtherMember(member1, member2){
    return member1 === Meteor.user().username ? member2 : member1
}

function getLastMessage(otherMember){
    var lastMsg = MessageBuckets.findOne({$and: [{members: Meteor.user().username}, {members: otherMember}]})
    if(lastMsg){
        return lastMsg.messages[lastMsg.messages.length-1]
    }
    else{
        // messageList helper requires a timestamp!
        return {timestamp:0}
    }
}