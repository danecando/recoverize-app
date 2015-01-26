
TasksSchema = new SimpleSchema({
    userId: {
        type: String,
        label: 'user id'
    },
    timestamp: {
        type: Number,
        label: 'timestamp'
    },
    task: {
        type: String,
        label: 'task'
    },
    position: {
        type: Number,
        label: 'position number',
        defaultValue: 0
    },
    checked: {
        type: Boolean,
        label: 'checked'
    }
})

Tasks = new Mongo.Collection('tasks')
Tasks.attachSchema(TasksSchema)

Meteor.methods({
    'addTask': function(task, position) {
        check(Meteor.userId(), String)
        check(task, String)
        check(position, Number)

        Tasks.insert({
            userId: Meteor.userId(),
            timestamp: Date.now(),
            checked: false,
            task: task,
            position: position
        })
    },
    'checkTask': function(_id) {
        check(Meteor.userId(), String)
        check(_id, String)

        var affected = Tasks.update(
            {_id: _id, userId: Meteor.userId()},
            {$set: {checked: true}}
        )
    },
    'uncheckTask': function(_id) {
        check(Meteor.userId(), String)
        check(_id, String)

        Tasks.update(
            {_id: _id, userId: Meteor.userId()},
            {$set: {checked: false}}
        )
    }
})