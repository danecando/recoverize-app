
Template.accountSettings.created = function() {
    this.profileUpdated = new ReactiveVar(false);
};

/**
 * Helpers
 */
Template.accountSettings.helpers({
    user: function() {
        return Meteor.user();
    },
    profileUpdated: function() {
        return Template.instance().profileUpdated.get();
    }
});


/**
 * Events
 */
Template.accountSettings.events({
    'change :input, keypress :input': function(event, template) {
        template.profileUpdated.set(true);
    },
    'click #save-changes': function(event, template) {
        event.preventDefault();
        $('#save-changes').text('Saving...');

        var user = {
            email: $('[name=email]').val(),
            oldpw: $('[name=oldpw]').val(),
            newpw: $('[name=newpw]').val(),
            confirmpw: $('[name=confirmpw]').val()
        };

        if (!user.oldpw && user.newpw) {
            $('[name=oldpw]').addClass('error');
            $('.response').addClass('error').text('Must verify current password');
            $('#save-changes').text('Save Changes');
            return;
        }

        if (user.newpw !== user.confirmpw) {
            $('[name=newpw]').addClass('error');
            $('[name=confirmpw]').addClass('error');
            $('.response').addClass('error').text('Passwords do not match');
            $('#save-changes').text('Save Changes');
            return;
        }

        if (user.newpw) {
            Accounts.changePassword(user.oldpw, user.newpw, function(error) {
                if (error) {
                    $('.response').addClass('error').text(error.reason);
                    $('#save-changes').text('Save Changes');
                    return;
                }
                $('#save-changes').text('Account Updated!');
            });
        }

        if (Meteor.user().emails[0].address !== user.email) {
            Meteor.call('updateEmail', user, function (error, result) {
                if (error) {
                    $('.response').addClass('error').text(error.reason);
                    return;
                }
                $('#save-changes').text('Account Updated!');
            });
        }
    }

});