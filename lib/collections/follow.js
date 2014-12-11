Follow = new Mongo.Collection('follow');

var subs = new SubsManager();

FollowSchema = new SimpleSchema({
    follower: {
        type: String,
        label: "Follower"
    },
    following: {
        type: String,
        label: "Following"
    }
});


/**
 * Create a new follow connection
 * @param username
 * @returns {boolean}
 */
Follow.addFollow = function(username) {

    var count = Follow.find({ following: username, follower: Meteor.user().username }).count();
    subs.reset();
    console.log(count);
    if (count === 0) {
        Follow.insert({following: username, follower: Meteor.user().username}, function(error, _id) {
            if (error) console.log(error);
        });

        return true;
    }

    return false;
};

Follow.attachSchema(FollowSchema);