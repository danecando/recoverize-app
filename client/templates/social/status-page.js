
Template.statusPage.helpers({
    status: function() {
        return Status.find({_id: this.id})
    }
})

Template.statusPage.events({
})
