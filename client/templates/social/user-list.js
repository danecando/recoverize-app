
Template.userlist.created = function() {
    this.limit = new ReactiveVar(15);
    this.filter = new ReactiveVar({});


    var self = this;
    Tracker.autorun(function() {
        var filter = self.filter.get();
        filter.profileCreated = true; // make sure we only get finished profiles
        Meteor.subscribe('userList', self.limit.get(), filter);
    });
}

Template.userlist.destroyed = function() {
    this.limit.set(15);
    this.filter.set({});
};

Template.userlist.rendered = function() {
    var self = this;
    $('.user-scroll').scroll(function() {
        if ($(this).scrollTop() + $(this).innerHeight() == this.scrollHeight) {
            var newLimit = self.limit.get() + 15;
            self.limit.set(newLimit);
            Tracker.flush()
        }
    });
};

Template.userlist.helpers({
    listOfUsers: function() {
        var users = Meteor.users.find(Template.instance().filter.get(), { limit: Template.instance().limit.get() });
        return users;
    },
    isCurrentUser: function(user) {
        return user === Meteor.user().username;
    }
});

Template.userlist.events({
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

