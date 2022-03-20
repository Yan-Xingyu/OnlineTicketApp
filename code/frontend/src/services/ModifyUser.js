import {BASE_URL} from '../constants/Constants';
import {postByParamAndBody} from "../utils/Ajax";
export const modify = (id, data, modified, setModified) =>{
    console.log(data)
    if(data.nameDup === true)
    {
        alert("用户名已存在")
        return
    }
    if(data.emailJudge === true)
    {
        alert("邮箱格式不正确")
        return
    }
    if(data.username === "" || data.e_mail === "" || data.tourist_type === null)
    {
        alert("信息不全")
        return
    }
    const url = BASE_URL+"/Modify"

    const callback = data1 => {
        let tmp = !modified
        setModified(tmp)
    }

    postByParamAndBody(url, {id: id}, data, callback)
}
