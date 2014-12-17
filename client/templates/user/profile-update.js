
Template.profileUpdate.created = function() {
    Session.setDefault('updated', false);
    Session.setDefault('days', 31);
};

Template.profileUpdate.destroyed = function() {
    Session.setDefault('updated', false);
}

/**
 * Helpers
 */
Template.profileUpdate.helpers({

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

        var file = template.$('[name=profilePic]')[0].files[0]
        var fileUrl = 'https://d6gyptuog2clr.cloudfront.net/' + Meteor.user().username + '/' + file.name
        var uploader = new Slingshot.Upload("myFileUploads")
        uploader.send(file, function (error, downloadUrl) {
            if (error) template.$('.response').addClass('error').text(error)
        })


        var user = {
            name: template.$('[name=name]').val(),
            profilePic: fileUrl,
            location: template.$('[name=location]').val(),
            gender: template.$('[name=gender]').val(),
            program: template.$('[name=program]').val(),
            homegroup: template.$('[name=homegroup]').val(),
            sober: {
                month: template.$('[name=soberMonth]').val(),
                day: template.$('[name=soberDay]').val(),
                year: template.$('[name=soberYear]').val()
            },
            quote: template.$('[name=quote]').val()
        }

        Meteor.call('updateProfile', user, function(error, result) {
            if (error) template.$('.response').addClass('error').text(error)
            else template.$('.response').addClass('success').text("Your profile has been updated")

        })
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