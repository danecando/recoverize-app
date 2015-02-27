
Template.forgotten.events({
    'submit #forgotten-form': function(e, template) {
        e.preventDefault();

        var email = $('#email').val();
        if (!email) {
            $('#email').css('border-color', 'red');
            $('.response').addClass('error').text('Please enter your email address');
            return;
        }

        $('.btn-primary').text('Processing...');

        Accounts.forgotPassword({ email: email }, function(error) {
            if (error) {
                $('#email').css('border-color', 'red');
                $('.response').addClass('error').text(error.reason);
                $('.btn-primary').text('Reset Password');
                return;
            } else {
                $('#email').css('border-color', 'white');
                $('.btn-primary').text('Email Sent');
                $('.response').removeClass('error').text('Check your email to get your password reset link.');
            }
        });
    }
});