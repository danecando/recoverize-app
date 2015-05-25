Meteor.methods({

  getStatuses: function getStatuses(filter, sort, limit, skip) {
    filter = filter || {};
    sort = sort || {};
    limit = limit || 15;
    skip = skip || 0;

    var statuses = Status.find(filter, {
      sort: sort,
      limit: limit,
      skip: skip
    }).fetch();

    var count = Status.find(filter).count();

    return {
      statuses: statuses,
      statusCount: count
    };
  },

  createStatus: function(share) {
    check(Meteor.userId(), String);
    check(share, Object);
    check(share.status, String);

    share.username  = Meteor.user().username;
    share.timestamp = Date.now();

    Status.insert(share, function(err, _id){
      if (err) {
        return new Meteor.Error(500, "Couldn't create status");
      }

      if (share.status) {

        var matches = share.status.match(/\B@[a-z0-9_-]+/gi);
        if (matches) {
          matches.forEach(function(username) {
            var notification = {
              username: username.slice(1),
              type: 'status',
              path: '/status/' + _id + '/',
              from: Meteor.user().username
            };

            Meteor.call('sendNotification', notification);
          });
        }
      }
      return _id;
    });

    return true;
  },

  /**
   * Increase status serenity & user serenity count
   * @param statusId
   */
  statusSerenityUp: function statusSerenityUp(statusId) {
    var id = Utility.getUserId();
    check(id, String);
    check(statusId, String);

    Status.update({
      _id: statusId,
      serenityList: { $ne: Meteor.user().username }
    }, {
      $addToSet: { serenityList: Meteor.user().username },
      $inc: { serenity: 1 }
    }, function(err) {
      if (err) {
        throw new Meteor.Error(500, 'Failed to increase post serenity count');
      }
      Meteor.users.update({ username: status.username }, {
        $inc: { serenity: 1 }
      }, function() {
        // async
      });
    });
  },

  /**
   * Decrease status serenity & user serenity count
   * @param statusId
   */
  statusSerenityDown: function statusSerenityDown(statusId){
    var id = Utility.getUserId();
    check(id, String);
    check(statusId, String);

    Status.update({ _id: statusId, serenityList: Meteor.user().username }, {
      $pull: { serenityList: Meteor.user().username },
      $inc: { serenity: -1 }
    }, function(err) {
      if (err) {
        throw new Meteor.Error(500, 'Failed to decrease serenity count');
      }
      Meteor.users.update({ username: status.username }, {
        $inc: { serenity: -1 }
      }, function() {
        // async
      });
    });
  },

  shareStatus: function(statusId) {
    check(Meteor.userId(), String);
    check(statusId, String);

    var status = Status.findOne({ _id: statusId });
    if (!status) {
      return;
    }


    var affected = Status.update(
      {_id: statusId, shareList: {$ne: Meteor.user().username}},
      {$addToSet: {shareList: Meteor.user().username}, $inc: {shares: 1}}
    );

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

          var notification = {
            username: status.username,
            type: 'status',
            path: '/status/' + _id + '/',
            from: Meteor.user().username
          };

          Meteor.call('sendNotification', notification);
        }
      });

      Meteor.users.update(
        {username: status.username},
        {$inc: {serenity: 1}}
      );
    }
  },

  deleteStatus: function(statusId) {
    check(Meteor.userId(), String);
    check(statusId, String);

    Status.remove({ _id: statusId });
    return true;
  }

});