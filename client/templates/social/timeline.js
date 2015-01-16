
Template.timeline.helpers({
  status: function() {
      return Status.find({}, {sort: {timestamp: -1}})
  }
})

Template.timeline.events({

})
