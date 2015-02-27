/**
 * Meteor Email Templates
 */

Meteor.startup(function() {

    /**
     * Password Reset Template
     */
    Accounts.emailTemplates.siteName = "Recoverize 2.0";

    Accounts.emailTemplates.from = "Recoverize App <app@recoverize.com>";

    Accounts.emailTemplates.resetPassword.subject = function (user) {
        return "Reset your recoverize password";
    };

    Accounts.emailTemplates.enrollAccount.text = function (user, url) {
        var name = user.profile.name || 'user';
        return
        "Hello " + name + ","
        + " To reset your password, simply click the link below.\n\n"
        + url;
    };

    Accounts.urls.resetPassword = function(token) {
        return Meteor.absoluteUrl('reset?t=' + token);
    };
});