import {BASE_URL} from "../constants/Constants";
import {postByBody} from "../utils/Ajax";

export const PasswordModify = (data, navigation) => {
    if(data.password === "" || data.Sms === ""){
        alert("请完善您的信息")
    }

    console.log(data.Sms)
    const url = BASE_URL + "/PasswordModify"

    const callback = data =>{
        if(data === 0){
            alert("验证码错误")
        }
        if(data === 1){
            alert("验证码已过期")
        }
        if(data === 2){
            console.log("passwordModify success")
            navigation.goBack()
        }
    }

    postByBody(url, data, callback)
}

export const PasswordAsk = (data, setAsk) => {
    if(data.username === "" || data.password === "" || data.Sms === "" || data.e_mail === ""){
        alert("请完善您的信息")
    }

    const url = BASE_URL + "/PasswordAsk"

    const callback = data =>{
        if(data === 0){
            alert("验证码错误")
        }
        if(data === 1){
            alert("验证码已过期")
        }
        if(data === 2){
            console.log("修改成功")
            setAsk(false)
        }
    }

    postByBody(url, data, callback)
}
