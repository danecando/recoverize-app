Template.dailyReadings.helpers({
    todaysReadings: function() {
        return Readings.findOne();
    }
});