
Template.test.helpers({
    test: function() {
        return Test.find();
    }
});

Template.test.events({

    'click .add-test': function(event) {
        event.preventDefault();

        var text = $('.insertion').val();

        $('.insertion').val('');

        Test.insert({name: text})

    }
})


//if (Meteor.user()) {
//    console.log(Meteor.user());
//}
