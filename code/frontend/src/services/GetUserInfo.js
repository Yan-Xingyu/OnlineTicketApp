
import {BASE_URL} from '../constants/Constants';
import {postByParam} from "../utils/Ajax";
export const GetUserInfo = (id, setTel_number, setCard_id, setUsername, setMail, setName, setType) =>{
    const url = BASE_URL + '/getUser'

    const callback = data => {
        setUsername(data.username)
        setName(data.real_name)
        setCard_id(data.certificate_type)
        setTel_number(data.tel_number)
        setMail(data.email)
        setType(data.tourist_type)
    }

    postByParam(url, {id: id}, callback)
}
