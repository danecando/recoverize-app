
Template.user.helpers({
    user: function(){
        return Meteor.users.findOne({username: this.username})
    },
    isCurrentUser: function(){
        return this.username === Meteor.user().username
    }
})

Template.user.events({
    'click .followBtn': function(){
        Meteor.call('follow', this.username)
    },
    'click .unfollowBtn': function(){
        Meteor.call('unfollow', this.username)
    },
    'keypress .newStatus': function(e){
        if(e.which === 13 && isValidStatus(e.target.value)){
            Meteor.call('createStatus', e.target.value)
            e.target.value = ''
        } 
    }
})

function isValidStatus(str){
    return str.trim() !== ''
        && str.length < 255
}