Template.join.helpers({

})

Template.join.events({
    'submit': function(event, template) {
        event.preventDefault()
        var email = template.$('[name=email]').removeClass('input-error').val()
        var username = template.$('[name=username]').removeClass('input-error').val()
        var password = template.$('[name=password]').removeClass('input-error').val()
        var confirm = template.$('[name=confirm]').val()

        var errors = {};

        if (!email) {
            errors.email = 'Email required'
            template.$('[name=email]').addClass('input-error')
            template.$('.error-message').text(errors.email)
        }

        if (!username && email) {
            errors.username = 'Username required'
            template.$('[name=username]').addClass('input-error')
            template.$('.error-message').text(errors.username)
        }

        if (!password && email && username) {
            errors.password = 'Password required'
            template.$('[name=password]').addClass('input-error')
            template.$('.error-message').text(errors.password)
        }

        if (confirm !== password) {
            errors.confirm = 'Please confirm your password'
            template.$('[name=confirm]').addClass('input-error')
            template.$('.error-message').text(errors.confirm)
        }

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
                if (error) template.$('.error-message').text(error.reason)
            })
        }

        Meteor.call('createAccount', user, function(error, result) {
            if (error) template.$('.error-message').text(error.reason)
            if (result) {
                Meteor.loginWithPassword(user.email, user.password, function(error) {
                    if (error) template.$('.error-message').text(error.reason)
                    Router.go('/user/profile')
                })
            }
        })
    }
});