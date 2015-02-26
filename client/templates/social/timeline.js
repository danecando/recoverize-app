Template.timeline.created = function() {
    this.limit = new ReactiveVar(10);
    this.filter = new ReactiveVar({});
    this.sort = new ReactiveVar('timestamp');
    this.statusList = new ReactiveVar([]);

    var self = this;
    Tracker.autorun(function() {
        Meteor.subscribe('timeline', self.limit.get(), self.filter.get());

        var statuses = Status.find(self.filter.get(), {limit: self.limit.get()}).fetch();
        statuses = statuses.sort(function(a, b) {
            return b[self.sort.get()] - a[self.sort.get()]
        });

        self.statusList.set(statuses);
    });
};

Template.timeline.destroyed = function() {
    this.limit.set(10);
};

Template.timeline.rendered = function() {
    var self = this;
    $('.status-scroll').scroll(function() {
        if ($(this).scrollTop() + $(this).innerHeight() == this.scrollHeight) {
            var newLimit = self.limit.get() + 10;
            self.limit.set(newLimit);
        }
    });
}

Template.timeline.helpers({
    status: function() {
        return Template.instance().statusList.get();
    }
});

Template.timeline.events({
    'click #recent-timeline': function(e, template) {
        e.preventDefault();
        switchFilter(e);

        template.filter.set({});
        template.sort.set('timestamp');
    },
    'click #popular-timeline': function(e, template) {
        e.preventDefault();
        switchFilter(e);

        template.filter.set({});
        template.sort.set('serenity');

    },
    'click #following-timeline': function(e, template) {
        e.preventDefault()
        switchFilter(e);

        var following = Meteor.user().follows;
        following.push(Meteor.user().username);
        template.filter.set({username: { $in: following }});
        template.sort.set('timestamp');
    }
});

function switchFilter(e) {
    $('.status-scroll').animate({ scrollTop: 0 }, 300);
    $('.timeline-filter button').each(function() {
        $(this).removeClass('active');
    });
    $(e.target).addClass('active');
}