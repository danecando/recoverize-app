/**
 * Upload file to aws and pass path to callback
 * @param file
 * @param cb
 */
AwsUpload.upload = function(file, cb) {
    Meteor.startup(function() {

        var ft = new FileTransfer()
        var options = new FileUploadOptions()

        if (file.size > 3000000)
            throw new Meteor.Error('Image exceeds maximum file size')

        if (file.type != 'jpg' && file.type != 'jpeg' && file.type != 'png')
            throw new Meteor.Error('Please upload a jpg or png image')

        options.fileKey = "file"
        options.fileName = file.name
        options.mimeType = "image/jpeg"
        options.chunkedMode = false

        var awsPath = Meteor.user().username + '/' + file.name

        Meteor.call('sign', options.fileName, function(error, data) {
            options.params = {
                "key": awsPath,
                "AWSAccessKeyId": data.awsKey,
                "acl": "public-read",
                "policy": data.policy,
                "signature": data.signature,
                "Content-Type": "image/jpeg"
            }

            ft.upload(file.uri, "https://" + data.bucket + ".s3.amazonaws.com/", function(result) {
                cb(awsPath)
            }, function(error) {
                cb(error)
            }, options)
        })

    })

}