Template.statusp.created = function() {

    this.ready = new ReactiveVar(false)

    Meteor.startup(function() {
    var userSub = Meteor.subscribe('statusUser', this.username)

    if (userSub.ready()) {
        this.ready.set(true)
        console.log(Meteor.users.findOne({username: this.username }))
    }
    })
}

Template.statusp.helpers({
    currentUserSerenityList: function(statusId){
        var status = Status.findOne(statusId)
        if(status && status.serenityList){
            return status.serenityList.indexOf(Meteor.user().username) !== -1
        }else{
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
    }
})
