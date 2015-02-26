/**
 * Template Events
 */
Template.join.events({
    'submit': function(e, template) {
        e.preventDefault();

        var email = $('[name=email]').removeClass('input-error').val();
        var password = $('[name=password]').removeClass('input-error').val();
        var confirm = $('[name=confirm]').val();

        var errors = {};

        if (!email) {
            errors.email = 'Email required';
            $('[name=email]').addClass('input-error');
            $('.response').addClass('error').text(errors.email);
        }

        if (!password && email) {
            errors.password = 'Password required';
            $('[name=password]').addClass('input-error');
            $('.response').addClass('error').text(errors.password);
        }

        if (confirm !== password) {
            errors.confirm = 'Please confirm your password';
            $('[name=confirm]').addClass('input-error');
            $('.response').addClass('error').text(errors.confirm);
        }

        if (_.keys(errors).length) {
            return;
        }

        $('#join-btn').text('Creating Account...');

        var user = {
            email: email,
            password: password
        };

        if ($('[name=optin]').is(':checked')) {
            Meteor.call('optIn', user);
        }

        Meteor.call('createAccount', user, function(error, result) {
            if (error) {
                $('.response').addClass('error').text(error.reason);
                $('#join-btn').text('Join Now');
                return;
            }

            Meteor.loginWithPassword({ email: user.email }, user.password, function(error) {
                if (error) {
                    $('.response').addClass('error').text(error.reason);
                    $('#join-btn').text('Join Now');
                    return;
                }

                Router.go('/create-profile');
            });

        });
    }
});