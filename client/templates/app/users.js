
Template.user.helpers({
    user: function(){
        return Meteor.users.findOne({username: this.username})
    }
})

Template.user.events({
    'click .followBtn': function(){
        Meteor.call('follow', this.username)
    },
    'click .unfollowBtn': function(){
        Meteor.call('unfollow', this.username)
    }
})
