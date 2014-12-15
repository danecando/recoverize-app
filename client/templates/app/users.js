
Template.user.helpers({
    user: function(){
        return Meteor.users.findOne({username: this.username})
    },
    isCurrentUser: function(){
        return this.username === Meteor.user().username
    },
    statusList: function(){
        return Status.find({username: this.username}, {sort: {timestamp: -1}})
    },
    currentUserSerenityList: function(statusId){
        return Status.findOne(statusId).serenityList.indexOf(Meteor.user().username) !== -1
    }
})

Template.user.events({
    'click .followBtn': function(){
        Meteor.call('follow', this.username)
    },
    'click .unfollowBtn': function(){
        Meteor.call('unfollow', this.username)
    },
    'keypress .newStatus': function(e){
        if(e.which === 13 && isValidStatus(e.target.value)){
            Meteor.call('createStatus', e.target.value)
            e.target.value = ''
        } 
    },
    'click .serenityUpBtn': function(e){
        var statusId = $(e.target).attr('data-statusId')
        Meteor.call('statusSerenityUp', statusId)
    },
    'click .serenityDownBtn': function(e){
        var statusId = $(e.target).attr('data-statusId')
        Meteor.call('statusSerenityDown', statusId)
    }
})

function isValidStatus(str){
    return str.trim() !== ''
        && str.length < 255
}