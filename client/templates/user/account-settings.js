Template.createProfile.rendered = function() {

}

Template.accountSettings.created = function() {
    this.profileUpdated = new ReactiveVar
    this.profileUpdated.set(false)
}

/**
 * Helpers
 */
Template.accountSettings.helpers({
    user: function() {
        return Meteor.user()
    },
    profileUpdated: function() {
        return Template.instance().profileUpdated.get()
    }
})


/**
 * Events
 */
Template.accountSettings.events({
    'change :input, keypress :input': function(event, template) {
        template.profileUpdated.set(true)
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

        if (user.newpw) {
            Accounts.changePassword(user.oldpw, user.newpw, function(error) {
                if (error) template.$('.response').addClass('error').text(error.reason)
                else template.$('#save-changes').text('Account Updated!')
            })
        }

        if (Meteor.user().emails[0].address !== user.email) {
            Meteor.call('updateEmail', user, function (error, result) {
                if (error) template.$('.response').addClass('error').text(error.reason)
                else template.$('#save-changes').text('Account Updated!')
            })
        }
    }

})