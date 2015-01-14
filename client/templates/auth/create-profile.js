Template.createProfile.rendered = function() {
    $(':input').on('change keyup paste', function() {
        if ($(this).val().length) Session.set('stepStatus', true)
        else Session.set('stepStatus', false)
    })
}

Template.createProfile.created = function() {
    Session.setDefault('stepStatus', false)
    Session.setDefault('days', 31)
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
    'click .skip': function(event, template) {
        event.preventDefault()
        $(event.target).closest('.step').fadeOut(200, function() {
            $(this).next().fadeIn(200)
            $('.active').filter(':last').next().addClass('active')
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