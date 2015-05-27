/**
 * Expose methods via global var
 * @type {{}}
 */
Utility = {};

/**
 * Converts a data uri into Blob object
 * @param dataURI
 * @returns {Blob}
 */
Utility.dataURItoBlob = function(dataURI) {
  var byteString = atob(dataURI.split(',')[1]);
  var ab = new ArrayBuffer(byteString.length);
  var ia = new Uint8Array(ab);
  for (var i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  return new Blob([ab], { type: 'image/jpeg' });
};

/**
 * Check an objects props
 * @param obj
 * @param arr
 * @returns {boolean}
 */
Utility.hasOwnProperties = function(obj, arr) {
  return arr.every(function(x) {
    return obj.hasOwnProperty(x);
  });
};

/**
 * Get a valid user ID
 * @returns {*}
 */
Utility.getUserId = function getUserId() {
  var id;
  try {
    id = Meteor.userId();
    check(id, String);
  } catch(e) {
    if (typeof this.userId === 'string') {
      id = this.userId;
    } else {
      throw new Meteor.Error(403, 'Error getting userId');
    }
  }
  return id;
};

/**
 * Check if a user is an admin
 * @param id
 * @returns {boolean}
 */
Utility.isUserAdmin = function isUserAdmin(id) {
  if (Roles.userIsInRole(id, ['admin'])) {
    return true;
  }
  return false;
};

/**
 * Check if a user has been banned
 * @param id
 * @returns {boolean}
 */
Utility.isUserBanned = function isUserBanned(id) {
  if (Roles.userIsInRole(id, ['banned'])) {
    return true;
  }
  return false;
};

/**
 * Check if file name has an extension
 * @param path
 * @returns {boolean}
 */
Utility.hasFileExt = function hasFileExt(file) {
  check(file, String);
  var split = file.split('.').pop();
  return file === split ? false : true;
};

/**
 * If weird native android thing return partial file name
 * @param path
 * @returns {T}
 */
Utility.getFileName = function getFileName(path) {
  check(path, String);
  var end = path.split('/').pop();
  return end.indexOf('%3A') !== -1 ? end.split('%3A').pop() : end;
};

/**
 * Returns a file extension based on image mime type or false
 * For weird stuff in native android
 * @param file
 * @returns {*}
 */
Utility.getImageExt = function getImageExt(type) {
  check(type, String);
  switch (type) {
    case 'image/jpeg':
      return '.jpg';
    case 'image/png':
      return '.png';
    default:
      return '';
  }
};

/**
 * Resizes profile picture image, uploads thumb and full size to aws, and stores in db
 * @param file
 * @param cb
 */
Utility.profilePicUpload = function(file, cb) {

  var user = {};
  var uploader = new Slingshot.Upload('image');

  processImage(file, 125, 125, function(dataURI) {
    var thumbnail = Utility.dataURItoBlob(dataURI);
    thumbnail.name = 'thumb_' + file.name;

    uploader.send(thumbnail, function (error, downloadUrl) {
      if (error) {
        return cb(new Meteor.Error(500, 'Failed to upload profile picture'));
      }

      user.profilePicThumb = Meteor.user().username + '/' + thumbnail.name;

      processImage(file, 500, 500, function(dataURI) {
        var profilePic = Utility.dataURItoBlob(dataURI);
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
 * Upload a status photo
 * @param file
 * @returns {*}
 */
Utility.statusPhotoUpload = function(file) {
  var self = this;
  return self.resizeImage(file, 500, 500)
    .then(function(dataURI) {
      var photo = self.dataURItoBlob(dataURI);
      photo.name = file.name;
      return photo;
    })
    .then(self.uploadImage);
};

/**
 * Uploads image to amazon s3 bucket
 * @param image
 * @returns {Promise}
 */
Utility.uploadImage = function uploadImage(image) {
  return new Promise(function(resolve, reject) {
    var s3 = new Slingshot.Upload('image');
    s3.send(image, function(err, url) {
      if (err) return reject(err);
      else return resolve(url);
    });
  });
};

/**
 * Client side image resizer
 * @param file
 * @param maxWidth
 * @param maxHeight
 * @returns {Promise}
 */
Utility.resizeImage = function resizeImage(file, maxWidth, maxHeight) {
  return new Promise(function(resolve, reject) {
    processImage(file, maxWidth, maxHeight, function(dataURI) {
      if (dataURI) return resolve(dataURI);
      else return reject();
    });
  });
};
