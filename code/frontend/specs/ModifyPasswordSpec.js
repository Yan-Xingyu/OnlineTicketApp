export default function (spec){
    spec.describe('Modify Password', function (){
        spec.it('process', async function (){
            await spec.press('Tab.User')
            await spec.press('User.ModifyPassword')
            await spec.fillIn('Modify.Password', "Hy!1234")
            await spec.fillIn('Modify.Password2', "Hy!1234")
            await spec.press('Modify.getSms')
            await spec.pause(10000)
            await spec.press('Modify.confirm')
            await spec.pause(10000)
            await spec.press('Modify.confirm')
        })
    })
}
