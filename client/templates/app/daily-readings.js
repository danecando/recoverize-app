Template.dailyReadings.created = function() {

    this.currentReading = new ReactiveVar('justForToday');
}

Template.dailyReadings.helpers({
    currentReading: function() {
        var readings = Readings.findOne();
        return readings[Template.instance().currentReading.get()];
    },
    dateString: function() {
      return moment().format('MMMM Do');
    }
});

Template.dailyReadings.events({
    'change #readingSelect': function(e, template) {
        template.currentReading.set(e.target.value);
    }
})