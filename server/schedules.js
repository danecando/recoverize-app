/**
 * Reset checklists
 */
SyncedCron.add({
    name: 'Reset daily checklist every morning',
    schedule: function(parser) {
        return parser.text('at 4:00am');
    },
    job: function() {
        Tasks.update({}, {$set: {checked: false}}, {multi: true});
    }
});

SyncedCron.start();