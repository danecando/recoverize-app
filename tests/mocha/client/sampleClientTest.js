
if (!(typeof MochaWeb === 'undefined')){

    MochaWeb.testOnly(function(){
        describe('2 + 2', function(){
            it('should be 4', function(){
                chai.assert(2+2, 4)
            })
        })
    })

}
