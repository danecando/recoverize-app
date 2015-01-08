
Template.signin.created = function() {
}

Template.signin.destroyed = function() {
}

Template.signin.helpers({
    userCount: function(){
        return Meteor.users.find().count()
    }
})

Template.signin.events({
    'click #facebook-login': function(event, template) {
        Meteor.loginWithFacebook({ requestPermissions: ['email']},
        function(error) {
            if (error) template.$('.error-message').text("Couldn't log you in with Facebook")
            else Router.go('create-profile')
        })
    },
    'click #twitter-login': function(event, template) {
        Meteor.loginWithTwitter(function(error) {
            if (error) template.$('.error-message').text("Couldn't log you in with Twitter")
            else Router.go('/create-profile')
        })
    },
    'submit': function(event, template) {
        event.preventDefault()

        var email = template.$('[name=email]').removeClass('input-error').val()
        var password = template.$('[name=password]').val()

        var errors = {}

        if (!email) {
            errors.email = 'Enter your email address'
            template.$('[name=email]').addClass('input-error')
            template.$('.error-message').text(errors.email)
        }

        if (!password && email) {
            errors.password = 'Enter your password'
            template.$('[name=password]').addClass('input-error')
            template.$('.error-message').text(errors.password)
        }

        if (_.keys(errors).length) {
            return
        }

        Meteor.loginWithPassword(email, password, function(error) {
            if (error) {
                template.$('.error-message').text('incorrect username/password')
            }

            Router.go('/')
        })
    }
})