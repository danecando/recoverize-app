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

        if (template.cordovaFile.get()) {
            $('#save-changes').text('Uploading picture...');

            var file = template.cordovaFile.get();
            var reader = new FileReader();
            reader.onloadend = function(e) {
                var fileBlob = internals.dataURItoBlob(e.target.result);
                if (fileBlob) {
                    fileBlob.name = $('.file-name').text();
                    internals.profilePicUpload(fileBlob, function(error, result) {
                        if (error) {
                            return;
                        }
                        $('#save-changes').text('Picture uploaded!');
                    })
                }
            }
            reader.readAsDataURL(file);
        }

    },
    'click #cordova-upload': function(e, template) {
        navigator.camera.getPicture(function(imageUri) {
            var fileNameIndex = imageUri.lastIndexOf("/") + 1;
            var filename = imageUri.substr(fileNameIndex);
            $('.file-name').text(filename);

            window.resolveLocalFileSystemURL(imageUri, function(fileEntry) {
               fileEntry.file(function(file) {
                   file.name = filename;
                   template.profileUpdated.set(true);
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