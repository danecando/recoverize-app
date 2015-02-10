
Template.help.helpers({

})

Template.help.events({
    'click .get-help': function(e, template) {
        e.preventDefault()

        var fromTop = ($(window).width() > 768) ? 0 : 43

        $('#page').animate({
            scrollTop: $('#get-help').offset().top - fromTop
        }, 500)
    },
    'click .submit-number button': function(e, template) {
        e.preventDefault()

        var number = $('#userPhone').val()
        Meteor.call('sendText', number)
    }
})