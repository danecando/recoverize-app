Template.profilePicture.created = function() {
    this.cordovaFile = new ReactiveVar(false);
    this.profileUpdated = new ReactiveVar(false);
};

/**
 * Template Helpers
 */
Template.profilePicture.helpers({
    cordova: function() {
        return !!Meteor.isCordova;
    },
    user: function() {
        return Meteor.user();
    },
    profileUpdated: function() {
        return Template.instance().profileUpdated.get();
    }
});

/**
 * Template Events
 */
Template.profilePicture.events({
    'submit form': function(e, template) {
        e.preventDefault();

        //upload profile pic from cordova
        if (template.cordovaFile.get()) {

            $('#save-changes').text('Uploading Photo...');

            var file = template.cordovaFile.get();

            window.resolveLocalFileSystemURL(file.uri, function(fileEntry) {

                fileEntry.file(function(fileObj) {

                    file.size = fileObj.size;

                    AwsUpload.upload(file, function(path) {

                        var profile = {};
                        profile.profilePic = path;

                        Meteor.call('updateProfile', profile, function(error, result) {
                            if (error) {
                                $('#cordova-upload').css('border-color', 'red');
                                $('#save-changes').text('An error occured');
                                return;
                            }
                            $('#save-changes').text('Upload Finished!');
                        });
                    });
                });
            });
        }

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

                    template.profileUpdated.set(true);
                    template.cordovaFile.set(file);
                    $('#cordova-upload').text(file.name);
                }
            }, function(error) {
                console.log(error);
            });
    }
});