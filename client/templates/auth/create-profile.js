Template.createProfile.rendered = function() {

    var program = Meteor.user().profile.program
    if (program) {
        $('#program option').each(function() {
            if (program == $(this).val()) {
                $(this).attr('selected', true)
            }
        })
    }

    var gender = Meteor.user().profile.gender
    if (gender) {
        $('#gender option').each(function() {
            if (gender == $(this).val()) {
                $(this).attr('selected', true)
            }
        })
    }

    var soberDate = Meteor.user().profile.soberDate
    if (soberDate) {
        $('#sober-year option').each(function() {
            if (soberDate.getFullYear() == $(this).val()) {
                $(this).attr('selected', true)
            }
        })
        $('#sober-month option').each(function() {
            if (soberDate.getMonth() == $(this).val()-1) {
                $(this).attr('selected', true)
            }
        })
        $('#sober-day option').each(function() {
            if (soberDate.getDate() == $(this).val()) {
                $(this).attr('selected', true)
            }
        })
    }
}

Template.createProfile.created = function() {
    Session.setDefault('updated', false)
    Session.setDefault('days', 31)
}

Template.createProfile.destroyed = function() {
    Session.setDefault('updated', false)
}

/**
 * Helpers
 */
Template.createProfile.helpers({
    user: function() {
        return Meteor.user()
    },
    updated: function() {
        if (!Session.get('updated')) return 'disabled'
    },
    days: function() {
        var days = []

        for (var i = 1; i <= Session.get('days'); i++) {
            days.push(i)
        }

        return days;
    },
    years: function() {
        var today = new Date(),
            year = today.getFullYear(),
            years = []

        for (; year >= 1930; year--) {
            years.push(year)
        }

        return years
    }

});

/**
 * Events
 */
Template.createProfile.events({

    // enable save button if any fields have been updated
    'change :input': function(event, template) {
        Session.set('updated', true)
    },
    'click #save-changes': function(event, template) {
        event.preventDefault()

        // todo: load defaults create thingy if profile picture is already uploaded
        var file = template.$('[name=profilePic]')[0].files[0]
        console.log(JSON.stringify(file))
        if (file) {
            var fileUrl = 'https://d6gyptuog2clr.cloudfront.net/' + Meteor.user().username + '/' + file.name
            var uploader = new Slingshot.Upload("myFileUploads")
            uploader.send(file, function (error, downloadUrl) {
                if (error) template.$('.response').addClass('error').text(error)
                console.log(downloadUrl)
            })
        }



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
            days = new Date(year, month, 0).getDate()

        Session.set('days', days)
    },

    'change #sober-year': function(event, template) {

        var month = template.$('#sober-month').val(),
            year = template.$('#sober-year').val(),
            days = new Date(year, month, 0).getDate()

        Session.set('days', days)
    }

})