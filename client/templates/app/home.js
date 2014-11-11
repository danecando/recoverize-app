
Template.home.helpers({
    posts: function() {
        return Meteor.users.find();
    }
});

Template.home.events({

    'click .follow': function(event) {
        event.preventDefault();
        console.log(Meteor.user());

        //console.log('clicked');

        Meteor.users.update({_id:Meteor.user()._id}, {$push: { followers: { followerID: 'testing' }}});

        //Meteor.users.update(Meteor.userId(), { $addToSet: { followers: { 'followerID': 'hi' } }});
    }
})


//if (Meteor.user()) {
//    console.log(Meteor.user());
//}
