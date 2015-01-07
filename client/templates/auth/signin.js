var ERRORS_KEY = 'signinErrors'

Template.signin.created = function() {
    Session.set(ERRORS_KEY, {})
    $('#container').addClass('no-bar')

}

Template.signin.destroyed = function() {
    $('#container').removeClass('no-bar')
}

Template.signin.helpers({
    errorMessages: function() {
        return _.values(Session.get(ERRORS_KEY))
    },
    errorClass: function(key) {
        return Session.get(ERRORS_KEY)[key] && 'error'
    },
    users: function(){
        return Meteor.users.find()
    }
})

Template.signin.events({
    'click #facebook-login': function(event, template) {
        Meteor.loginWithFacebook({ requestPermissions: ['email']},
        function(error) {
            if (error) console.log(error)
            else Router.go('/')
        })
    },
    'click #twitter-login': function(event, template) {
        Meteor.loginWithTwitter(function(error) {
            if (error) console.log(error)
            else Router.go('/')
        })
    },
    'submit': function(event, template) {
        event.preventDefault()

        var email = template.$('[name=email]').val()
        var password = template.$('[name=password]').val()

        var errors = {}

        if (! email) {
            errors.email = 'Email is required'
        }

        if (! password) {
            errors.password = 'Password is required'
        }

        Session.set(ERRORS_KEY, errors);
        if (_.keys(errors).length) {
            return
        }

        Meteor.loginWithPassword(email, password, function(error) {
            if (error) {
                return Session.set(ERRORS_KEY, {'none': error.reason})
            }

            Router.go('/')
        })
    }
})