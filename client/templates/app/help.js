
Template.help.helpers({

})

Template.help.events({
    'click .get-help': function(e, template) {
        e.preventDefault()

        $('#page').animate({
            scrollTop: $('#get-help').offset().top
        }, 500)
    }
})