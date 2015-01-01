
Template.userlist.helpers({
    listOfUsers: function(){
        return Meteor.users.find()
    }
})
