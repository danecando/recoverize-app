
TasksSchema = new SimpleSchema({
    userId: {
        type: String,
        label: 'user id',
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
    position: {
        type: Number,
        label: 'position number',
        defaultValue: 0
    },
    checked: {
        type: Boolean,
        label: 'checked'
    }
});

Tasks = new Mongo.Collection('tasks');
Tasks.attachSchema(TasksSchema);
