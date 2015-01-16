DailyReadings = {}

if (Meteor.isClient) {
    DailyReadings.getBooks = function() {
        console.log(DailyReadings.JFT)
        return DailyReadings.JFT
    }
}

/**
 * Server code
 */
if (Meteor.isServer) {

    Meteor.startup(function() {
        DailyReadings.JFT = Meteor.call('loadReading', 'jft.json', new Date())
    })

    Meteor.methods({
        loadReading: function(book, date) {

            var fs = Npm.require('fs')
            var bookPath = process.env.PWD + '/server/books/'

            var dateString = ((date.getMonth()+1) + "-" + date.getDay())

            var book = JSON.parse(fs.readFileSync(bookPath + book))
            DailyReadings.JFT = book[dateString]
        }
    })

}