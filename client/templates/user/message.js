
Template.message.events({
    'keydown .input-area input': function (e) {
        if(e.which === 13) {
            sendMessage(this.username);
        }
    },
    'click .input-area button': function () {
        sendMessage(this.username);
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
        return MessageBuckets.find({$and: [{members: Meteor.user().username}, {members: this.username}]})
            .fetch()
            .reduce(function(arr, bucket){
                bucket.messages.forEach(function(message){
                    arr.push(message)
                })
                return arr
            }, [])
    }
})

function sendMessage(to) {
    var input = $('.input-area input');

    if(input.val().trim() !== '') {
        Meteor.call('addMessage', input.val(), to)
        input.val('')
    }
}
