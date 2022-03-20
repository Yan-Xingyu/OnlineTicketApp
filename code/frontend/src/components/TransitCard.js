import React, {useEffect, useState} from "react";
import { Icon, Flex, Card} from '@ant-design/react-native'
import { Text, View, TouchableHighlight, Image} from "react-native";
import imgUrl from '../img/right.png'
import {useRoute} from "@react-navigation/core";
import {stampToMonthDay, subDate, timeToClock} from "../utils/HandleDate";
import {PriceTable} from "./PriceTable";
import {WINDOWS_HEIGHT} from '../constants/Constants';
import Ionicons from 'react-native-vector-icons/Ionicons';
import PurchaseCard from './PurchaseCard';


function TransitCard ({openModal,ticketInfo}){
    const [count, setCount] = useState(0)
    const route= useRoute()
    const dateWeek = stampToMonthDay(route.params.date)
    console.log("ticketInfo: "+ticketInfo[0])
    return(
        <Card style={{height: '13%'}}>
            <Card.Body >
                <View style={{flexDirection: "column"}}>
                    <View style={{ height: 80,flexDirection:'row'}}>
                        <View style={{ marginTop: 10, flexDirection:'column',flex:1}}>
                            <Text style={{fontSize:25,textAlign:'center'}}>{timeToClock(ticketInfo.firstInfo.start_time.hours,ticketInfo.firstInfo.start_time.minutes)} </Text>
                            <Text style={{ textAlign:'center', marginTop: 5 }}>{ticketInfo.firstInfo.start_station} </Text>
                        </View>
                        <View style={{ height: 74,flexDirection:'column',flex:1}}>
                            <Text style={{fontSize:1}}/>
                            <Text style={{ fontSize:11,textAlign:'center'}}>{subDate(ticketInfo.secondInfo.end_time.time,ticketInfo.firstInfo.start_time.time)}</Text>
                            <Image source={imgUrl} style={{
                                resizeMode: "stretch",
                                height: 30,
                                width: 90,
                                marginLeft: 20
                            }}/>
                            <View style={{flexDirection: 'row'}}>
                                <Icon name={"retweet"} color={"black"} size={15} style={{marginLeft: "23%", marginTop: 2}}/>
                                <Text>{ticketInfo.firstInfo.end_station}</Text>
                            </View>
                        </View>
                        <View style={{ marginTop: 10, height: 74,flexDirection:'column',flex:1}}>
                            <Text style={{ fontSize:25,textAlign:'center'}}>{timeToClock(ticketInfo.secondInfo.end_time.hours,ticketInfo.secondInfo.end_time.minutes)} </Text>
                            <Text style={{ textAlign:'center', marginTop: 5 }}>{ticketInfo.secondInfo.end_station} </Text>
                        </View>
                    </View>
                </View>
            </Card.Body>
        </Card>

    )
}

export default TransitCard
