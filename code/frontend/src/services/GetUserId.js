import {BASE_URL} from '../constants/Constants';
import storage from "../storage/Storage";
import {postByParam} from "../utils/Ajax";

export const GetUserId = (username, setModalVisible) =>{
    const url = BASE_URL + '/GetUserId'

    const callback = data => {
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
                setModalVisible(false)
            })
    }

    postByParam(url, {username: username}, callback)
}
