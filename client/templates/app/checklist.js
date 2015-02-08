Template.checklist.helpers({
    tasks: function() {
        return Tasks.find({}, { sort: { position: 1 }}).map(function(task, index) {
            task.index = index
            return task
        })
    },
    completed: function() {
        return Tasks.find({ checked: true })
    }
})

Template.checklist.events({
    'change [type=checkbox]': function(e) {
        var id = $(e.target).attr('data-taskId')
        if ($(e.target).prop('checked')) {
            Meteor.call('checkTask', id)
        } else {
            Meteor.call('uncheckTask', id)
        }
    },
    'submit #task-form form': function(e) {
        e.preventDefault()
        var task = $('[name=task]').val()
        var position = $('.task-list li').length+1
        Meteor.call('addTask', task, position)
        $('[name=task]').val('')
    },
    'click #add-new': function(e) {
        $('#task-form').slideToggle(250)
        $('#newTask').focus()
    },
    'click .delete-task': function(e) {
        if (confirm('Are you sure you want to delete this item?')) {
            Meteor.call('deleteTask', $(e.target).attr('data-taskid'))
        }
    },
    'click #reset-all': function(e) {
        Meteor.call('resetTasks')
    }
})
