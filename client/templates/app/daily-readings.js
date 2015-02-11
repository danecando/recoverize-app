Template.dailyReadings.helpers({
    justForToday: function() {
        var date = new Date()
        var dateString = (date.getMonth()+1) + '-' + date.getDay()
        return JustForToday.find({ date: dateString })
    }
})