Meteor.methods({

    /**
     * Increase serenity
     * @param amount
     * @param username
     */
    'increaseSerenity': function(amount, username) {

        amount = amount || 1;
        username = username || Meteor.user().username;

        check(amount, Number);
        check(username, String);

        Meteor.users.update(
            { username: username },
            { $inc: { serenity: amount }}
        );

    }

});