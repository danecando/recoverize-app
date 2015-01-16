
Template.statusp.helpers({
    currentUserSerenityList: function(statusId){
        var status = Status.findOne(statusId)
        if(status && status.serenityList){
            return status.serenityList.indexOf(Meteor.user().username) !== -1
        }else{
            return false
        }
    }
})

Template.statusp.events({
    'click .serenityUpBtn': function(e){
        var statusId = $(e.target).attr('data-statusId')
        Meteor.call('statusSerenityUp', statusId)
    },
    'click .serenityDownBtn': function(e){
        var statusId = $(e.target).attr('data-statusId')
        Meteor.call('statusSerenityDown', statusId)
    }
})
