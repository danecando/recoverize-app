var path = Npm.require('path'),
    crypto = Npm.require('crypto')

var bucket = "recoverize-app",
    awsKey = Meteor.settings.AWSAccessKeyId,
    secret = Meteor.settings.AWSSecretAccessKey

Meteor.methods({
    sign: function(fileName) {

        var expiration = new Date(new Date().getTime() + 1000 * 60 * 5).toISOString()

        var policy = {
            "expiration": expiration,
            "conditions": [
                { "bucket": "recoverize-app" },
                { "key": fileName },
                { "acl": 'public-read' },
                ["starts-with", "$Content-Type", ""],
                ["content-length-range", 0, 524288000]
            ]
        }

        policyBase64 = new Buffer(JSON.stringify(policy), 'utf8').toString('base64')
        signature = crypto.createHmac('sha1', secret).update(policyBase64).digest('base64')

        return {
            bucket: bucket,
            awsKey: awsKey,
            policy: policyBase64,
            signature: signature
        }
    }
})