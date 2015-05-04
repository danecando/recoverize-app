MessageBuckets = new Mongo.Collection('messagebuckets');
MessageSessions = new Mongo.Collection('messagesessions');

/**
 * returns the sessions that `userId` is involved in
 *
 * @param {String#MongoId}
 * @return {Object#MongoCursor|Array}
 */
MessageSessions.myMessages = function(userId) {
    var user = Meteor.users.findOne(userId);
    if (user) {
        return MessageSessions.find({members: user.username});
    } else {
        return [];
    }
};

/**
 * returns bucket(s) between `userId` and `username`
 * `page` defaults to the lastest bucket of messages
 * if `page` is specified it will return bucket(s) from `page` to last available
 *
 * @param {String#MongoId}
 * @param {String}
 * @param {Number}
 * @returns {Object#MongoCursor|Array}
 */
MessageBuckets.myMessagesWith = function(userId, username, page) {
    var user = Meteor.users.findOne(userId);
    if (user) {
        page = typeof page === 'number' ? page : getLastPage(user.username, username);
        return MessageBuckets.find({$and: [{members: username}, {members: user.username}], page: {$gte: page}});
    } else {
        return [];
    }
};

/**
 * get the last page of messsages `username1` and `username2` are involved in
 *
 * @param {String}
 * @param {String}
 * @return {Number}
 */
function getLastPage(username1, username2) {
    if (!username1||!username2) {
        return 0;
    }

    var session = MessageSessions.findOne({$and: [{members: username1}, {members: username2}]});
    if (session) {
        return ~~(session.messageCount/50);
    } else {
        return 0;
    }
};
