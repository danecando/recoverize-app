Meteor.methods({

    'addTask': function(task, position) {
        check(Meteor.userId(), String);
        check(task, String);
        check(position, Number);

        Tasks.insert({
            userId: Meteor.userId(),
            timestamp: Date.now(),
            checked: false,
            task: task,
            position: position
        });
    },

    'deleteTask': function(id) {
        check(Meteor.userId(), String);
        Tasks.remove({ _id: id});
    },

    'checkTask': function(_id) {
        check(Meteor.userId(), String);
        check(_id, String);

        var affected = Tasks.update(
            {_id: _id, userId: Meteor.userId()},
            {$set: {checked: true}}
        );
    },

    'uncheckTask': function(_id) {
        check(Meteor.userId(), String);
        check(_id, String);

        Tasks.update(
            {_id: _id, userId: Meteor.userId()},
            {$set: {checked: false}}
        );
    },

    'resetTasks': function() {
        Tasks.update(
            {userId: Meteor.userId()},
            {$set: {checked: false}},
            {multi: true}
        );
    }

});
