Template.timeline.created = function() {
    this.limit = new ReactiveVar(10);
    this.sort = new ReactiveVar({});
    this.statusList = new ReactiveVar([]);

    var self = this;
    Tracker.autorun(function() {
        Meteor.subscribe('timeline', self.limit.get(), self.sort.get());

        var statuses = Status.find(self.sort.get(), {limit: self.limit.get()}).fetch();
        statuses = statuses.sort(function(a, b) {
            return b.timestamp - a.timestamp;
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

        $('.status-scroll').animate({ scrollTop: 0 }, 300);
        $(e.target).addClass('active').next().removeClass('active');
        template.sort.set({});
    },
    'click #following-timeline': function(e, template) {
        e.preventDefault()

        $('.status-scroll').animate({ scrollTop: 0 }, 300);
        $(e.target).addClass('active').prev().removeClass('active');
        var following = Meteor.user().follows;
        following.push(Meteor.user().username);
        template.sort.set({username: { $in: following }});
    }
});
