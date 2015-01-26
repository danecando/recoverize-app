Template.join.helpers({

})

Template.join.events({
    'submit': function(event, template) {
        event.preventDefault()
        var email = template.$('[name=email]').removeClass('input-error').val()
        var password = template.$('[name=password]').removeClass('input-error').val()
        var confirm = template.$('[name=confirm]').val()

        var errors = {};

        if (!email) {
            errors.email = 'Email required'
            template.$('[name=email]').addClass('input-error')
            template.$('.response').addClass('error').text(errors.email)
        }

        if (!password && email) {
            errors.password = 'Password required'
            template.$('[name=password]').addClass('input-error')
            template.$('.response').addClass('error').text(errors.password)
        }

        if (confirm !== password) {
            errors.confirm = 'Please confirm your password'
            template.$('[name=confirm]').addClass('input-error')
            template.$('.response').addClass('error').text(errors.confirm)
        }

        if (_.keys(errors).length) {
            return
        }

        var user = {
            email: email,
            password: password,
            confirm: confirm
        }

        if (template.$('[name=optin]').is(':checked')) {
            Meteor.call('optIn', user,  function(error, result) {
                if (error) template.$('.response').addClass('error').text(error.reason)
            })
        }

        Meteor.call('createAccount', user, function(error, result) {
            if (error) template.$('.response').addClass('error').text(error.reason)
            if (result) {
                Meteor.loginWithPassword(user.email, user.password, function(error) {
                    if (error) template.$('.response').addClass('error').text(error.reason)
                    Router.go('/create-profile')
                })
            }
        })
    }
})