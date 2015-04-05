/**
 * Sever side methods available throughout the application
 */

Meteor.methods({
    /**
     * Send text message when user requests a contact
     * @param number
     */
    'sendText': function(number) {
        twilio = Twilio('AC77278612a7d03f1e94d65af71206ccea', '464fa853fd981daad24dc68b29d999c2');
        twilio.sendSms({
            to: '+19548260058', // number to alert
            from: '+14697131773', // twilio number
            body: 'Call ' + number + '. They need help - recoverize app'
        }, function (err, responseData) {
            if (err) {
                throw new Meteor.Error(500, 'Couldn\'t dispatch text message');
            }
        });
    },


    'getAnniversaries': function() {
        var results = Meteor.users.aggregate(
            [
                {
                    $match: {
                        'profile.soberDate': { $exists: true }
                    }
                },
                {
                    $project: {
                        month: {
                            $month: '$profile.soberDate'
                        },
                        year: {
                            $year: '$profile.soberDate'
                        },
                        username: 1,
                        'profile.profilePicThumb': 1,
                        'profile.name': 1,
                        'profile.soberDate': 1,
                        'profile.program': 1
                    }
                },
                {
                    $match: {
                        month: new Date().getMonth(),
                        year: { $ne: new Date().getFullYear() }
                    }
                }
            ]
        );

        return results;
    }


})