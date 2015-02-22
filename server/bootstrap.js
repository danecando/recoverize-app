// intialize app stuff maybe or smth
//
//var fs = Npm.require('fs');
//
//
//Meteor.startup(function () {
//
//
//
//    if (Readings.find().count() === 0) {
//        var newjft = Npm.require(process.env.PWD + '/server/books/newjft.json');
//
//        newjft.forEach(function(page) {
//            var dadate = new Date(page.date);
//            var dateKey = (dadate.getMonth()+1) + '-' + dadate.getDate();
//
//            Readings.insert({
//               date: dadate,
//                dateKey: dateKey,
//                justForToday: {
//                    date: dadate,
//                    title: page.title,
//                    content: page.content
//                }
//            }, function(err) {
//                if(err) console.error(err)
//            });
//
//        });
//

//var readings = Readings.find().fetch();
//
//readings.forEach(function(reading, index) {
//
//    if (reading.justForToday.title) {
//        var title = reading.justForToday.title;
//        title = title.replace(/&quot;/gi, "\"").replace(/&apos;/gi, "'").replace(/&#xFFFD;/gi, "");
//    }
//
//    if (reading.justForToday.content) {
//        var content = reading.justForToday.content;
//        content = content.replace(/&quot;/gi, "\"").replace(/&apos;/gi, "'").replace(/&#xFFFD;/gi, "");
//    }
//
//    Readings.update(
//        { dateKey: reading.dateKey },
//        { $set: { "justForToday.title": title, "justForToday.content": content } }
//    );
//
//
//});
//
//
//    }
//});