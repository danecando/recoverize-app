Template.newStatus.created = function() {
    this.charsLeft = new ReactiveVar(255);
};

Template.newStatus.rendered = function() {
    var chars = $('#newStatus').val().length;
    $('#charsLeft').css({ color: 'rgb(' + chars + ',20,20)' });
    this.charsLeft.set(255 - chars);
};

Template.newStatus.destroyed = function() {
    Session.set('statusReply', null);
};

Template.newStatus.helpers({
    replyData: function() {
        var reply = Session.get('statusReply');

        if (reply) {
            return reply;
        } else {
            return false;
        }
    },
    charsLeft: function() {
        return Template.instance().charsLeft.get();
    },
    status: function() {
        return Status.find({username: Meteor.user().username}, {sort: {timestamp: -1}, limit: 1});
    }
});

Template.newStatus.events({
    'keypress #newStatus': function(e, template) {
        var status = e.target.value;
        if(e.which == 13 && isValidStatus(status)){
            e.preventDefault();
            submitStatus(e, template);
        }
    },
    'submit .share-form form': function(e, template) {
        e.preventDefault();
        submitStatus(e, template);
    },
    'change #newStatus, keypress #newStatus, keyup #newStatus, keydown #newStatus': function(e, template) {
        var chars = $(e.target).val().length;
        $('#charsLeft').css({ color: 'rgb(' + chars + ',20,20)' });
        template.charsLeft.set(255 - chars);
    },
    'click #getImage': function(e, template) {
        e.preventDefault();
        $('#statusImage').focus().trigger('click');
    },
    'change #statusImage': function(e, template) {
        $('.add-image').fadeOut(100, function() {
            $('.remove-image').fadeIn(100);
            $('.file-name').text(e.target.value.replace(/^.*[\\\/]/, ''));
        });
    },
    'click #removeImage': function(e, template) {
        e.preventDefault();
        $('#statusImage').val('');
        $('.remove-image').fadeOut(100, function() {
            $('.add-image').fadeIn(100);
        });
    }
});

function isValidStatus(str) {
    return str.trim() !== '' && str.length < 255;
}

function submitStatus(e, template) {
    var share = Object.create(null);
    share.status = $('#newStatus').val();
    share.image = template.$('#statusImage')[0].files[0] || null;

    if(isValidStatus(share.status) || share.image) {
        if (!Meteor.isCordova && share.image) {

            internals.statusPhotoUpload(share.image, function(error, result) {
                if (error) {
                    $('.share-input').css('border-color', 'red');
                    $('.response').text(error);
                    return;
                }

                share.image = Meteor.user().username + '/' + share.image.name;

                Meteor.call('createStatus', share, function(error, result) {
                    $('#newStatus, #statusImage').val('');
                    $("#page").animate({ scrollTop: $(document).height() }, 200);
                    $('.remove-image').fadeOut(100, function() {
                        $('.add-image').fadeIn(100);
                    });
                });
            });

        } else {
            Meteor.call('createStatus', share, function(error, result) {
                $('#newStatus, #statusImage').val('');
                $("#page").animate({ scrollTop: $(document).height() }, 200);
                $('.remove-image').fadeOut(100, function() {
                    $('.add-image').fadeIn(100);
                });
            });
        }
    }
}