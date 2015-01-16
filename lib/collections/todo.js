
TodoSchema = new SimpleSchema({
    username: {
        type: String,
        label: 'username',
        index: 1
    },
    timestamp: {
        type: Number,
        label: 'timestamp'
    },
    task: {
        type: String,
        label: 'task'
    },
    checked: {
        type: Boolean,
        label: 'checked'
    }
})

Todo = new Mongo.Collection('todo')
Todo.attachSchema(TodoSchema)

Meteor.methods({
    'addTask': function(task) {
        Todo.insert({
            username: Meteor.user().username,
            timestamp: Date.now(),
            checked: false,
            task: task
        })
    },
    'checkTask': function(_id) {
        Todo.update(
            {_id: _id},
            {$set: {checked: true}}
        )
    }
})