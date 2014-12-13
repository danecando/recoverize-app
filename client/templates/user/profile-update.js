// globals
//var ERRORS_KEY = 'updateErrors';
var UPDATED = 'updated';
// reactive vars


Template.profileUpdate.created = function() {
    Session.setDefault('updated', false);
    Session.setDefault('days', 31);
};


/**
 * Helpers
 */
Template.profileUpdate.helpers({

    errorMessages: function() {
        return _.values(Session.get('errors'));
    },
    errorClass: function(key) {
        return Session.get(ERRORS_KEY)[key] && 'error';
    },
    user: function() {
        return Meteor.user();
    },
    updated: function() {
        if (!Session.get('updated')) return 'disabled';
    },
    days: function() {
        var days = [];

        for (var i = 1; i <= Session.get('days'); i++) {
            days.push(i);
        }

        return days;
    },
    years: function() {
        var today = new Date(),
            year = today.getFullYear(),
            years = [];

        for (; year >= 1930; year--) {
            years.push(year);
        }

        return years;
    }

});

/**
 * Events
 */
Template.profileUpdate.events({

    // enable save button if any fields have been updated
    'change :input': function(event, template) {
        Session.set('updated', true);
    },

    'click #save-changes': function(event, template) {
        event.preventDefault();


        // profile fields
        var location = template.$('[name=location]').val();
        var program = template.$('[name=program]').val();
        var sober = {
            month: template.$('[name=soberMonth]').val(),
            day: template.$('[name=soberDay]').val(),
            year: template.$('[name=soberYear]').val()
        };
        var quote = template.$('[name=quote]').val();

        //Meteor.users.update({ _id: Meteor.userId() }, { $set: { profile: { name: name }}});

        // account settings
        var username = template.$('[name=username]').val();
        var email = template.$('[name=email]').val();
        var oldpw = template.$('[name=oldpw]').val();
        var newpw = template.$('[name=newpw]').val();
        var confirmpw = template.$('[name=confirmpw]').val();


        if (newpw !== confirmpw) {
            $newpw.addClass('error')
            $confirmpw.addClass('error')
            template.$('.response').text('Passwords need to match')
        }


        var $name = template.$('[name=name]');
        Meteor.users.update({_id: Meteor.userId() }, { $set: { profile: { name: $name.val() }}}, function(error, result) {
            if (error) {
                $name.addClass('error');
                console.error(error + result);
                return;
            }
        });

    },

    'change #sober-month': function(event, template) {

        var month = template.$('#sober-month').val(),
            year = template.$('#sober-year').val(),
            days = new Date(year, month, 0).getDate();

        Session.set('days', days);
    },

    'change #sober-year': function(event, template) {

        var month = template.$('#sober-month').val(),
            year = template.$('#sober-year').val(),
            days = new Date(year, month, 0).getDate();

        Session.set('days', days);
    }


});