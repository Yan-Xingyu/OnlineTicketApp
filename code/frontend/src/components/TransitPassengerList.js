import React, {useEffect, useImperativeHandle, useLayoutEffect, useState} from "react";
import {Icon, Flex, Card, List} from '@ant-design/react-native'
import { Text, View, TouchableHighlight} from "react-native";
import {RadioGroup} from "react-native-flexi-radio-button";
import {RadioButton} from "react-native-flexi-radio-button";
import {useRoute} from "@react-navigation/core";

import {getTicketsOneWayCallBack} from "../services/TicketService";
import {getOrderPassengers} from "../services/PassengerGet";

function deleteOne (id, list, setPassengerList){
    let tmp = []
    list.map((row, rowidx)=>{
        if(rowidx !== id){
            tmp.push(row)
        }
    })
    setPassengerList(tmp)
}

function renderList (list, setPassengerList, setData, data, trainType, firstSeatNum, secondSeatNum, judge, setJudge){
    let result = []
    let info1 = []
    let info2 = []
    list.map((row, rowidx) => {
            info1.push({passenger_id: row.id, seat_type: firstSeatNum})
            info2.push({passenger_id: row.id, seat_type: secondSeatNum})
            result.push(
                <List.Item>
                    <View style={{flexDirection: "row", marginTop: 5}}>
                        <View style={{width: '15%'}}>
                            <Text style={{fontSize: 15}}>{row.real_name}</Text>
                        </View>
                        <View style={{width: '55%'}}>
                            <Text style={{marginLeft: 10}}>{row.card_id}</Text>
                        </View>
                        <Text style={{}}>{row.type === 0 ? "成人票" : "学生票"}</Text>
                        <TouchableHighlight
                            style={{
                                alignItems: "center",
                                padding: 1
                            }}
                            activeOpacity={0.6}
                            underlayColor={"white"}
                            onPress={() => deleteOne(rowidx, list, setPassengerList)}>
                            <Icon name={"delete"} color={"black"} style={{marginLeft: 35, marginTop: -3}}/>
                        </TouchableHighlight>
                    </View>
                </List.Item>
            )}
        )
    // if(data !== []) {
    //     setData({first_order: info1, second_order: info2})
    // }
    return result
}

function TransitPassengerList ({navigation,statusRef, trainType, firstSeatNum, secondSeatNum}){
    const [passengerList, setPassengerList] = useState([])
    const route = useRoute()
    const [watch, setWatch] = useState(false)
    const [data, setData] = useState([])
    const [change,setChange]=useState(false)
    const [passengerReady,setPassengerReady]=useState(false)
    const [judge, setJudge] = useState(false)
    useImperativeHandle(statusRef, () => ({
        getData: () => {
            return(
                passengerList
            )
        }
    }))

    useLayoutEffect(()=>{
        console.log("renderSuccess")
        console.log("inside:",route.params.passengers)

        if(route.params.isChange){
            setChange(true)
            console.log("do this")
            const callback=(p)=>{
                setPassengerList(p)
                console.log("back: "+passengerList)
            }
            getOrderPassengers(route.params.passengers,callback)
        }

        else if(route.params.isOneWay=== undefined) {

            console.log(route.params)
            let checked = route.params.checked
            let passengers = route.params.passengers
            let passengerList = []
            passengers.map((row1, rowidx1) => {
                if (checked[rowidx1] === true)
                    passengerList.push(passengers[rowidx1])
            })
            setPassengerList(passengerList)
        }
    }, [watch])
    return(
        <List renderHeader={'乘客选择'} style={{borderColor: "grey"}}>
            {console.log("passengerList: " + passengerList)}
            {change?((passengerList.length>0)?renderList(passengerList, setPassengerList, setData, data, trainType, firstSeatNum, secondSeatNum, judge, setJudge):<Text>lOADING</Text>):renderList(passengerList, setPassengerList, setData, data, trainType, firstSeatNum, secondSeatNum, judge, setJudge)}
            {
                change?null: <TouchableHighlight
                    style={{alignItems: "center",
                        padding: 1}}
                    activeOpacity={0.6}
                    underlayColor={"white"}
                    onPress={() =>
                    {
                        if (route.params.isPassBy)
                            navigation.push('PassengerSelection',
                                {
                                    date:route.params.date,
                                    firstTrainId:route.params.firstTrainId,
                                    secondTrainId:route.params.secondTrainId,
                                    firstStartNo:route.params.firstStartNo,
                                    secondStartNo:route.params.secondStartNo,
                                    firstEndNo:route.params.firstEndNo,
                                    secondEndNo:route.params.secondEndNo,
                                    isChange:route.params.isChange,
                                    passengerList: passengerList,
                                    orderId:route.params.orderId,
                                    isOneWay:route.params.isOneWay,
                                    fromTransit:true
                                }
                            )

                        else
                            navigation.push('PassengerSelection', {passengerList: passengerList,date:route.params.date, trainId: route.params.trainId, start_no: route.params.start_no, end_no: route.params.end_no})
                    }
                    }>
                    <View style={{height: 50, alignItems: "center", flexDirection: "row"}}>
                        <Icon name={"user-add"} color={"orange"} />
                        <Text style={{fontSize: 20, color: "orange"}}>选择乘车人</Text>
                    </View>
                </TouchableHighlight> }
        </List>
    )
}

export default TransitPassengerList
