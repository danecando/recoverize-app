
Template.userlist.created = function() {
    this.limit = new ReactiveVar(15)
    this.sort = new ReactiveVar({})


    var self = this
    Deps.autorun(function() {
        Meteor.subscribe('userList', self.limit.get(), self.sort.get())
    })
}

Template.userlist.destroyed = function() {
    this.limit.set(15)
    this.sort.set({})
}

Template.userlist.rendered = function() {
    var self = this
    $('.user-scroll').scroll(function() {
        if ($(this).scrollTop() + $(this).innerHeight() == this.scrollHeight) {
            var newLimit = self.limit.get() + 15
            self.limit.set(newLimit)
        }
    })
}

Template.userlist.helpers({
    listOfUsers: function(){
        return Meteor.users.find(Template.instance().sort.get(), { limit: Template.instance().limit.get() })
    },
    isCurrentUser: function(user){
        return user === Meteor.user().username
    }
})

Template.userlist.events({
    'keyup .userList-filter': function(e, template){
        if (e.keyCode == 27) {
            $('#user-list').removeClass('search-open')
        }

        var value = $(e.target).val().trim().toLowerCase()
        template.sort.set({username: {$regex: value}})
    },
    'click #search-toggle': function(e, template) {
        $('#user-list').toggleClass('search-open')
        $('.userList-filter').focus()

    },
    'click .user-scroll': function(e, template) {
        $('#user-list').removeClass('search-open')
    }
})

