
Template.accountSettings.created = function() {
    Session.setDefault('updated', false)
}

/**
 * Helpers
 */
Template.accountSettings.helpers({
    user: function() {
        return Meteor.user();
    },
    updated: function() {
        if (!Session.get('updated')) return 'disabled';
    }
});


/**
 * Events
 */
Template.accountSettings.events({

    // enable save button if any fields have been updated
    'change :input': function(event, template) {
        Session.set('updated', true);
    },

    'click #save-changes': function(event, template) {
        event.preventDefault();

        var user = {
            username: template.$('[name=username]').val(),
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
            // todo: server side validation and update
            if (error) {
                console.error(error)
            }

            if (result) {
                template.$('.response').addClass('success').text(result)
            }

        })
    }

});