Template.profileUpdate.rendered = function() {
    //if (Meteor.user().profile.profilePic) {
    //    $('.no-picture').css('display', 'none')
    //} else {
    //    $('.picture-exists').css('display', 'none')
    //}

    var program = Meteor.user().profile.program
    if (program) {
        $('#program option').each(function() {
            if (program == $(this).val()) {
                $(this).attr('selected', true)
            }
        })
    }

    var gender = Meteor.user().profile.gender
    if (gender) {
        $('#gender option').each(function() {
            if (gender == $(this).val()) {
                $(this).attr('selected', true)
            }
        })
    }

    var soberDate = Meteor.user().profile.soberDate
    if (soberDate) {
        $('#sober-year option').each(function() {
            if (soberDate.getFullYear() == $(this).val()) {
                $(this).attr('selected', true)
            }
        })
        $('#sober-month option').each(function() {
            if (soberDate.getMonth() == $(this).val()-1) {
                $(this).attr('selected', true)
            }
        })
        $('#sober-day option').each(function() {
            if (soberDate.getDate() == $(this).val()) {
                $(this).attr('selected', true)
            }
        })
    }
}

Template.profileUpdate.created = function() {
    Session.setDefault('updated', false)
    Session.setDefault('days', 31)
}

Template.profileUpdate.destroyed = function() {
    Session.setDefault('updated', false)
}

/**
 * Helpers
 */
Template.profileUpdate.helpers({

    user: function() {
        return Meteor.user()
    },
    updated: function() {
        if (!Session.get('updated')) return 'disabled'
    },
    days: function() {
        var days = []

        for (var i = 1; i <= Session.get('days'); i++) {
            days.push(i)
        }

        return days;
    },
    years: function() {
        var today = new Date(),
            year = today.getFullYear(),
            years = []

        for (; year >= 1930; year--) {
            years.push(year)
        }

        return years
    }

});

/**
 * Events
 */
Template.profileUpdate.events({

    // enable save button if any fields have been updated
    'change :input': function(event, template) {
        Session.set('updated', true)
    },
    'click #image-select': function(event, template) {
        event.preventDefault()
        template.$('input[name=profilePic]').click()
    },
    'click input[name=profilePic]': function(event, template) {
        if (Meteor.isCordova) {
            window.imagePicker.getPictures(
                function (results) {
                    for (var i = 0; i < results.length; i++) {
                        if (typeof results[i] == 'string') {
                            var fileName = results[i].substring(results[i].lastIndexOf('/')+1)
                            var filePath = results[i].substring(0, results[i].lastIndexOf('/'))
                            window.resolveLocalFileSystemURL(filePath, function(dir) {
                                console.log(JSON.stringify(dir))
                                dir.getFile(fileName, {create: true, exclusive: false}, function(file) {

                                    template.$('[name=profilePic]')[0].files[0] = file
                                    Session.set('updated', true)
                                })
                            })
                        }
                    }
                }, function (error) {
                    console.log('Error: ' + error)
                }, {
                    maximumImagesCount: 1
                }
            )
        }
    },

    'click #save-changes': function(event, template) {
        event.preventDefault()

        // todo: load defaults create thingy if profile picture is already uploaded
        var file = template.$('[name=profilePic]')[0].files[0]
        console.log(JSON.stringify(file))
        if (file) {
            var fileUrl = 'https://d6gyptuog2clr.cloudfront.net/' + Meteor.user().username + '/' + file.name
            var uploader = new Slingshot.Upload("myFileUploads")
            uploader.send(file, function (error, downloadUrl) {
                if (error) template.$('.response').addClass('error').text(error)
                console.log(downloadUrl)
            })
        }

        var month = template.$('[name=soberMonth]').val()
        var day = template.$('[name=soberDay]').val()
        var year = template.$('[name=soberYear]').val()
        var soberDate = new Date(year, month-1, day)


        var user = {
            name: template.$('[name=name]').val(),
            profilePic: fileUrl,
            location: template.$('[name=location]').val(),
            gender: template.$('[name=gender]').val(),
            program: template.$('[name=program]').val(),
            homegroup: template.$('[name=homegroup]').val(),
            soberDate: soberDate,
            quote: template.$('[name=quote]').val()
        }

        Meteor.call('updateProfile', user, function(error, result) {
            if (error) template.$('.response').addClass('error').text(error)
            else template.$('.response').addClass('success').text("Your profile has been updated")

        })
    },

    'change #sober-month': function(event, template) {

        var month = template.$('#sober-month').val(),
            year = template.$('#sober-year').val(),
            days = new Date(year, month, 0).getDate()

        Session.set('days', days)
    },

    'change #sober-year': function(event, template) {

        var month = template.$('#sober-month').val(),
            year = template.$('#sober-year').val(),
            days = new Date(year, month, 0).getDate()

        Session.set('days', days)
    }

})