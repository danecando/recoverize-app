/**
 * Reset checklists
 */
var checklist = later.parse.recur().on('04:00:00').time();
var resetChecklists = later.setInterval(function() {
    Tasks.update({}, {$set: {checked: false}})
}, checklist);