Template.createProfile.created = function() {

    Session.setDefault('days', 31);

    this.stepStatus = new ReactiveVar(false);
    this.cordovaFile = new ReactiveVar(false);
};

/**
 * Template Helpers
 */
Template.createProfile.helpers({
    cordova: function() {
        return !!Meteor.isCordova;
    },
    stepReady: function() {
        return Template.instance().stepStatus.get();
    },
    user: function() {
        return Meteor.user();
    },
    days: function() {
        var days = [];

        for (var i = 1; i <= Session.get('days'); i++) {
            days.push(i);
        }

        return days;
    },
    years: function() {
        var today = new Date(),
            year = today.getFullYear(),
            years = [];

        for (; year >= 1930; year--) {
            years.push(year);
        }

        return years;
    }
});

/**
 * Template Events
 */
Template.createProfile.events({
    'change :input, keypress :input': function(e, template) {
        if ($(e.target).val().length) {
            template.stepStatus.set(true);
        } else {
            template.stepStatus.set(false);
        }
    },
    'click .skip': function(e, template) {
        e.preventDefault();

        // going to remove skip button on this step instead
        //if ($('.active').filter(':last').index() === 2 && !template.$('[name=name]').val()) {
        //        template.$('#step-three .response').addClass('error').text("Don't forget a display name!");
        //        template.$('[name=name]').css('border-color', 'red');
        //        return;
        //}

        $(e.target).closest('.step').fadeOut(250, function() {
            $(this).next().fadeIn(250);
            $('.active').filter(':last').next().addClass('active');
        });
    },
    'submit #step-one form': function(e, template) {
        e.preventDefault();

        var username = template.$('[name=username]').val();

        Meteor.call('createUsername', username, function(error, result) {
            if (error) {
                template.$('#step-one .response').addClass('error').text(error.reason);
                template.$('[name=username]').css('border-color', 'red');
                return;
            }

            template.stepStatus.set(false);

            $('#step-one').addClass('complete').fadeOut(250, function() {
                $('#step-two').fadeIn(250);
            });

            $('.active').filter(':last').next().addClass('active');
        });
    },
    'submit #step-two form': function(e, template) {
        e.preventDefault();

        // upload profile pic from cordova
        if (template.cordovaFile.get()) {
            var file = template.cordovaFile.get();

            window.resolveLocalFileSystemURL(file.uri, function(fileEntry) {

                fileEntry.file(function(fileObj) {

                    file.size = fileObj.size;

                    AwsUpload.upload(file, function(path) {

                        var profile = {};
                        profile.profilePic = path;

                        Meteor.call('updateProfile', profile, function(error, result) {
                            if (error) {
                                template.$('#step-two .response').addClass('error').text(error.reason);
                                template.$('#cordova-upload').css('border-color', 'red');
                                return;
                            }

                            template.stepStatus.set(false);

                            $('#step-two').addClass('complete').fadeOut(250, function() {
                                $('#step-three').fadeIn(250)
                            });

                            $('.active').filter(':last').next().addClass('active');
                        });
                    });
                });
            });
        }

        // upload profile pic for web
        if (!Meteor.isCordova) {
            var file = template.$('[name=profilePic]')[0].files[0];

            if (file) {
                internals.profilePicUpload(file, function(error, result) {
                    if (error) {
                        template.$('#step-two .response').addClass('error').text(error.reason);
                        template.$('[type=file]').css('border-color', 'red');
                        return;
                    }

                    template.stepStatus.set(true);

                    $('#step-two').addClass('complete').fadeOut(250, function() {
                        $('#step-three').fadeIn(250);
                    });

                    $('.active').filter(':last').next().addClass('active');

                });
            }
        }
    },
    'submit #step-three form': function(e, template) {
        e.preventDefault()

        var profile = {
            name: template.$('[name=name]').val(),
            location: template.$('[name=location]').val(),
            gender: template.$('[name=gender]').val()
        };

        if (!profile.name) {
            template.$('#step-three .response').addClass('error').text("Don't forget a display name!");
            template.$('[name=name]').css('border-color', 'red');
            return;
        }

        Meteor.call('updateProfile', profile, function(error, result) {
            if (error) {
                template.$('#step-three .response').addClass('error').text(error.reason);
                return;
            }

            Session.set('stepStatus', false);

            $('#step-three').addClass('complete');
            $('#step-three').fadeOut(250, function() {
                $('#step-four').fadeIn(250);
            });

            $('.active').filter(':last').next().addClass('active');
        });
    },
    'submit #step-four form': function(e, template) {
        e.preventDefault();

        var month = template.$('[name=soberMonth]').val();
        var day = template.$('[name=soberDay]').val();
        var year = template.$('[name=soberYear]').val();

        var profile = {
            program: template.$('[name=program]').val(),
            homegroup: template.$('[name=homegroup]').val(),
            soberDate: new Date(year, month-1, day),
            quote: template.$('[name=quote]').val()
        };

        if (Meteor.user().profile.profilePic) {
            profile.profilePic = Meteor.user().profile.profilePic;
        } else {
            profile.profilePic = (Meteor.user().profile.gender == 'male') ? "male_avatar.jpg" : "female_avatar.jpg";
        }

        Meteor.call('updateProfile', profile, function(error, result) {
            if (error) {
                template.$('#step-four .response').text(error.error);
            }

            Meteor.call('updateUserRoles', Meteor.user()._id, ['member'], function(error, result) {
                Meteor.call('setProfileCreated');
                Router.go('/');
            });
        });
    },
    'change #sober-month': function(e, template) {

        var month = template.$('#sober-month').val(),
            year = template.$('#sober-year').val(),
            days = new Date(year, month, 0).getDate();

        Session.set('days', days);
    },

    'change #sober-year': function(e, template) {

        var month = template.$('#sober-month').val(),
            year = template.$('#sober-year').val(),
            days = new Date(year, month, 0).getDate();

        Session.set('days', days);
    },
    'click #cordova-upload': function(e, template) {
        window.imagePicker.getPictures(
            function (results) {
                for (var i = 0; i < results.length; i++) {
                    var file = {
                        type: results[i].split('.').pop(),
                        name: results[i].replace(/^.*[\\\/]/, ''),
                        uri: results[i]
                    };

                    template.cordovaFile.set(file);
                    template.stepStatus.set(true);
                    $('#cordova-upload').text(file.name);
                }
            }, function(error) {
                console.log(error);
            });
    }
});