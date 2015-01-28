
StatusSchema = new SimpleSchema({
    type: {
        type: String,
        defaultValue: 'original'
    },
    serenity: {
        type: Number,
        defaultValue: 0
    },
    shares: {
        type: Number,
        defaultValue: 0
    },
    serenityList: {
        type: [String],
        defaultValue: []
    },
    shareList: {
        type: [String],
        defaultValue: []
    },
    username: {
        type: String,
        label: 'username',
        index: 1
    },
    timestamp: {
        type: Number,
        label: 'timestamp'
    },
    status: {
        type: String,
        label: 'the status itself'
    },
    sharedId: {
        type: String,
        label: 'id of shared original',
        optional: true
    },
    sharedUser: {
        type: String,
        label: 'username of shared status',
        optional: true
    }
})

Status = new Mongo.Collection('status')
Status.attachSchema(StatusSchema)

Meteor.methods({
    createStatus: function(status){
        check(Meteor.userId(), String)
        check(status, String)

        Status.insert({
            status: status,
            username: Meteor.user().username,
            timestamp: Date.now()
        }, function(err, _id){

            if(!err){
                var matches = status.match(/\B@[a-z0-9_-]+/gi)
                if(matches) {
                    matches.forEach(function(username){
                        Notification.push({
                            username: username.slice(1),
                            type: 'status',
                            path: '/status/' + _id + '/',
                            from: Meteor.user().username
                        })
                    })
                }
            }

        })
    },
    statusSerenityUp: function(statusId){
        check(Meteor.userId(), String)
        check(statusId, String)

        var status = Status.findOne(statusId)
        if(!status) return

        var affected = Status.update(
            {_id: statusId, serenityList: {$ne: Meteor.user().username}},
            {$addToSet: {serenityList: Meteor.user().username}, $inc: {serenity: 1}}
        )

        if(affected){
            Meteor.users.update(
                {username: status.username},
                {$inc: {serenity: 1}}
            )
        }
    },
    statusSerenityDown: function(statusId){
        check(Meteor.userId(), String)
        check(statusId, String)

        var status = Status.findOne(statusId)
        if(!status) return

        var affected = Status.update(
            {_id: statusId, serenityList: Meteor.user().username},
            {$pull: {serenityList: Meteor.user().username}, $inc: {serenity: -1}}
        )

        if(affected){
            Meteor.users.update(
                {username: status.username},
                {$inc: {serenity: -1}}
            )
        }
    },
    shareStatus: function(statusId) {
        check(Meteor.userId(), String)
        check(statusId, String)

        var status = Status.findOne(statusId)
        if(!status) return

        var affected = Status.update(
            {_id: statusId, shareList: {$ne: Meteor.user().username}},
            {$addToSet: {shareList: Meteor.user().username}, $inc: {shares: 1}}
        )

        if (affected) {

            Status.insert({
                status: status.status,
                username: Meteor.user().username,
                timestamp: Date.now(),
                sharedId: statusId,
                sharedUser: status.username,
                type: 'shared'
            }, function(err, _id) {
                if (!err) {
                    Notification.push({
                        username: status.username,
                        type: 'status',
                        path: '/status/' + _id + '/',
                        from: Meteor.user().username
                    })
                }
            })

            Meteor.users.update(
                {username: status.username},
                {$inc: {serenity: 1}}
            )
        }
    }
})
