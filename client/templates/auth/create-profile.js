Template.createProfile.rendered = function() {
    $(':input').on('change keyup paste', function() {
        if ($(this).val().length) Session.set('stepStatus', true)
        else Session.set('stepStatus', false)
    })
}

Template.createProfile.created = function() {
    Session.setDefault('stepStatus', false)
    Session.setDefault('days', 31)
    Session.setDefault('profilePic', false)
}

Template.createProfile.destroyed = function() {
}

/**
 * Helpers
 */
Template.createProfile.helpers({
    stepReady: function() {
        return Session.get('stepStatus')
    },
    user: function() {
        return Meteor.user()
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
    'click .skip': function(event, template) {
        event.preventDefault()
        $(event.target).closest('.step').fadeOut(250, function() {
            $(this).next().fadeIn(250)
            $('.active').filter(':last').next().addClass('active')
        })
    },
    'submit #step-one form': function(event, template) {
        event.preventDefault()
        var username = template.$('[name=username]').val()
        Meteor.call('createUsername', username, function(error, result) {
            if (error) {
                template.$('#step-one .response').text(error.error)
                template.$('[name=username]').css('border-color', 'red')
            } else {
                Session.set('stepStatus', false)
                $('#step-one').addClass('complete')
                $('#step-one').fadeOut(250, function() {
                    $('#step-two').fadeIn(250)
                })
                $('.active').filter(':last').next().addClass('active')
            }
        })
    },
    'submit #step-two form': function(event, template) {

    },
    'submit #step-three form': function(event, template) {
        event.preventDefault()

        var user = {
            name: template.$('[name=name]').val(),
            location: template.$('[name=location]').val(),
            gender: template.$('[name=gender]').val()
        }

        if (!Session.get('profilePic')) {
             user.profilePic = (template.$('[name=gender]').val() == 'male') ? "https://d6gyptuog2clr.cloudfront.net/male_avatar.jpg" : "https://d6gyptuog2clr.cloudfront.net/female_avatar.jpg"
        }

        Meteor.call('updateProfile', user, function(error, result) {
            if (error) {
                template.$('#step-one .response').text(error.error)
            } else {
                Session.set('stepStatus', false)
                $('#step-three').addClass('complete')
                $('#step-three').fadeOut(250, function() {
                    $('#step-four').fadeIn(250)
                })
                $('.active').filter(':last').next().addClass('active')
            }
        })
    },
    'submit #step-four form': function(event, template) {
        event.preventDefault()

        var month = template.$('[name=soberMonth]').val()
        var day = template.$('[name=soberDay]').val()
        var year = template.$('[name=soberYear]').val()
        var soberDate = new Date(year, month-1, day)

        var user = {
            program: template.$('[name=program]').val(),
            homegroup: template.$('[name=homegroup]').val(),
            soberDate: soberDate,
            quote: template.$('[name=quote]').val()
        }

        Meteor.call('updateProfile', user, function(error, result) {
            if (error) {
                template.$('#step-one .response').text(error.error)
            } else {
                Meteor.call('updateUserRoles', Meteor.user()._id, ['member'], function(error, result) {
                    Router.go('/')
                })
            }
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