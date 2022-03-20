import React, {useRef, useEffect,useState} from "react";

import { Button, Provider} from '@ant-design/react-native'
import {ScrollView, Text, View, Modal} from "react-native";
import PurchaseCard from "../components/PurchaseCard";
import PurchasePassengerList from "../components/PurchasePassengerList";
import {Header} from "react-native-elements/dist/header/Header";
import {CalendarList} from 'react-native-calendars';
import AntDesign from "react-native-vector-icons/AntDesign";

import {stampToMonthDay} from "../utils/HandleDate";
import {changeTicket, getTicketInfo, getTicketInfoTwice,  purchaseTwice} from "../services/TicketService";

import storage from "../storage/Storage";
import LoginModal from "./LoginView";
import TransitCard from '../components/TransitCard';
import TransitDetailCard from '../components/TransitDetailCard';
import TransitPassengerList from '../components/TransitPassengerList';

function TransitBuyView ({route, navigation}) {
    const {date, isOneWay, firstStartNo, firstEndNo, firstTrainId, secondTrainId, secondStartNo, secondEndNo} = route.params
    const [tel_number, setTel_number] = useState("")
    const [modalVisible, setModalVisible] = useState(false)
    const callback = (data) => {console.log(data);navigation.navigate('PayResult',{success:data.status,message:data.message, result:data.data})}
    const [loginModalVisible, setLoginModalVisible] = useState(false)
    const [ticketInfo,setTicketInfo] = useState({})

    const [status,setStatus] =useState(false)
    const [firstSeatNum, setFirstSeatNum] = useState(-1)
    const [secondSeatNum, setSecondSeatNum] = useState(-1)
    const handleClick = (route, tickedInfo)=> {
        let passengers = get()
        let data = []
        let info1 = []
        let info2 = []
        console.log("data!!!!!!!!!!!!!!!!: ", passengers)
        if(passengers.length === 0){
            alert("请选择乘车人")
            return
        }
        if(firstSeatNum === -1 || secondSeatNum === -1){
            alert("请选择座位")
            return
        }
        passengers.map((row, rowidx) => {
            info1.push({passenger_id: row.id, seat_type: firstSeatNum})
            info2.push({passenger_id: row.id, seat_type: secondSeatNum})
        })
        data = {first_order: info1, second_order: info2}
        storage.load({key: "userId"})
            .then(ret => {
                if(!route.params.isChange)
                    purchaseTwice(ret.userid, route.params.firstTrainId, route.params.firstStartNo, route.params.firstEndNo, route.params.secondTrainId, route.params.secondStartNo, route.params.secondEndNo, data, callback)
            })
            .catch(err=>console.log(err))
    }
    useEffect(
        ()=>{
            console.log(route.params)
            storage.load({key:"telNumber"})
                .then(ret=>{
                    setTel_number(ret.telNumber)
                })
                .catch(err=>console.log(err))

            storage.load({key: "userId"})
                .then(ret => {
                    if(status === false) {
                        const callback = (data) => {
                            console.log(data)
                            setTicketInfo(data)
                            setStatus(true)
                        }

                        getTicketInfoTwice(route.params.firstTrainId, route.params.firstStartNo, route.params.firstEndNo,route.params.secondTrainId,route.params.secondStartNo,route.params.secondEndNo, callback)
                    }

                    if(ret.userid === undefined)
                        setLoginModalVisible(true)
                }).catch(()=>{
                setLoginModalVisible(true)
            })
        }
    )

    const dateWeek = stampToMonthDay(route.params.date)

    const TransitList = useRef()
    const get = () =>{
        return TransitList.current.getData()
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
                {route.params.isOneWay?<TransitCard openModal={()=>setModalVisible(true)} ticketInfo={ticketInfo}/>:null}
                    <TransitDetailCard seatNum={firstSeatNum} setSeatNum={setFirstSeatNum} openModal={()=>setModalVisible(true)} ticketInfo={ticketInfo.firstInfo}/>
                    <TransitDetailCard seatNum={secondSeatNum} setSeatNum={setSecondSeatNum} openModal={()=>setModalVisible(true)} ticketInfo={ticketInfo.secondInfo}/>
                    <ScrollView>
                        <TransitPassengerList navigation={navigation} statusRef={TransitList} trainType={ticketInfo.train_type} firstSeatNum={firstSeatNum} secondSeatNum={secondSeatNum}/>
                        <View style={{flexDirection: "row", backgroundColor: "white", marginTop: 10, height: 42}}>
                            <Text style={{fontSize: 20, marginTop: 11, marginLeft: 20, fontWeight: "bold"}}>手机号码</Text>
                            <Text style={{fontSize: 18, marginTop: 11, marginLeft: 70}}>{tel_number}</Text>
                        </View>
                        <Button type={"primary"} style={{marginTop: 20, width: "80%", alignSelf: "center"}} onPress={()=>{handleClick(route, ticketInfo)}}>提交订单</Button>
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

export default TransitBuyView;
