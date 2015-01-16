DailyReadings = {}

/**
 * Server code
 */
if (Meteor.isServer) {
    DailyReadings.loadReading = function(book, date) {

        var fs = Npm.require('fs')
        var bookPath = process.env.PWD + '/server/books/'

        var dateString = ((date.getMonth()+1) + "-" + date.getDay())
        console.log(dateString)


        return fs.readFileSync(bookPath + book)
    }
}