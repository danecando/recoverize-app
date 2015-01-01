var ERRORS_KEY = 'joinErrors'

Template.join.created = function() {
    Session.set(ERRORS_KEY, {})
};

Template.join.helpers({
    errorMessages: function() {
        return _.values(Session.get(ERRORS_KEY))
    },
    errorClass: function(key) {
        return Session.get(ERRORS_KEY)[key] && 'error'
    }
})

Template.join.events({
    'submit': function(event, template) {
        event.preventDefault()
        var email = template.$('[name=email]').val()
        var password = template.$('[name=password]').val()
        var confirm = template.$('[name=confirm]').val()
        var username = template.$('[name=username]').val()

        var errors = {};

        if (! email) {
            errors.email = 'Email required'
        }

        if (! password) {
            errors.password = 'Password required'
        }

        if (confirm !== password) {
            errors.confirm = 'Please confirm your password'
        }

        Session.set(ERRORS_KEY, errors);
        if (_.keys(errors).length) {
            return
        }

        var user = {
            email: email,
            password: password,
            confirm: confirm,
            username: username
        }

        if (template.$('[name=optin]').is(':checked')) {
            Meteor.call('optIn', user,  function(error, result) {
                // todo: setup logging for internal errors
                if (error) console.log(error)
                else console.log(result)
            })
        }

        Meteor.call('createAccount', user, function(error, result) {

            if (error) {
                errors.create = error
            }

            if (result) {
                Meteor.loginWithPassword(user.email, user.password, function(error) {
                    Router.go('/user/profile')
                })
            }
        })
    }
});