
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
        //autoValue resets on update??!
        //autoValue: Date.now
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
