
Template.user.helpers({
    user: function(){
        return Meteor.users.findOne({username: this.username})
    }
})
