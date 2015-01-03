// todo: fix up updated session variable between pages


Template.accountSettings.created = function() {
    Session.setDefault('updated', false)
}

Template.accountSettings.destroyed = function() {
    Session.setDefault('updated', false)
}

/**
 * Helpers
 */
Template.accountSettings.helpers({
    user: function() {
        return Meteor.user()
    },
    updated: function() {
        if (!Session.get('updated')) return 'disabled'
    }
});


/**
 * Events
 */
Template.accountSettings.events({

    // enable save button if any fields have been updated
    'change :input': function(event, template) {
        Session.set('updated', true)
    },
    'click #delete-account': function(event, template) {
        event.preventDefault()
        if (confirm('Are you sure you want to delete your account?')) {
            Meteor.call('deleteAccount')
        }
    },
    'click #save-changes': function(event, template) {
        event.preventDefault()

        var user = {
            email: template.$('[name=email]').val(),
            oldpw: template.$('[name=oldpw]').val(),
            newpw: template.$('[name=newpw]').val(),
            confirmpw: template.$('[name=confirmpw]').val()
        }

        if (!user.oldpw && user.newpw) {
            template.$('[name=oldpw]').addClass('error')
            template.$('.response').addClass('error').text('Must verify current password')
            return
        }

        if (user.newpw !== user.confirmpw) {
            template.$('[name=newpw]').addClass('error')
            template.$('[name=confirmpw]').addClass('error')
            template.$('.response').addClass('error').text('Passwords do not match')
            return
        }

        Meteor.call('updateAccount', user, function(error, result) {
            if (error) template.$('.response').addClass('error').text(error.reason)
            else template.$('.response').addClass('success').text('Your account has been updated')
        })
    }

});