
Template.checklist.helpers({
    tasks: function() {
        return Tasks.find()
    }
})

Template.checklist.events({
    'click .check': function(e) {
        var id = $(e.target).attr('data-taskId')
        Meteor.call('checkTask', id)
    },
    'click .uncheck': function(e) {
        var id = $(e.target).attr('data-taskId')
        Meteor.call('uncheckTask', id)
    },
    'click .add': function() {
        Meteor.call('addTask', 'test string')
    }
})
