Template.statusp.created = function() {
    var userSub = Meteor.subscribe('statusUser', this.data.username)
}

Template.statusp.helpers({
    isShared: function() {
        if (this.type == 'shared') return true
        else return false
    },
    currentUserSerenityList: function(statusId){
        var status = Status.findOne(statusId)
        if(status && status.serenityList){
            return status.serenityList.indexOf(Meteor.user().username) !== -1
        }else{
            return false
        }
    },
    currentUserShareList: function(statusId) {
        var status = Status.findOne(statusId)

        if (this.username == Meteor.user().username)
            return true

        if (status && status.shareList){
            return status.shareList.indexOf(Meteor.user().username) !== -1
        } else {
            return false
        }
    },
    currentUser: function() {
        return Meteor.users.findOne({username: this.username})
    }
})

Template.statusp.events({
    'click .serenityUpBtn': function(e){
        e.preventDefault()
        var statusId = $(e.target).parent().attr('data-statusId')
        Meteor.call('statusSerenityUp', statusId)
    },
    'click .serenityDownBtn': function(e){
        e.preventDefault()
        var statusId = $(e.target).parent().attr('data-statusId')
        Meteor.call('statusSerenityDown', statusId)
    },
    'click .shareStatus': function(e) {
        e.preventDefault()
        var statusId = $(e.target).parent().attr('data-statusId')
        console.log('clicked')
        Meteor.call('shareStatus', statusId)
    }
})
