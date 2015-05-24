/**
 * Create tasks to be executed on a schedule
 */

// Reset checklists every day
SyncedCron.add({
  name: 'Reset daily checklist every morning',
  schedule: function(parser) {
    return parser.text('at 4:00am');
  },
  job: function() {
    Tasks.update({}, {$set: {checked: false}}, {multi: true});
  }
});

Meteor.startup(function() {
  SyncedCron.start();
});