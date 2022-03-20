import storage from "../storage/Storage";
import {BASE_URL} from '../constants/Constants';
import CryptoJS from "react-native-crypto-js"
import {key} from "../constants/Constants";
import {iv} from "../constants/Constants"
import {GetUserId} from "./GetUserId";

export const login = (data, navigation, setModalVisible, modalVisible) =>{
    fetch(BASE_URL+"/login", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    })
        .then(response => response.json())
        .then((data) => {
            console.log(data)
            if(data.username === "error")
                alert('用户名或密码错误')
            else {
                storage.save({
                        key: 'token',
                        data: {
                            token: data.token
                        }
                    }
                )
                    .catch(error=>console.log(error))
                GetUserId(data.username, setModalVisible)
            }
        })
        .catch(err=>console.log(err));

}
