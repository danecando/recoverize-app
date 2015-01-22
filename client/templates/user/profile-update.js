Template.profileUpdate.rendered = function() {

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
    Session.setDefault('days', 31)

    this.profileUpdated = new ReactiveVar
    this.profileUpdated.set(false)

    this.cordovaFile = new ReactiveVar
    this.cordovaFile.set(false)
}

/**
 * Helpers
 */
Template.profileUpdate.helpers({
    cordova: function() {
        return !!Meteor.isCordova
    },
    user: function() {
        return Meteor.user()
    },
    profileUpdated: function() {
        return Template.instance().profileUpdated.get()
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

})

/**
 * Events
 */
Template.profileUpdate.events({
    'change :input, keypress :input': function(event, template) {
        template.profileUpdated.set(true)
    },
    'click #image-select': function(event, template) {
        event.preventDefault()
        template.$('input[name=profilePic]').click()
    },
    'click #cordova-upload': function(event, template) {
        window.imagePicker.getPictures(
            function (results) {
                for (var i = 0; i < results.length; i++) {
                    var file = {
                        type: results[i].split('.').pop(),
                        name: results[i].replace(/^.*[\\\/]/, ''),
                        uri: results[i]
                    }

                    template.cordovaFile.set(file)
                    Session.set('updated', true);
                    $('#cordova-upload').text(file.name)
                }
            }, function(error) {
                console.log(error)
            })
    },
    'click #save-changes': function(event, template) {
        event.preventDefault()

        // upload profile pic from cordova
        if (template.cordovaFile.get()) {
            var file = template.cordovaFile.get()
            window.resolveLocalFileSystemURL(file.uri, function(fileEntry) {
                fileEntry.file(function(fileObj) {
                    file.size = fileObj.size
                    AwsUpload.upload(file, function(path) {
                        var user = {}
                        user.profilePic = path
                        Meteor.call('updateProfile', user, function(error, result) {
                            if (error) template.$('.response').addClass('error').text(error)
                            else template.$('.response').addClass('success').text("Your profile has been updated")
                        })
                    })
                })
            })
        }

        // upload profile pic for web
        if (!Meteor.isCordova) {
            var file = template.$('[name=profilePic]')[0].files[0]

            if (file) {
                var uploader = new Slingshot.Upload("myFileUploads")
                uploader.send(file, function (error, downloadUrl) {
                    if (error) template.$('.response').addClass('error').text(error)

                    var user = {}
                    user.profilePic = Meteor.user().username + '/' + file.name
                    Meteor.call('updateProfile', user, function(error, result) {
                        if (error) template.$('.response').addClass('error').text(error)
                        else template.$('.response').addClass('success').text("Your profile has been updated")
                    })
                })
            }
        }

        var month = template.$('[name=soberMonth]').val()
        var day = template.$('[name=soberDay]').val()
        var year = template.$('[name=soberYear]').val()
        var soberDate = new Date(year, month-1, day)

        var user = {
            name: template.$('[name=name]').val(),
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