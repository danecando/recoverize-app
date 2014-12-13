var UPDATED = 'updated'


Template.profileUpdate.created = function() {
    Session.setDefault('updated', false)
}


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

        var username = template.$('[name=username]').val();
        var email = template.$('[name=email]').val();
        var oldpw = template.$('[name=oldpw]').val();
        var newpw = template.$('[name=newpw]').val();
        var confirmpw = template.$('[name=confirmpw]').val();

        if (!oldpw && newpw || !oldpw && email) {
            $oldpw.addClass('error')
            template.$('.response').text('Must verify current password')
        }

        if (newpw !== confirmpw) {
            $newpw.addClass('error')
            $confirmpw.addClass('error')
            template.$('.response').text('Passwords do not match')
        }

        Meteor.call('updateAccount', user, function(error, result) {
            // todo: server side validation and update
            if (error) {
                console.error(error)
            }

        })


        //var $name = template.$('[name=name]');
        //Meteor.users.update({_id: Meteor.userId() }, { $set: { profile: { name: $name.val() }}}, function(error, result) {
        //    if (error) {
        //        $name.addClass('error');
        //        console.error(error + result);
        //        return;
        //    }
        //});

    }

});