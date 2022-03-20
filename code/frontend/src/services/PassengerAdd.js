import {BASE_URL} from '../constants/Constants';
import {postByParamAndBody} from "../utils/Ajax";
export const PassengerAdd = (id, data, navigation, route) =>{
    if(data.username === "" || data.card_id === "" || data.tel_number === "" || data.type === null)
    {
        alert("信息不全")
        return
    }

    const url = BASE_URL+"/PassengerAdd"

    const callback = data1 => {
        console.log("debug: ", route.params)
        console.log('success')
        navigation.push("PassengerSelection", route.params)
    }

    postByParamAndBody(url, {id: id}, data, callback)
}

