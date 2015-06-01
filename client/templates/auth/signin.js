Template.signin.onCreated(function() {
  var instance = this;
  instance.userCount = new ReactiveVar();

  Meteor.call('getUserCount', function(err, count) {
    if (count) instance.userCount.set(count);
  });
});

Template.signin.helpers({
  userCount: function() {
    return Template.instance().userCount.get();
  }
});

Template.signin.events({
  'click #facebook-login': function(e, template) {
    Meteor.loginWithFacebook({ requestPermissions: ['email']},
      function(error) {
        if (error) {
          $('.response').addClass('error').text("Couldn't log you in with Facebook");
          return;
        }

        if (!Meteor.user().profileCreated && !Roles.userIsInRole(Meteor.user(), ['pending'])) {
          Meteor.call('setUserRole', Meteor.user()._id, ['pending']);
          Router.go('/create-profile');
        } else {
          Router.go('/');
        }
      });
  },
  'click #twitter-login': function(e, template) {
    Meteor.loginWithTwitter(function(error) {
      if (error) {
        $('.response').addClass('error').text("Couldn't log you in with Twitter");
        return;
      }

      if (!Meteor.user().profileCreated && !Roles.userIsInRole(Meteor.user(), ['pending'])) {
        Meteor.call('setUserRole', Meteor.user()._id, ['pending']);
        Router.go('/create-profile');
      } else {
        Router.go('/');
      }
    });
  },
  'submit #sign-in-form': function(e, template) {
    e.preventDefault();

    var email = $('[name=email]').removeClass('input-error').val();
    var password = $('[name=password]').val();

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

    if (_.keys(errors).length) {
      return;
    }

    $('#sign-in').text('Signing in...');

    Meteor.loginWithPassword({ email: email }, password, function(error) {
      if (error) {
        $('.response').addClass('error').text('incorrect username/password');
        $('#sign-in').text('Sign in');
        return;
      }

      Router.go('/');
    });
  }
});