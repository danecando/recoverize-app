/**
 * Reset checklists
 */
var checklist = later.parse.text('at 3:00 am')
var resetChecklists = later.setInterval(function() {
    Tasks.update({}, {$set: {checked: false}})
}, checklist);