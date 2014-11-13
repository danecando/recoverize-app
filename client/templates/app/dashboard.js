
Template.dashboard.helpers({
    posts: function() {
        return Meteor.users.find();
    }
});

Template.dashboard.events({

    'click .follow': function(event) {
        event.preventDefault();

        var username = $(event.target).parent('.user').attr('data-username');

        var followed = Follow.addFollow(username);

        if (followed) {
            $(event.target).removeClass('follow').addClass('unfollow').text('Unfollow');
        }



        //var test = Follow.findOne({ following: username });

        //console.log(test);
        //Follow.insert({ following: username, follower: Meteor.user().username } );
        //
        //Meteor.users.update({_id: Meteor.user()._id}, {$push: { followers: { followerID: 'testing' }}});

        //Meteor.users.update(Meteor.userId(), { $addToSet: { followers: { 'followerID': 'hi' } }});
    },

    'click .logout': function(event) {
        Meteor.logout();
    }
})


//if (Meteor.user()) {
//    console.log(Meteor.user());
//}
