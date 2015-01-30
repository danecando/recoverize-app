Template.timeline.created = function() {
    this.limit = new ReactiveVar(10)
    this.sort = new ReactiveVar({})

    var self = this
    Deps.autorun(function() {
        Meteor.subscribe('timeline', self.limit.get(), self.sort.get())
    })
}

Template.timeline.destroyed = function() {
    this.limit.set(10)
}

Template.timeline.rendered = function() {
    var self = this
    $('.status-scroll').scroll(function() {
        if ($(this).scrollTop() + $(this).innerHeight() == this.scrollHeight) {
            console.log('hit')
            var newLimit = self.limit.get() + 10
            self.limit.set(newLimit)
        }
    })
}

Template.timeline.helpers({
  status: function() {
      return Status.find({}, {limit: Template.instance().limit.get()})
  }
})

Template.timeline.events({
    'click #recent-timeline': function(e, template) {
        e.preventDefault()
        $('.status-scroll').animate({ scrollTop: 0 }, 300)
        $('.timeline-filter button').each(function() {
            $(this).removeClass('active')
        })
        $(e.target).addClass('active')
        template.sort.set({})
    },
    'click #following-timeline': function(e, template) {
        e.preventDefault()
        $('.status-scroll').animate({ scrollTop: 0 }, 300)
        $('.timeline-filter button').each(function() {
            $(this).removeClass('active')
        })
        $(e.target).addClass('active')
        var following = Meteor.user().follows
        following.push(Meteor.user().username)
        template.sort.set({username: { $in: following }})
    }
})
