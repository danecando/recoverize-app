
if (!(typeof MochaWeb === 'undefined')){

    MochaWeb.testOnly(function(){

        var agent1 = getAgent('agent1')
        var agent2 = getAgent('agent2')

        describe('accounts', function(){
            it('create', function(done){
                Meteor.call('createAccount', agent1)
                Meteor.call('createAccount', agent2, done)
            })
            it('login', function(done){
                Meteor.loginWithPassword(agent1.email, agent1.password, function(err){
                    if(err) throw err
                    else{
                        chai.assert.equal(Meteor.user().username, agent1.username)
                        done()
                    }
                })
            })
            it('logout', function(done){
                Meteor.logout()

                // wait for logout...
                setTimeout(function(){
                    chai.assert.isNull(Meteor.user())
                    done()
                }, 100)
            })
        })

        describe('chat', function(){
            var message = getRandomString()

            it('should send a message', function(done){
                Meteor.loginWithPassword(agent1.email, agent1.password, function(){
                    Meteor.call('addChat', message)
                    chai.assert.equal(Chat.findOne({}, {sort: {timestamp: -1}}).message, message)
                    done()
                })
            })
            it('should be readable by other users', function(done){
                Meteor.loginWithPassword(agent2.email, agent2.password, function(){
                    chai.assert.equal(Chat.findOne({}, {sort: {timestamp: -1}}).message, message)
                    done()
                })
            })
        })

        describe('messages', function(){
            var message = getRandomString()

            it('agent1 sends a message to agent2', function(done){
                Meteor.loginWithPassword(agent1.email, agent1.password, function(){
                    Meteor.call('addMessage', message, agent2.username)
                    done()
                })
            })
            it('agent2 recieves the message', function(done){
                Meteor.loginWithPassword(agent2.email, agent2.password, function(){
                    Router.go('/messages')

                    // wait for subscription...
                    setTimeout(function(){
                        chai.assert.equal(1, MessageSessions.find().count())
                        done()
                    }, 100)
                })
            })
            it('agent2 sends a message back to agent 1', function(done){
                Meteor.call('addMessage', message, agent1.username)
                Router.go('/messages/'+agent1.username)

                setTimeout(function(){
                    chai.assert.equal(1, MessageBuckets.find().count())
                    chai.assert.equal(2, MessageBuckets.findOne().messages.length)
                    chai.assert.equal(message, MessageBuckets.findOne().messages[0].message)
                    chai.assert.equal(message, MessageBuckets.findOne().messages[1].message)
                    chai.assert.equal(agent1.username, MessageBuckets.findOne().messages[0].username)
                    done()
                }, 100)
            })
        })
    })
}

/**
 * Utils
 */
function getAgent(name){
    return {
        username: name+getRandomString().slice(4),
        password: getRandomString(),
        email: getRandomEmail(),
        roles: ['user']
    }
}
function getRandomString(){
    return Math.random().toString(36).substring(7)
}
function getRandomEmail(){
    return getRandomString() + '@' + getRandomString() + '.' + getRandomString()
}