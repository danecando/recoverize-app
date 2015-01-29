Template.newStatus.created = function() {
    this.charsLeft = new ReactiveVar(255)
}
Template.newStatus.rendered = function() {
    var chars = $('#newStatus').val().length
    $('#charsLeft').css({ color: 'rgb(' + chars + ',20,20)' })
    this.charsLeft.set(255 - chars)
}

Template.newStatus.destroyed = function() {
  Session.set('statusReply', null)
}

Template.newStatus.helpers({
    replyData: function() {
        var reply = Session.get('statusReply')
        if (reply) return reply
        else return false
    },
    charsLeft: function() {
        return Template.instance().charsLeft.get()
    },
    status: function() {
        return Status.find({}, {sort: {timestamp: -1}, limit: 1})
    }
})

Template.newStatus.events({
    'keypress #newStatus': function(e) {
        var status = e.target.value
        if(e.which == 13 && isValidStatus(status)){
            e.preventDefault()
            Meteor.call('createStatus', status)
            e.target.value = ''
            $("#page").animate({ scrollTop: $(document).height() }, 200);
        }
    },
    'submit .share-form form': function(e) {
        e.preventDefault()
        var status = $('#newStatus').val()
        if(isValidStatus(status)){
            Meteor.call('createStatus', status)
            $('#newStatus').val('')
            $("#page").animate({ scrollTop: $(document).height() }, 200);
        }
    },
    'change #newStatus, keypress #newStatus, keyup #newStatus, keydown #newStatus': function(e, template) {
        var chars = $(e.target).val().length
        $('#charsLeft').css({ color: 'rgb(' + chars + ',20,20)' })
        template.charsLeft.set(255 - chars)
    }
})

function isValidStatus(str){
    return str.trim() !== ''
        && str.length < 255
}