
Template.newStatus.helpers({

})

Template.newStatus.events({
    'keypress .newStatus': function(e){
        if(e.which === 13 && isValidStatus(e.target.value)){
            Meteor.call('createStatus', e.target.value)
            e.target.value = ''
        }
    },
})

function isValidStatus(str){
    return str.trim() !== ''
        && str.length < 255
}