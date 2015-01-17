
StatusSchema = new SimpleSchema({
    serenity: {
        type: Number,
        defaultValue: 0
    },
    serenityList: {
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
    }
})
