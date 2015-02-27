
Template.reset.events({
    'submit #reset-form': function(e, template) {
        e.preventDefault();

        var password = $('#password').val();
        var verify = $('#verifypw').val();
        var token = template.data.token;

        if (!password || !verify) {
            errorInputs();
            $('.response').addClass('error').text('Please enter your new password twice!');
            return;
        }

        if (password !== verify) {
            errorInputs();
            $('.response').addClass('error').text('Passwords are not matching');
            return;
        }

        Accounts.resetPassword(token, password, function(error) {
            if (error) {
                errorInputs();
                $('.response').addClass('error').text(error.reason);
                return;
            } else {
                Router.go('/signin');
            }
        });
    }
});

function errorInputs() {
    $('#reset-form input').each(function() {
        $(this).css('border-color', 'red');
    });
}