Meteor.methods({
    'sendText': function(number) {
        twilio = Twilio('AC77278612a7d03f1e94d65af71206ccea', '464fa853fd981daad24dc68b29d999c2')
        twilio.sendSms({
            to: '+19548260058',
            from: '+14697131773',
            body: 'Call ' + number + '. They need help - recoverize app'
        }, function (err, responseData) {
            console.log(err)
            console.log(responseData)
        })
    },
    'saveFile': function(buffer, name) {
        var fs = Npm.require("fs");
        var filePath = process.env.PWD + '/server/tmp/' + name;
        var bytes = fs.writeFileSync(filePath, new Buffer(buffer));

    },
    'optimizeImage': function(file) {
        console.log(file.name);
        var features = Imagemagick.identify(file.name);
        console.log(features);
    }
})