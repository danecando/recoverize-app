Template.timeline.created = function() {
    this.limit = new ReactiveVar(15);
    this.filter = new ReactiveVar({});
    this.sort = new ReactiveVar('timestamp');
    this.statusList = new ReactiveVar([]);

    var self = this;
    Tracker.autorun(function() {
        Meteor.subscribe('timeline', self.limit.get(), self.filter.get());

        // might want to offset here seems like were loading everything repeatedly
        var statuses = Status.find(self.filter.get(), {limit: self.limit.get()}).fetch();

        statuses = statuses.sort(function(a, b) {
            return b[self.sort.get()] - a[self.sort.get()];
        });

        self.statusList.set(statuses);
    });
};

Template.timeline.rendered = function() {
    var self = this;
    if (!Meteor.isCordova) {
        $('.status-scroll').scroll(function () {
            if ($(this).scrollTop() + $(this).innerHeight() == this.scrollHeight) {
                var newLimit = self.limit.get() + self.limit.get();
                self.limit.set(newLimit);
            }
        });
    }
};

Template.timeline.helpers({
    status: function() {
        return Template.instance().statusList.get();
    },
    cordova: function() {
        return Meteor.isCordova;
    }
});

Template.timeline.events({
    'click #load-more': function(e, template) {
        e.preventDefault();

        var limit = template.limit.get();
        var newLimit = limit + limit;
        template.limit.set(newLimit);

        if (template.statusList.get().length < newLimit) {
            $(e.target).css('display', 'none');
            return;
        }
    },
    'click #recent-timeline': function(e, template) {
        e.preventDefault();
        switchFilter(e, template);

        template.filter.set({});
        template.sort.set('timestamp');
    },
    'click #popular-timeline': function(e, template) {
        e.preventDefault();
        switchFilter(e, template);

        template.filter.set({});
        template.sort.set('serenity');

    },
    'click #following-timeline': function(e, template) {
        e.preventDefault()
        switchFilter(e, template);

        var following = Meteor.user().follows;
        following.push(Meteor.user().username);
        template.filter.set({username: { $in: following }});
        template.sort.set('timestamp');
    }
});

function switchFilter(e, template) {

    template.limit.set(10);

    $('.status-scroll').animate({ scrollTop: 0 }, 300);
    $('.timeline-filter button').each(function() {
        $(this).removeClass('active');
    });
    $(e.target).addClass('active');

    if (Meteor.isCordova && !template.statusList.get().length < template.limit.get()) {
        $('#load-more').css('display', 'block');
    }
}
