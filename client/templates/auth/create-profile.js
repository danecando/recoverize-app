Template.createProfile.created = function() {
    this.days = new ReactiveVar(31);
    this.stepStatus = new ReactiveVar(false);
    this.cordovaFile = new ReactiveVar(false);
};

/**
 * Template Helpers
 */
Template.createProfile.helpers({
    cordova: function() {
        return Meteor.isCordova;
    },
    stepReady: function() {
        return Template.instance().stepStatus.get();
    },
    user: function() {
        return Meteor.user();
    },
    days: function() {
        var days = [];

        for (var i = 1; i <= Template.instance().days.get(); i++) {
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

    'change :input, keypress :input, keyup :input, keydown :input': function(e, template) {
        if ($(e.target).val().length) {
            template.stepStatus.set(true);
        } else {
            template.stepStatus.set(false);
        }
    },

    'click .skip': function(e, template) {
        e.preventDefault();

        $(e.target).closest('.step').fadeOut(250, function() {
            $(this).next().fadeIn(250);
            $('.active').filter(':last').next().addClass('active');
        });
    },

    'submit #step-one form': function(e, template) {
        e.preventDefault();

        var username = $('[name=username]').val();

        Meteor.call('createUsername', username, function(error, result) {
            if (error) {
                $('#step-one .response').addClass('error').text(error.reason);
                $('[name=username]').css('border-color', 'red');
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
            $('#save-changes').text('Uploading picture...');

            var file = template.cordovaFile.get();
            var reader = new FileReader();
            reader.onloadend = function(e) {
                var fileBlob = Utility.dataURItoBlob(e.target.result);
                if (fileBlob) {
                    fileBlob.name = $('.file-name').text();
                    Utility.profilePicUpload(fileBlob, function(error, result) {
                        if (error) {
                            $('#step-two .response').addClass('error').text(error.reason);
                            $('[type=file]').css('border-color', 'red');
                            return;
                        }

                        template.stepStatus.set(false);

                        $('#step-two').addClass('complete').fadeOut(250, function() {
                            $('#step-three').fadeIn(250);
                        });

                        $('.active').filter(':last').next().addClass('active');
                    })
                }
            }
            reader.readAsDataURL(file);
        }

        // upload profile pic for web
        if (!Meteor.isCordova) {
            var file = $('[name=profilePic]')[0].files[0];

            if (file) {
                Utility.profilePicUpload(file, function(error, result) {
                    if (error) {
                        $('#step-two .response').addClass('error').text(error.reason);
                        $('[type=file]').css('border-color', 'red');
                        return;
                    }

                    template.stepStatus.set(false);

                    $('#step-two').addClass('complete').fadeOut(250, function() {
                        $('#step-three').fadeIn(250);
                    });

                    $('.active').filter(':last').next().addClass('active');

                });
            }
        }
    },

    'submit #step-three form': function(e, template) {
        e.preventDefault();

        var profile = {
            name: $('[name=name]').val(),
            location: $('[name=location]').val(),
            gender: $('[name=gender]').val()
        };

        if (!profile.name) {
            $('#step-three .response').addClass('error').text('Don\'t forget a display name!');
            $('[name=name]').css('border-color', 'red');
            return;
        }

        Meteor.call('updateProfile', profile, function(error, result) {
            if (error) {
                $('#step-three .response').addClass('error').text(error.reason);
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

        $('#finish-btn').text('Logging in...')

        var month = $('[name=soberMonth]').val();
        var day = $('[name=soberDay]').val();
        var year = $('[name=soberYear]').val();

        var profile = {
            program: $('[name=program]').val(),
            homegroup: $('[name=homegroup]').val(),
            soberDate: new Date(year, month-1, day),
            quote: $('[name=quote]').val()
        };

        if (!Meteor.user().username) {
            location.reload(true);
        }

        if (Meteor.user().profile.profilePic) {
            profile.profilePic = Meteor.user().profile.profilePic;
        } else {
            profile.profilePic = (Meteor.user().profile.gender == 'male') ? 'male_avatar.jpg' : 'female_avatar.jpg';
            profile.profilePicThumb = (Meteor.user().profile.gender == 'male') ? 'thumb_male_avatar.jpg' : 'thumb_female_avatar.jpg';
        }

        Meteor.call('updateProfile', profile, function(error, result) {
            if (error) {
                $('#step-four .response').text(error.error);
            }

            Meteor.call('updateUserRoles', Meteor.user()._id, ['member'], function(error, result) {
                Meteor.call('setProfileCreated');
                Router.go('/');
            });
        });
    },

    'change #sober-month': function(e, template) {

        var month = $('#sober-month').val(),
            year = $('#sober-year').val(),
            days = new Date(year, month, 0).getDate();

        template.days.set(days);
    },

    'change #sober-year': function(e, template) {

        var month = $('#sober-month').val(),
            year = $('#sober-year').val(),
            days = new Date(year, month, 0).getDate();

        template.days.set(days);
    },

    'click #cordova-upload': function(e, template) {
        navigator.camera.getPicture(function(imageUri) {
            var fileNameIndex = imageUri.lastIndexOf('/') + 1;
            var filename = imageUri.substr(fileNameIndex);
            $('.file-name').text(filename);

            window.resolveLocalFileSystemURL(imageUri, function(fileEntry) {
                fileEntry.file(function(file) {
                    file.name = filename;
                    template.stepStatus.set(true);
                    template.cordovaFile.set(file);
                });
            });

        }, function(err) {
            console.log(err);
        }, { quality: 50,
            destinationType: Camera.DestinationType.FILE_URI,
            sourceType : Camera.PictureSourceType.PHOTOLIBRARY
        });
    }

});