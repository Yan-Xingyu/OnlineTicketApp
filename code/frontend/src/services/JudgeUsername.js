import {BASE_URL} from '../constants/Constants';
import {postByBody, postByParam} from "../utils/Ajax";
export const JudgeUsername = (data, setNameDup, setNameEmpty) =>{
    if(data.username === ""){
        setNameEmpty(true)
        return
    }
    setNameEmpty(false)

    const url = BASE_URL+"/JudgeUsername"

    const callback = data1 =>{
        if(data1 === 0)
            setNameDup(false)
        else
            setNameDup(true)
    }

    postByParam(url, {username: data.username}, callback)
}

export const JudgeE_mail = (data, setE_maiDup) => {
    const url = BASE_URL+"/JudgeE_mail"

    const callback = data =>{
        if(data === 0)
            setE_maiDup(false)
        else
            setE_maiDup(true)
    }

    postByBody(url, data, callback)
}
