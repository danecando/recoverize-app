Meteor.methods({

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

});
