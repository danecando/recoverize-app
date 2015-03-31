/**
 * Expose methods via global var
 * @type {{}}
 */
internals = {}

/**
 * Converts a data uri into Blob object
 * @param dataURI
 * @returns {Blob}
 */
internals.dataURItoBlob = function(dataURI) {
    var byteString = atob(dataURI.split(',')[1]);
    var ab = new ArrayBuffer(byteString.length);
    var ia = new Uint8Array(ab);
    for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: 'image/jpeg' });
}

/**
 * Resizes profile picture image, uploads thumb and full size to aws, and stores in db
 * @param file
 * @param cb
 */
internals.profilePicUpload = function(file, cb) {

    var user = {};
    var uploader = new Slingshot.Upload('profilePic');

    processImage(file, 125, 125, function(dataURI) {
        var thumbnail = internals.dataURItoBlob(dataURI);
        thumbnail.name = 'thumb_' + file.name;

        uploader.send(thumbnail, function (error, downloadUrl) {
            if (error) {
                return cb(new Meteor.Error(500, 'Failed to upload profile picture'));
            }

            user.profilePicThumb = Meteor.user().username + '/' + thumbnail.name;

            processImage(file, 500, 500, function(dataURI) {
                var profilePic = internals.dataURItoBlob(dataURI);
                profilePic.name = file.name;

                uploader.send(profilePic, function(error, downloadUrl) {
                    if (error) {
                        return cb(new Meteor.Error(500, 'Failed to upload profile picture'));
                    }

                    user.profilePic = Meteor.user().username + '/' + profilePic.name;

                    Meteor.call('updateProfile', user, function(error, result) {
                        if (error) {
                            cb(new Meteor.Error(500, 'Failed to upload profile picture'));
                        }

                        return cb(null, result);
                    });
                });
            });
        });
    });
};

/**
 * Optimize status image before upload
 * @param file
 * @param cb
 */
internals.statusPhotoUpload = function(file, cb) {

    var uploader = new Slingshot.Upload("profilePic");

    processImage(file, 500, 500, function(dataURI) {
        var statusPhoto = dataURItoBlob(dataURI);
        statusPhoto.name = file.name;

        uploader.send(statusPhoto, function (error, downloadUrl) {
            if (error) {
                return cb(error);
            }

            return cb(null);
        });

    });
};

