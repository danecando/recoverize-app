
Template.userProfile.helpers({
    user: function(){
        return Meteor.users.findOne({username: this.username})
    },
    isCurrentUser: function(){
        return this.username === Meteor.user().username
    },
    status: function() {
        return Status.find({}, {sort: {timestamp: -1}})
    },
    banned: function() {
        if (Roles.userIsInRole(Meteor.users.findOne({username: this.username})._id, ['banned']))
            return true
    },
    admin: function() {
        if (Roles.userIsInRole(Meteor.userId(), ['admin']))
            return true
    }
})

Template.userProfile.events({
    'click .followBtn': function(){
        Meteor.call('follow', this.username)
    },
    'click .unfollowBtn': function(){
        Meteor.call('unfollow', this.username)
    },
    'click #ban-user': function(e) {
        Meteor.call('banUser', Meteor.users.findOne({username: this.username})._id)
    }
})

function isValidStatus(str){
    return str.trim() !== ''
        && str.length < 255
}