import storage from '../src/storage/Storage';

export default function (spec){
    spec.describe('UserInfo', function (){
        storage.load({key:"userId"})
            .then(() => {
                spec.it('LOGIN', async  function () {
                    await spec.press('Tab.User')
                    await spec.press('Tab.User.UserInfo')
                    await spec.notExists('UserInfo.LoginModal')
                })
            })
            .catch(
                spec.it('NOT LOGIN', async  function () {
                    await spec.press('Tab.User')
                    await spec.press('Tab.User.UserInfo')
                    await spec.exists('UserInfo.LoginModal')
                })
            )
    })
}
