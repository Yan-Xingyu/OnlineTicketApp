import {BASE_URL} from '../constants/Constants';
import {postByBody, postByParam} from "../utils/Ajax";
export const PassengerGet = (user_id, setPassengers, params, setChecked) =>{
    const url = BASE_URL+"/PassengerGet"

    const callback = data => {
        console.log("get success")
        let checked = []
        setPassengers(data)
        data.map((row,rowidx)=>{
            if(params.passengerList !== undefined)
                params.passengerList.map((row1,rowidx1)=>{
                    if(row.id === row1.id)
                        checked.push(true)
                })
            if(checked.length === rowidx)
                checked.push(false)
        })
        setChecked(checked)
        console.log("data:" + data)
        console.log(checked)
    }

    postByParam(url, {userId: user_id}, callback)
}

export const  getOrderPassengers =(passengers,callback)=>{
    const url=  BASE_URL+'/PassengerGetByPid';
    postByBody(url,{passenger_id:passengers},callback)
}
