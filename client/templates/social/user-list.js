
Template.userlist.created = function() {
    this.limit = new ReactiveVar(15);
    this.filter = new ReactiveVar({});
    this.userList = new ReactiveVar();
    this.userCount = Meteor.users.find().count();

    var self = this;
    Tracker.autorun(function() {
        var filter = self.filter.get();
        filter.profileCreated = true; // make sure we only get finished profiles
        Meteor.subscribe('userList', self.limit.get(), filter);

        var users = Meteor.users.find(self.filter.get(), { limit: self.limit.get() });
        self.userList.set(users);
    });
}

Template.userlist.rendered = function() {
    var self = this;
    if (!Meteor.isCordova) {
        $('.user-scroll').scroll(function () {
            if ($(this).scrollTop() + $(this).innerHeight() == this.scrollHeight) {
                var newLimit = self.limit.get() + 15;
                self.limit.set(newLimit);
                Tracker.flush()
            }
        });
    }
};

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
        return Template.instance().userCount >= Template.instance().limit.get();
    }
});

Template.userlist.events({
    'click #load-more': function(e, template) {
        e.preventDefault();

        var limit = template.limit.get();
        var newLimit = limit + limit;
        template.limit.set(newLimit);

        if (template.userCount < newLimit) {
            $(e.target).css('display', 'none');
            return;
        }
    },
    'keyup .userList-filter': function(e, template){
        if (e.keyCode == 27) {
            $('#user-list').removeClass('search-open');
        }

        var value = $(e.target).val().trim().toLowerCase();
        template.filter.set({username: {$regex: value}});
    },
    'click #search-toggle': function(e, template) {
        $('#user-list').toggleClass('search-open');
        $('.userList-filter').focus();

    },
    'click .user-scroll': function(e, template) {
        $('#user-list').removeClass('search-open');
    }
});

