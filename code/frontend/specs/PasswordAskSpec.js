export default function (spec){
    spec.describe('Ask for Password', function (){
        spec.it('process', async  function (){
            await spec.press('Tab.User')
            await spec.press('Tab.User.UserInfo')
            await spec.press('PasswordAsk')
            await spec.fillIn('PasswordAsk.Username', "ren")
            await spec.fillIn('PasswordAsk.E_mail', "1191602443@qq.com")
            await spec.fillIn('PasswordAsk.Password', "Hy!1234")
            await spec.fillIn('PasswordAsk.Password2', "Hy!1234")
            await spec.press('PasswordAsk.getSms')
            await spec.pause(15000)
            await spec.press('PasswordAsk.confirm')
            await spec.fillIn("Login.Username", "ren")
            await spec.fillIn("Login.Password", "Hy!1234")
            await spec.press('Login.confirm')
            await spec.pause(1000)
            await spec.notExists("UserInfo.LoginModal")
        })
    })
}
