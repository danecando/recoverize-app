/**
 * Users profile page
 *
 * @since 0.1.0
 * @version 0.1.1
 * @todo Improve code, move pub/sub to meteor method
 */


'use strict';

Template.userProfile.onCreated(function() {
  this.limit = new ReactiveVar(15);
  this.statusList = new ReactiveVar();

  var self = this;
  Tracker.autorun(function() {
    Meteor.subscribe('userStatuses', self.data.username, self.limit.get());

    // might want to offset here seems like were loading everything repeatedly
    var statuses = Status.find({ username: self.data.username }, { limit: self.limit.get() });
    self.statusList.set(statuses);
  });
});


Template.userProfile.helpers({
  user: function() {
    return Meteor.users.findOne({ username: this.username });
  },
  isCurrentUser: function() {
    return this.username === Meteor.user().username;
  },
  status: function() {
    return Template.instance().statusList.get();
  },
  banned: function() {
    var user = Meteor.users.findOne({ username: this.username });
    if (user && Roles.userIsInRole(user._id, ['banned'])) {
      return true;
    }
  },
  admin: function() {
    if (Roles.userIsInRole(Meteor.userId(), ['admin'])) {
      return true;
    }
  },
  cordova: function() {
    return Meteor.isCordova;
  },
  hasMore: function() {
    return Template.instance().statusList.get().count() >= Template.instance().limit.get();
  }
});


Template.userProfile.events({
  'click #load-more': function(e, template) {
    e.preventDefault();

    var limit = template.limit.get();
    var newLimit = limit + limit;
    template.limit.set(newLimit);

    if (template.statusList.get().count() < newLimit) {
      $(e.target).css('display', 'none');
      return;
    }
  },
  'click .followBtn': function(e, template) {
    Meteor.call('follow', this.username);
  },
  'click .unfollowBtn': function(e, template) {
    Meteor.call('unfollow', this.username);
  },
  'click #ban-user': function(e, template) {
    Meteor.call('banUser', Meteor.users.findOne({ username: this.username })._id);
  }
});
