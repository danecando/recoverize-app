
Template.checklist.helpers({
    tasks: function() {
        return Todos.find()
    }
})

Template.checklist.events({
    'click .check': function(e) {
        var id = $(e.target).attr('data-statusId')
        Meteor.call('checkTast', id)
    },
    'click .add': funciton() {
        Meteor.call('addTask', 'test string')
    }
})