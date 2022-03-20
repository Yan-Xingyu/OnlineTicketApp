import React, {useRef, useEffect,useState} from "react";

import { Icon, Button, Provider, Flex} from '@ant-design/react-native'
import {ScrollView, StatusBar, Text, View, Modal} from "react-native";
import PurchaseCard from "../components/PurchaseCard";
import PurchasePassengerList from "../components/PurchasePassengerList";
import {Header} from "react-native-elements/dist/header/Header";
import {useNavigation, useRoute} from "@react-navigation/core";
import {Calendar, CalendarList, Agenda} from 'react-native-calendars';
import AntDesign from "react-native-vector-icons/AntDesign";
import {PriceTable} from "../components/PriceTable";

import {stampToDate, stampToFullTime, stampToMonthDay, timeToClock} from "../utils/HandleDate";
import {changeTicket, getTicketInfo, getTicketsOneWayCallBack} from "../services/TicketService";

import storage from "../storage/Storage";

import LoginModal from "./LoginView";

import {calCrossDay, calUseTime} from "../utils/OrderUtil";
import {useCavy} from 'cavy';

function PurchaseView ({route, navigation}) {
    const {isOneWay, start_no, end_no, date,trainId} = route.params
    const [tel_number, setTel_number] = useState("")
    const [modalVisible, setModalVisible] = useState(false)
    const callback = (data) => {console.log(data);navigation.navigate('PayResult',{success:data.status,message:data.message,result:data.data})}
    const [loginModalVisible, setLoginModalVisible] = useState(false)
    const [ticketInfo,setTicketInfo] = useState({})
    const [status,setStatus] =useState(false)
    const [firstSeatNum, setFirstSeatNum] = useState(0)
    const [secondSeatNum, setSecondSeatNum] = useState(0)
    const generateTestHook = useCavy()
    const handleClick = (route, tickedInfo)=> {
        let data = get()
        console.log(data)
        let judge = false
        data.map((row, rowidx)=>{
            if(row.seat_type === 6)
                judge = true
        })
        if(data.length === 0 || judge === true) {
            alert("请选择座位")
            return
        }
        storage.load({key: "userId"})
            .then(ret => {
                // if(!route.params.isChange)
                //     purchase(ret.userid, route.params.trainId, route.params.start_no, route.params.end_no, data, callback)
                // else
                //     changeTicket(ret.userid, route.params.trainId, route.params.start_no, route.params.end_no, data, route.params.orderId,callback)

                let orderData = {
                    "startStation": ticketInfo.start_station
                    ,"endStation": ticketInfo.end_station
                    ,"startTime": stampToFullTime(ticketInfo.start_time.time)
                    ,"endTime": stampToFullTime(ticketInfo.end_time.time)
                    ,"orderTime": stampToFullTime(new Date().getTime())
                    ,"status": 1
                    ,"trainTag": ticketInfo.train_tag
                    ,"useTime": calUseTime(stampToFullTime(ticketInfo.start_time.time), stampToFullTime(ticketInfo.end_time.time))
                    ,"crossDay": calCrossDay(stampToFullTime(ticketInfo.start_time.time), stampToFullTime(ticketInfo.end_time.time))
                }
                let params = {
                    "userid":ret.userid,
                    "trainId":trainId,
                    "start_no":start_no,
                    "end_no":end_no,
                    "data":data
                }
                if(!route.params.isChange)
                    navigation.navigate("OrderDetail",{"data":orderData,"params":params,"status":1})
                else
                {
                    params ["orderId"]=route.params.orderId;
                    navigation.navigate("OrderDetail",{"data":orderData,"params":params,"status":2})
                }
            }).catch(error => console.log(error))
    }
    useEffect(
        ()=>{
            storage.load({key:"telNumber"})
                .then(ret=>{
                    setTel_number(ret.telNumber)
                }).catch(error => console.log(error))

            storage.load({key: "userId"})
                .then(ret => {
                    if(status === false) {
                        const callback = (data) => {
                            setTicketInfo(data)
                            setStatus(true)
                        }
                        getTicketInfo(route.params.trainId, route.params.start_no, route.params.end_no, callback)
                    }

                    if(ret.userid === undefined)
                        setLoginModalVisible(true)
                }).catch(()=>{
                    setLoginModalVisible(true)
            })
        }
    )

    const dateWeek = stampToMonthDay(date)

    const PurchaseList = useRef()
    const get = () =>{
        return PurchaseList.current.getData()
    }

        return(
        <Provider>
            <View style={{backgroundColor: 'rgba(192, 190, 192, 0.1)', flex: 1}}>
                <Header
                    leftComponent={{icon: 'left', color: '#fff', type: 'antdesign',onPress:navigation.goBack, iconStyle: {color: '#fff'} }}
                    centerComponent={{
                        text: dateWeek[0]+'月'+dateWeek[1]+' '+dateWeek[2],
                        style: {color: '#fff', textAlignVertical: 'center', fontSize: 18}
                    }}
                    rightComponent={<Text
                        style={{color: '#fff', textAlignVertical: 'center', fontSize: 16}}>购票须知</Text>}
                    backgroundColor={'#6495ed'}
                />

                {  status?<>
                    <PurchaseCard openModal={()=>setModalVisible(true)} ticketInfo={ticketInfo}/>
                     <ScrollView>
                        <PurchasePassengerList navigation={navigation} statusRef={PurchaseList} trainType={ticketInfo.train_type}/>
                        <View style={{flexDirection: "row", backgroundColor: "white", marginTop: 10, height: 42}}>
                            <Text style={{fontSize: 20, marginTop: 11, marginLeft: 20, fontWeight: "bold"}}>手机号码</Text>
                            <Text style={{fontSize: 18, marginTop: 11, marginLeft: 70}}>{tel_number}</Text>
                        </View>
                        <Button ref={generateTestHook("OneWay.purchase")} type={"primary"} style={{marginTop: 20, width: "80%", alignSelf: "center"}} onPress={()=>{handleClick(route, ticketInfo)}}>提交订单</Button>
                    </ScrollView></>:<Text>LOADING...</Text>}

                <Modal
                    transparent={false}
                    onClose={() => setModalVisible(false)}

                    visible={modalVisible}
                    animationType={'slide'}
                >
                    <View style={{paddingVertical: 20}}>
                        <View style={{ height: 30, width:'100%',flexDirection:'row'}}>
                            <AntDesign name={"close"} size={20} style={{flex:1,paddingLeft:30}} onPress={()=>setModalVisible(false)}/>
                            <Text style={{height: 30,fontWeight:'bold',fontSize:16,flex:1,textAlign:'center'}}>
                                选择日期
                            </Text>
                            <AntDesign  size={20} style={{flex:1,paddingRight:30}}/>
                        </View>
                        <CalendarList  markedDates={{
                            '2021-07-19': {selected: true, marked: true, selectedColor: 'blue'},
                        }}
                                       onDayPress={(day) => {console.log('selected day', day);setModalVisible(false)}}
                        />

                    </View>
                </Modal>
                <LoginModal modalVisible={loginModalVisible} setModalVisible={setLoginModalVisible} judge={false}/>
            </View>
        </Provider>
    )
}

export default PurchaseView;
