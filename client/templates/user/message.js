
Template.message.events({
    'keydown .input-area input': function(e){
        if(e.which === 13) {
            sendMessage(this.username)
        }
    },
    'click .input-area button': function(){
        sendMessage(this.username)
    },
    'click .loadOlderMessages': function(){
        var oldestBucket = MessageBuckets.findOne(
            {$and: [{members: Meteor.user().username}, {members: this.username}]},  
            {sort: {num: +1}}
        )
        if(oldestBucket){
            oldestBucket = oldestBucket.num
        }
        Meteor.subscribe('message', this.username, oldestBucket-1)
    }
})

Template.message.rendered = function(){
    // make sure an user doesn't chat with himself
    // if(Meteor.user() && this.data.username === Meteor.user().username){
    //     Router.go('/messages')
    // }
}

Template.message.helpers({
    messages: function() {
        return MessageBuckets.find({$and: [{members: Meteor.user().username}, {members: this.username}]}, {sort: {num: +1}})
            .fetch()
            .reduce(function(arr, bucket){
                bucket.messages.forEach(function(message){
                    arr.push(message)
                })
                return arr
            }, [])
    },
    moreResults: function(){
        var oldestBucket = MessageBuckets.findOne(
            {$and: [{members: Meteor.user().username}, {members: this.username}]},  
            {sort: {num: +1}}
        )
        if(oldestBucket){
            return oldestBucket.num > 0
        }else{
            return false
        }
    }
})

function sendMessage(to) {
    var input = $('.input-area input');

    if(input.val().trim() !== '') {
        Meteor.call('addMessage', input.val(), to)
        input.val('')
    }
}
