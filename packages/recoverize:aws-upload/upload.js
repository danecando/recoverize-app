
AwsUpload.upload = function(fileURI, fileName) {
    Meteor.startup(function() {

        var ft = new FileTransfer()
        var options = new FileUploadOptions()

        options.fileKey = "file";
        options.fileName = fileName;
        options.mimeType = "image/jpeg";
        options.chunkedMode = false;

        Meteor.call('sign', options.fileName, function(error, data) {
            options.params = {
                "key": fileName,
                "AWSAccessKeyId": data.awsKey,
                "acl": "public-read",
                "policy": data.policy,
                "signature": data.signature,
                "Content-Type": "image/jpeg"
            }

            ft.upload(fileURI, "https://" + data.bucket + ".s3.amazonaws.com/", function(error) {
                console.log(error)
            }, function(result) {
                console.log(JSON.stringify(result))
            }, options)
        })

    })

}