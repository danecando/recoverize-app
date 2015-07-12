
Template.userlist.onCreated(function() {
  var instance = this;

  if (!Session.get('userListSort')) {
    Session.set('userListSort', {
      lastActive: -1,
      serenity: -1,
      'profile.soberDate': 1,
      followersCount: 1,
      'profile.gender': -1
    });
  }

  instance.limit = 15;
  instance.userCount = new ReactiveVar();
  instance.userList = new ReactiveVar([]);
  instance.filter = new ReactiveVar({});
  instance.sort = new ReactiveVar(Session.get('userListSort'));
  instance.page = new ReactiveVar(0);
  instance.skip = new ReactiveVar(instance.page.get() * instance.limit);

  var prevFilter = instance.filter.get();
  var prevSort = instance.sort.get();

  Tracker.autorun(function() {

    // if filters / sort have changed reset data
    if (!_.isEqual(prevFilter, instance.filter.get()) ||
      !_.isEqual(prevSort, instance.sort.get())) {
      instance.page.set(0);
      instance.userCount.set(0);
      instance.userList.set([]);
      prevSort = instance.sort.get();
      prevFilter = instance.filter.get();
    }

    Meteor.call(
      'getUsers',
      instance.filter.get(),
      instance.sort.get(),
      instance.limit,
      instance.page.get() * instance.limit,
      function(err, results) {
        var userList = instance.userList.get();
        var updated = userList.concat(results.users);
        updated = _.uniq(updated, function(item) {
          return item._id;
        });
        instance.userList.set(updated);
        instance.userCount.set(results.userCount);
      }
    );
  });

  instance.nextPage = function() {
    var page = instance.page.get() + 1;
    instance.page.set(page);
  };

  instance.reorderSort = function(sort, field) {
    var first = _.pick(sort, field);
    var rest = _.omit(sort, field);
    return _.extend(first, rest);
  };
});


Template.userlist.onRendered(function() {
  var instance = this;

  if (!Meteor.isCordova) {
    this.$('#user-list').scroll(function() {
      if ($(this).scrollTop() + $(this).innerHeight() >= this.scrollHeight - 50) {
        instance.nextPage();
      }
    });
  }
});

Template.userlist.helpers({
  listOfUsers: function() {
    return Template.instance().userList.get();
  },
  isCurrentUser: function(user) {
    return user === Meteor.user().username;
  },
  cordova: function() {
    return Meteor.isCordova;
  },
  hasMore: function() {
    return Template.instance().userCount.get() > Template.instance().userList.get().length;
  },
  serenityDirection: function() {
    var sort = Template.instance().sort.get();
    return sort.serenity;
  },
  timeDirection: function() {
    var sort = Template.instance().sort.get();
    return sort['profile.soberDate'];
  },
  followersDirection: function() {
    var sort = Template.instance().sort.get();
    return sort.followersCount;
  },
  genderDirection: function() {
    var sort = Template.instance().sort.get();
    return sort['profile.gender'];
  }
});

Template.userlist.events({
  'click #load-more': function(e, template) {
    e.preventDefault();
    var page = template.page.get();
    template.page.set(page + 1);
  },
  'keyup .userList-filter, keydown .userList-filter, keypress .userList-filter': function(e, template){
    if (e.keyCode == 27) {
      $('.page-header').removeClass('search-open');
    }
    var query = $(e.target).val().trim().toLowerCase();
    template.filter.set({ username: { $regex: query } });
  },
  'click #search-toggle': function(e, template) {
    $('.page-header').toggleClass('search-open');
    $('.userList-filter').focus();
  },
  'click .user-scroll': function(e, template) {
    $('#user-list').removeClass('search-open');
  },
  'click .serenity-filter button': function(e, template) {
    e.preventDefault();
    var directions = Session.get('userListSort');
    var dir = directions.serenity;
    directions.serenity = dir > 0 ? dir *= -1 : Math.abs(dir);
    var sorted = template.reorderSort(directions, 'serenity');
    Session.set('userListSort', sorted);
    template.sort.set(sorted);
  },
  'click .time-filter button': function(e, template) {
    e.preventDefault();
    var directions = Session.get('userListSort');
    var dir = directions['profile.soberDate'];
    directions['profile.soberDate'] = dir > 0 ? dir *= -1 : Math.abs(dir);
    var sorted = template.reorderSort(directions, 'profile.soberDate');
    Session.set('userListSort', sorted);
    template.sort.set(sorted);
  },
  'click .follower-filter button': function(e, template) {
    e.preventDefault();
    var directions = Session.get('userListSort');
    console.log(directions);
    var dir = directions.followersCount;
    directions.followersCount = dir > 0 ? dir *= -1 : Math.abs(dir);
    var sorted = template.reorderSort(directions, 'followersCount');
    Session.set('userListSort', sorted);
    template.sort.set(sorted);
  },
  'click .gender-filter button': function(e, template) {
    e.preventDefault();
    var directions = Session.get('userListSort');
    var dir = directions['profile.gender'];
    directions['profile.gender'] = dir > 0 ? dir *= -1 : Math.abs(dir);
    var sorted = template.reorderSort(directions, 'profile.gender');
    Session.set('userListSort', sorted);
    template.sort.set(sorted);
  }
});
