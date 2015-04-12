
Template.statusp.helpers({
    isShared: function() {
        if (this.type === 'shared') {
            return true;
        } else {
            return false;
        }
    },
    currentUserSerenityList: function(statusId) {
        var status = Status.findOne(statusId);
        if (status && status.serenityList) {
            return status.serenityList.indexOf(Meteor.user().username) !== -1;
        } else {
            return false;
        }
    },
    currentUserShareList: function(statusId) {
        var status = Status.findOne(statusId);

        if (this.username === Meteor.user().username) {
            return true;
        }

        if (status && status.shareList) {
            return status.shareList.indexOf(Meteor.user().username) !== -1;
        } else {
            return false;
        }
    },
    currentUser: function() {
        return Meteor.users.findOne({username: this.username});
    },
    currentUserStatus: function() {
        if (this.username === Meteor.user().username) {
            return true;
        } else {
            return false;
        }
    }
});

Template.statusp.events({
    'click .serenityUpBtn i': function(e) {
        var statusId = $(e.target).parent().attr('data-statusId');
        Meteor.call('statusSerenityUp', statusId);
    },
    'click .serenityDownBtn i': function(e){
        var statusId = $(e.target).parent().attr('data-statusId');
        Meteor.call('statusSerenityDown', statusId);
    },
    'click .shareStatus': function(e) {
        var statusId = $(e.target).parent().attr('data-statusId');
        if (statusId && confirm('Do you want to reshare this post?')) {
            Meteor.call('shareStatus', statusId);
        }
    },
    'click .replyStatus': function(e) {
        Session.set('statusReply', { user: this.username, status: this.status });
        Router.go('/status');
    },
    'click .deleteStatus': function(e) {
        e.preventDefault();

        if (confirm('Are you sure you want to delete this share?')) {
            var statusId = $(e.target).parent().attr('data-statusId');
            Meteor.call('deleteStatus', statusId);
        }
    }
});
