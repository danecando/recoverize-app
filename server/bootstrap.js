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
//
//
//    }
//});