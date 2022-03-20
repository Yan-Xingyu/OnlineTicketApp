import {InputItemInput} from './helpers';
import storage from '../src/storage/Storage';

export default function (spec){
    spec.describe('Login', function (){
        spec.it(' not successful caused by wrong password', async function () {
            await spec.press('Tab.User')
            await spec.press('Tab.User.UserInfo')
            const input1 = await spec.findComponent("Login.Username")
            InputItemInput(input1, "rht")
            await spec.pause(1000)
            const input2 = await spec.findComponent("Login.Password")
            InputItemInput(input2, "dwid")
            await spec.pause(1000)
            await spec.press('Login.confirm')
            await spec.pause(1000)
            await spec.exists("UserInfo.LoginModal")
        })
        spec.it(' not successful caused by wrong username', async function () {
            await spec.press('Tab.User')
            await spec.press('Tab.User.UserInfo')
            await spec.fillIn("Login.Username", "dwadw")
            await spec.fillIn("Login.Password",  "Rht!123")
            await spec.press('Login.confirm')
            await spec.pause(1000)
            await spec.exists("UserInfo.LoginModal")
        })
        spec.it(' successful', async function () {
            await spec.press('Tab.User')
            await spec.press('Tab.User.UserInfo')
            await spec.fillIn("Login.Username", "rht")
            await spec.fillIn("Login.Password", "Rht!123")
            await spec.press('Login.confirm')
            await spec.pause(1000)
            await spec.notExists("UserInfo.LoginModal")
        })
    })
}
