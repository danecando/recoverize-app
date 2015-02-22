
Template.userProfile.helpers({
    user: function() {
        return Meteor.users.findOne({username: this.username});
    },
    isCurrentUser: function() {
        return this.username === Meteor.user().username;
    },
    status: function() {
        return Status.find({username: this.username}, {sort: {timestamp: -1}});
    },
    banned: function() {
        var user = Meteor.users.findOne({username: this.username});
        if (user && Roles.userIsInRole(user._id, ['banned']))
            return true;
    },
    admin: function() {
        if (Roles.userIsInRole(Meteor.userId(), ['admin']))
            return true;
    }
});

Template.userProfile.events({
    'click .followBtn': function(e, template) {
        Meteor.call('follow', this.username);
    },
    'click .unfollowBtn': function(e, template) {
        Meteor.call('unfollow', this.username);
    },
    'click #ban-user': function(e, template) {
        Meteor.call('banUser', Meteor.users.findOne({username: this.username})._id);
    }
});