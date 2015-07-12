'use strict';

Template.timeline.onCreated(function() {

  var instance = this;

  // reset sort order on new session
  if (!Session.get('timelineSort')) {
    Session.set('timelineSort', {
      timestamp: -1,
      serenity: 1
    });
  }

  instance.limit = 15;
  instance.statusCount = new ReactiveVar();
  instance.statusList = new ReactiveVar([]);
  instance.filter = new ReactiveVar({});
  instance.sort = new ReactiveVar(Session.get('timelineSort'));
  instance.page = new ReactiveVar(0);
  instance.skip = new ReactiveVar(instance.page.get() * instance.limit);

  var prevFilter = instance.filter.get();
  var prevSort = instance.sort.get();

  Tracker.autorun(function() {

    // if filters / sort have changed reset data
    if (!_.isEqual(prevFilter, instance.filter.get())
        || !_.isEqual(prevSort, instance.sort.get())) {
      instance.page.set(0);
      instance.statusCount.set(0);
      instance.statusList.set([]);
      prevSort = instance.sort.get();
      prevFilter = instance.filter.get();
    }

    Meteor.call(
        'getStatuses',
        instance.filter.get(),
        instance.sort.get(),
        instance.limit,
        instance.page.get() * instance.limit,
        function(err, results) {
          var statusList = instance.statusList.get();
          var updated = statusList.concat(results.statuses);
          updated = _.uniq(updated, function(item) {
            return item._id;
          });
          instance.statusList.set(updated);
          instance.statusCount.set(results.statusCount);
        });

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

Template.timeline.onRendered(function() {
  var instance = this;

  if (!Meteor.isCordova) {
    this.$('#timeline').scroll(function() {
      if ($(this).scrollTop() + $(this).innerHeight() >= this.scrollHeight - 50) {
        instance.nextPage();
      }
    });
  }
});

Template.timeline.helpers({

  statuses: function() {
    return Template.instance().statusList.get();
  },

  cordova: function() {
    return Meteor.isCordova;
  },

  hasMore: function() {
    return Template.instance().statusCount.get() > Template.instance().statusList.get().length;
  },

  recentDirection: function() {
    var sort = Template.instance().sort.get();
    return sort.timestamp;
  },

  popularDirection: function() {
    var sort = Template.instance().sort.get();
    return sort.serenity;
  }

});

Template.timeline.events({

  'click #load-more': function(e, template) {
    e.preventDefault();

    var page = template.page.get();
    template.page.set(page + 1);
  },

  'click .recent-filter button': function(e, template) {
    e.preventDefault();

    var sorted;
    var directions = Session.get('timelineSort');
    var dir = directions.timestamp;

    directions.timestamp = dir > 0 ? dir *= -1 : Math.abs(dir);
    sorted = template.reorderSort(directions, 'timestamp');

    Session.set('timelineSort', sorted);
    template.sort.set(sorted);
  },

  'click .popular-filter button': function(e, template) {
    e.preventDefault();

    var sorted;
    var directions = Session.get('timelineSort');
    var dir = directions.serenity;

    directions.serenity = dir > 0 ? dir *= -1 : Math.abs(dir);
    sorted = template.reorderSort(directions, 'serenity');

    Session.set('timelineSort', sorted);
    template.sort.set(sorted);
  },

  'click .following-filter button': function(e, template) {
    e.preventDefault();

    var following = Meteor.user().follows;
    var filter = template.filter.get();

    console.log($(this));

    $('#following-timeline').toggleClass('active');

    if (filter.hasOwnProperty('username')) {
      template.filter.set({});
    } else {
      template.filter.set({ username: { $in: following } });
      template.sort.set({ timestamp: -1 });
    }
  }

});
