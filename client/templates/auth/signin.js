
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
            if (error) {
                template.$('.response').addClass('error').text("Couldn't log you in with Facebook")
                return
            }

            if (!Meteor.user().profileCreated && !Roles.userIsInRole(Meteor.user(), ['pending'])) {
                Meteor.call('setUserRole', Meteor.user()._id, ['pending'])
                Router.go('/create-profile')
            } else {
                Router.go('/')
            }
        })
    },
    'click #twitter-login': function(event, template) {
        Meteor.loginWithTwitter(function(error) {
            if (error) {
                template.$('.response').addClass('error').text("Couldn't log you in with Twitter")
                return
            }

            if (!Meteor.user().profileCreated && !Roles.userIsInRole(Meteor.user(), ['pending'])) {
                Meteor.call('setUserRole', Meteor.user()._id, ['pending'])
                Router.go('/create-profile')
            } else {
                Router.go('/')
            }
        })
    },
    'submit': function(event, template) {
        event.preventDefault()

        var email = template.$('[name=email]').removeClass('input-error').val()
        var password = template.$('[name=password]').val()

        var errors = {}

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

        if (_.keys(errors).length) {
            return
        }

        Meteor.loginWithPassword(email, password, function(error) {
            if (error) template.$('.response').addClass('error').text('incorrect username/password')

            Router.go('/')
        })
    }
})