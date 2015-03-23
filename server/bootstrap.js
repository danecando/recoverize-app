/**
 * Used for manually working on data in the database
 */

Push.debug = true;

//var allreadings = Npm.require(process.env.PWD + '/server/reading.json');
//
//allreadings.forEach(function(page) {
//    var docobj = {};
//
//    var timestamp = new Date(page.date);
//
//    if (typeof page['dailyReflections'] === 'object' && page['dailyReflections'].date) {
//        docobj.dailyReflections = {};
//        docobj['dailyReflections'].date = new Date(page['dailyReflections'].date);
//        docobj['dailyReflections'].title = page['dailyReflections'].title || '';
//        docobj['dailyReflections'].content = page['dailyReflections'].content;
//
//
//    }
//
//    if (typeof page['twentyFourHours'] === 'object' && page['twentyFourHours'].date) {
//        docobj.twentyFourHours = {};
//        docobj.twentyFourHours.date = timestamp;
//        docobj.twentyFourHours.title = page.twentyFourHours.title || '';
//        docobj.twentyFourHours.content = page.twentyFourHours.content;
//        //console.log(docobj.twentyFourHours.content);
//
//        var content = page['twentyFourHours'].content;
//        //console.log(content);
//
//        //Readings.update({ dateKey: page.dateKey }, {$set: { twentyFourHours: docobj['twentyFourHours'] }}, function(err) {
//        //    console.log(err);
//        //});
//
//    }
//
//    if (typeof page['asBillSeesIt'] === 'object' && page['asBillSeesIt'].date) {
//        docobj.asBillSeesIt = {};
//        docobj['asBillSeesIt'].date = new Date(page['asBillSeesIt'].date);
//        docobj['asBillSeesIt'].title = page['asBillSeesIt'].title || '';
//        docobj['asBillSeesIt'].content = page['asBillSeesIt'].content;
//
//        //Readings.update({ dateKey: page.dateKey }, {$set: { asBillSeesIt: docobj['asBillSeesIt'] }}, function(err) {
//        //    console.log(err);
//        //});
//    }
//
//    if (typeof page['walkInDryPlaces'] === 'object' && page['walkInDryPlaces'].date) {
//        docobj.walkInDryPlaces = {};
//        docobj['walkInDryPlaces'].date = new Date(page['walkInDryPlaces'].date);
//        docobj['walkInDryPlaces'].title = page['walkInDryPlaces'].title || '';
//        docobj['walkInDryPlaces'].content = page['walkInDryPlaces'].content;
//
//        //Readings.update({ dateKey: page.dateKey }, {$set: { walkInDryPlaces: docobj['walkInDryPlaces'] }}, function(err) {
//        //    console.log(err);
//        //});
//    }
//
//    if (typeof page['keepItSimple'] === 'object' && page['keepItSimple'].date) {
//        docobj.keepItSimple = {};
//        docobj['keepItSimple'].date = new Date(page['keepItSimple'].date);
//        docobj['keepItSimple'].title = page['keepItSimple'].title || '';
//        docobj['keepItSimple'].content = page['keepItSimple'].content;
//
//        //Readings.update({ dateKey: page.dateKey }, {$set: { keepItSimple: docobj['keepItSimple'] }}, function(err) {
//        //    console.log(err);
//        //});
//    }
//
//    if (typeof page['newBeginning'] === 'object' && page['newBeginning'].date) {
//        docobj.newBeginning = {};
//        docobj['newBeginning'].date = new Date(page['newBeginning'].date);
//        docobj['newBeginning'].title = page['newBeginning'].title || '';
//        docobj['newBeginning'].content = page['newBeginning'].content;
//
//        //Readings.update({ dateKey: page.dateKey }, {$set: { newBeginning: docobj['newBeginning'] }}, function(err) {
//        //    console.log(err);
//        //});
//    }
//
//    if (typeof page['bigBook'] === 'object' && page['bigBook'].date) {
//        docobj.bigBook = {};
//        docobj['bigBook'].date = new Date(page['bigBook'].date);
//        docobj['bigBook'].title = page['bigBook'].title || '';
//        docobj['bigBook'].content = page['bigBook'].content;
//
//        //Readings.update({ dateKey: page.dateKey }, {$set: { bigBook: docobj['bigBook'] }}, function(err) {
//        //    console.log(err);
//        //});
//    }
//
//    if (typeof page['twelveAndTwelve'] === 'object' && page['twelveAndTwelve'].date) {
//        docobj.twelveAndTwelve = {};
//        docobj['twelveAndTwelve'].date = new Date(page['twelveAndTwelve'].date);
//        docobj['twelveAndTwelve'].title = page['twelveAndTwelve'].title || '';
//        docobj['twelveAndTwelve'].content = page['twelveAndTwelve'].content;
//
//        //Readings.update({ dateKey: page.dateKey }, {$set: { twelveAndTwelve: docobj['twelveAndTwelve'] }}, function(err) {
//        //    console.log(err);
//        //});
//    }
//
//    if (typeof page['fatherLeos'] === 'object' && page['fatherLeos'].date) {
//        docobj.fatherLeos = {};
//        docobj['fatherLeos'].date = new Date(page['fatherLeos'].date);
//        docobj['fatherLeos'].title = page['fatherLeos'].title || '';
//        docobj['fatherLeos'].content = page['fatherLeos'].content;
//
//        //Readings.update({ dateKey: page.dateKey }, {$set: { fatherLeos: docobj['fatherLeos'] }}, function(err) {
//        //    console.log(err);
//        //});
//    }
//
//    if (typeof page['dailyInspiration'] === 'object' && page['dailyInspiration'].date) {
//        docobj.dailyInspiration = {};
//        docobj['dailyInspiration'].date = new Date(page['dailyInspiration'].date);
//        docobj['dailyInspiration'].title = page['dailyInspiration'].title || '';
//        docobj['dailyInspiration'].content = page['dailyInspiration'].content;
//
//        //Readings.update({ dateKey: page.dateKey }, {$set: { dailyInspiration: docobj['dailyInspiration'] }}, function(err) {
//        //    console.log(err);
//        //});
//    }
//
//    if (typeof page['dayAtATime'] === 'object' && page['dayAtATime'].date) {
//        docobj.dayAtATime = {};
//        docobj['dayAtATime'].date = new Date(page['dayAtATime'].date);
//        docobj['dayAtATime'].title = page['dayAtATime'].title || '';
//        docobj['dayAtATime'].content = page['dayAtATime'].content;
//
//        //Readings.update({ dateKey: page.dateKey }, {$set: { dayAtATime: docobj['dayAtATime'] }}, function(err) {
//        //    console.log(err);
//        //});
//    }
//
//    if (typeof page['journeyToTheHeart'] === 'object' && page['journeyToTheHeart'].date) {
//        docobj.journeyToTheHeart = {};
//        docobj['journeyToTheHeart'].date = new Date(page['journeyToTheHeart'].date);
//        docobj['journeyToTheHeart'].title = page['journeyToTheHeart'].title || '';
//        docobj['journeyToTheHeart'].content = page['journeyToTheHeart'].content;
//
//        //Readings.update({ dateKey: page.dateKey }, {$set: { journeyToTheHeart: docobj['journeyToTheHeart'] }}, function(err) {
//        //    console.log(err);
//        //});
//    }
//
//    if (typeof page['todaysGift'] === 'object' && page['todaysGift'].date) {
//        docobj.todaysGift = {};
//        docobj['todaysGift'].date = new Date(page['todaysGift'].date);
//        docobj['todaysGift'].title = page['todaysGift'].title || '';
//        docobj['todaysGift'].content = page['todaysGift'].content;
//
//        //Readings.update({ dateKey: page.dateKey }, {$set: { todaysGift: docobj['todaysGift'] }}, function(err) {
//        //    console.log(err);
//        //});
//    }
//
//    if (typeof page['languageOfLettingGo'] === 'object' && page['languageOfLettingGo'].date) {
//        docobj.languageOfLettingGo = {};
//        docobj['languageOfLettingGo'].date = new Date(page['languageOfLettingGo'].date);
//        docobj['languageOfLettingGo'].title = page['languageOfLettingGo'].title || '';
//        docobj['languageOfLettingGo'].content = page['languageOfLettingGo'].content;
//
//        //Readings.update({ dateKey: page.dateKey }, {$set: { languageOfLettingGo: docobj['languageOfLettingGo'] }}, function(err) {
//        //    console.log(err);
//        //});
//    }
//
//    //console.log(docobj);
//
//    //Readings.upsert({ dateKey: page.dateKey }, {$set: docobj}, function(err) {
//    //    console.log(err);
//    //});
//
//});


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