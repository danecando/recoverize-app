
if (!(typeof MochaWeb === 'undefined')){

    MochaWeb.testOnly(function(){

        var agent1 = getAgent()
        var agent2 = getAgent()

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

                setTimeout(function(){
                    chai.assert.isNull(Meteor.user())
                    done()
                }, 100)
            })
        })

        describe('chat', function(){
            var message = getRandomString()

            before(function(done){
                Meteor.loginWithPassword(agent1.email, agent1.password, done)
            })

            it('sends', function(done){
                Meteor.call('addChat', message)

                setTimeout(function(){
                    chai.assert.equal(Chat.findOne({}, {sort: {timestamp: -1}}).message, message)
                    done()
                }, 100)
            })
            it('recieved by other users', function(done){
                Meteor.loginWithPassword(agent2.email, agent2.password, function(){
                    chai.assert.equal(Chat.findOne({}, {sort: {timestamp: -1}}).message, message)
                    done()
                })
            })
        })
    })

}

/**
 * Utils
 */
function getAgent(){
    return {
        username: getRandomString(),
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