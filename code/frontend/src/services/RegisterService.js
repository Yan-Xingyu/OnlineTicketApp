import {BASE_URL} from '../constants/Constants';
import {postByBody} from "../utils/Ajax";
import storage from "../storage/Storage";
import CryptoJS from "react-native-crypto-js"
import {key} from "../constants/Constants";
import {iv} from "../constants/Constants"

export const register = (data, navigation, setRegister) =>{
    if(data.nameDup === true)
    {
        alert("用户名已存在")
        return
    }
    if(data.passwordJudge === true)
    {
        alert("两次密码输入不一致")
        return
    }
    if(data.emailJudge === true)
    {
        alert("邮箱格式不正确")
        return
    }
    if(data.username === "" || data.password === "" || data.real_name === "" ||
       data.card_id === "" || data.tel_number === "" || data.e_mail === "" || data.tourist_type === undefined)
    {
        alert("信息不全")
        return
    }
    // data.password = CryptoJS.AES.encrypt(data.password ,key,{
    //     iv:iv,
    //     mode: CryptoJS.mode.CBC,
    //     padding: CryptoJS.pad.Pkcs7
    // }).ciphertext.toString()
    // console.log(data.password)

    const url=BASE_URL+"/Register";
    const callback=(data) => {
        storage.save({
                key: 'telNumber',
                data:{
                    telNumber: data.tel_number
                }
            }
        )
        storage.save({
            key: 'userId',
            data: {
                userid: data.id
            },
        })
            .then(ret=>{
                setRegister(false)
            })
    }
    postByBody(url,data,callback)
}
