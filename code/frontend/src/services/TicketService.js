import {BASE_URL} from '../constants/Constants';
import {postByParam, postByBody, postByParamAndBody} from '../utils/Ajax';

export const getTicketsOneWay = (start, end, date) => {
    const url = BASE_URL + '/getTickets'

    const callback = data => console.log(data)

    postByParamAndBody(url, {start: start, end: end, date: date}, {start: start, end: end, date: date}, callback)
}


export const getTrainInfoByTag = (dateStamp, trainTag, callback) => {
    const url = BASE_URL + '/trainNoSearch'
    postByParam(url, {dateStamp: dateStamp, trainTag: trainTag}, callback)
}

export const getTicketsOneWayCallBack = (start, end, date,callback,option) => {
    const url = (option===1)?(BASE_URL + '/PtoPSearch'):BASE_URL + '/PtoPSearchChangeTicket'

    postByBody(url, {start: start, end: end, datetime: date},  callback)
}

export const getTicketsPassByOneWayCallBack = (start, end, date,callback) => {
    const url = BASE_URL + '/PassBySearch'

    postByBody(url, {start: start, end: end, datetime: date},  callback)
}

export const getStationNameCallBack = (start, end, callback) => {
    const url = BASE_URL + '/searchStation'

    postByBody(url, {start: start, end: end},  callback)
}
export const getTicketInfo =(trainId,start_no,end_no,callback)=>{
    const url = BASE_URL + '/getTicketInfo'
    // console.log(1)
    postByBody(url, {start_no: start_no, end_no: end_no,train_id:trainId}, callback)
}
export const getTicketInfoTwice =(trainId,start_no,end_no,secondTrain_id,secondStart_no,secondEnd_no,callback)=>{
    const url = BASE_URL + '/getTicketInfoTwice'
    // console.log(1)
    postByBody(url, {first_start_no: start_no, first_end_no: end_no,first_train_id:trainId,second_start_no:secondStart_no,second_end_no:secondEnd_no,second_train_id:secondTrain_id}, callback)
}

export const purchase = (user_id, train_id, start_no, end_no, passenger_type, callback) => {
    const url = BASE_URL + '/commitOrder'
    postByBody(url, {user_id: user_id, train_id: train_id, start_no: start_no, end_no: end_no, passenger_type: passenger_type}, callback)
}

export const purchaseTwice = (user_id, firstTrainId, firstStartNo, firstEndNo, secondTrainId, secondStartNo, secondEndNo, passenger_type, callback) => {
    const url = BASE_URL + "/commitOrderTwice"
    postByBody(url, {
        first_order: {user_id: user_id, train_id: firstTrainId, start_no: firstStartNo, end_no: firstEndNo, passenger_type: passenger_type.first_order},
        second_order: {user_id: user_id, train_id: secondTrainId, start_no: secondStartNo, end_no: secondEndNo, passenger_type: passenger_type.second_order}}, callback)
}

export const changeTicket = (user_id, train_id, start_no, end_no, passenger_type,orderId,callback) => {
    const url = BASE_URL + '/modifyOrder'
    postByBody(url, {user_id: user_id, train_id: train_id, start_no: start_no, end_no: end_no, passenger_type: passenger_type,order_id:orderId}, callback)
}

export const getStationNameCallBackChange = (start, end, callback) => {
    const url = BASE_URL + '/searchStationWhenChange'

    postByBody(url, {start: start, end: end},  callback)
}
