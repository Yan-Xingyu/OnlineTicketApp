import {BASE_URL} from '../constants/Constants';
import {postByBody} from "../utils/Ajax";

export const getSms = (id, setSms, setTime, setDisabled) => {
    const url = BASE_URL + "/getSms"

    console.log("modify:"+id)

    const callback = data => {
        if(data.code === "9999") {
            alert("验证码已经发送过了，请检查邮箱后再尝试")
            return
        }
        alert("验证码已经发到您的邮箱中，请查收")
        setTime(180)
        setDisabled(true)
        setSms(data.Sms)
    }

    postByBody(url, {id: id}, callback)
}

export const getSmsAsk = (body, setSms, setTime, setDisabled) => {
    const url = BASE_URL + "/getSmsAsk"

    const callback = data => {
        if(data.code === "9999") {
            alert("验证码已经发送过了，请检查邮箱后再尝试")
            return
        }
        if(data === 0)
            alert("邮箱未被注册过")
        if(data === 1)
            alert("用户不存在")
        if(data === 2)
            alert("填写的邮箱不是您的注册邮箱，请核实注册信息")
        if(data === 3) {
            alert("验证码已经发到您的邮箱中，请查收")
            setTime(180)
            setDisabled(true)
        }
    }

    postByBody(url, body, callback)
}
