/**
 * Resizes profile picture image, uploads thumb and full size to aws, and stores in db
 * @param file
 * @param cb
 */
profilePicUpload = function(file, cb) {

    var user = Object.create(null);
    var uploader = new Slingshot.Upload('profilePic');

    processImage(file, 75, 75, function(dataURI) {
        var thumbnail = dataUriToBlob(dataURI);
        thumbnail.name = 'thumb_' + file.name;

        uploader.send(thumbnail, function (error, downloadUrl) {
            if (error) {
                cb(new Meteor.Error(500, 'Failed to upload profile picture'));
            }

            user.profilePicThumb = Meteor.user().username + '/' + thumbnail.name;

            processImage(file, 500, 500, function(dataURI) {
                var profilePic = dataUriToBlob(dataURI);
                profilePic.name = file.name;

                uploader.send(profilePic, function(error, downloadUrl) {
                    if (error) {
                        cb(new Meteor.Error(500, 'Failed to upload profile picture'));
                    }

                    user.profilePic = Meteor.user().username + '/' + profilePic.name;

                    Meteor.call('updateProfile', user, function(error, result) {
                        if (error) {
                            cb(new Meteor.Error(500, 'Failed to upload profile picture'));
                        }

                        cb(null, result);
                    });
                });
            });
        });
    });
};

/**
 * Converts a data uri into Blob object
 * @param dataURI
 * @returns {Blob}
 */
function dataUriToBlob(dataURI) {
    var binary = atob(dataURI.split(',')[1]);
    var array = [];
    for(var i = 0; i < binary.length; i++) {
        array.push(binary.charCodeAt(i));
    }
    return new Blob([new Uint8Array(array)], {type: 'image/jpeg'});
}