import {Dimensions} from 'react-native';
import CryptoJS from "react-native-crypto-js"



// export const IP = '192.168.216.137'

// export const BASE_URL = 'https://' + IP + ':8080';

export const BASE_URL = "https://www.renhaotian.top:1000"

export const key = CryptoJS.enc.Hex.parse('3132333435363738393041424344454631323334353637383930414243444566')
export const iv = CryptoJS.enc.Hex.parse("30313233343536373839414243444546")

export const WINDOWS_WIDTH = Dimensions.get("window").width;
export const WINDOWS_HEIGHT = Dimensions.get("window").height;

export const OTA_COLOR = {
    themeColor:'rgba(37,119,227,1)',
    backgroundColor:'#f5f5f5',
    separatorColor:'#dcdcdc',
    touchableColor:'#DDDDDD',
    priceColor:'rgb(255,210,132)',
};

export const weeks = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']

export const buttonValues = [
    [{value: '1', label: '1'}, {value: '2', label: '2'},{value: '3', label: '3'},{value: 'G', label: 'G', fontColor: 'orange'},{value:'D', label: 'D', fontColor: 'orange'}],
    [{value: '4', label: '4'}, {value: '5', label: '5'},{value: '6', label: '6'},{value: 'C', label: 'C', fontColor: 'orange'},{value:'K', label: 'K', fontColor: 'orange'}],
    [{value: '7', label: '7'}, {value: '8', label: '8'},{value: '9', label: '9'},{value: 'T', label: 'T', fontColor: 'orange'},{label: 'cancel', icon: 'backspace-outline'}],
    [{value: 'S', label: 'S', fontColor: 'orange'}, {value: '0', label: '0'},{value: 'Y', label: 'Y', fontColor: 'orange'},{value: 'Z', label: 'Z', fontColor: 'orange'},{value:'确认', label: 'submit'}]
]
