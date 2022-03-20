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
import {SeatSelectTable} from './SeatSelectTable';


function TransitDetailCard ({seatNum, setSeatNum, openModal,ticketInfo}){
    const route= useRoute()
    const dateWeek = stampToMonthDay(route.params.date)
    console.log("ticketInfo: "+ticketInfo[0])
    return(
        <Card style={{height: '20%'}}>
            <Card.Body >
                <View style={{flexDirection: "column"}}>
                    <View style={{ height: 80,flexDirection:'row'}}>
                        <View style={{ marginTop: 10, flexDirection:'column',flex:1}}>
                            <Text style={{fontSize:25,textAlign:'center'}}>{timeToClock(ticketInfo.start_time.hours,ticketInfo.start_time.minutes)} </Text>
                            <Text style={{ textAlign:'center', marginTop: 5 }}>{ticketInfo.start_station} </Text>
                        </View>
                        <View style={{ height: 74,flexDirection:'column',flex:1}}>
                            <Text style={{fontSize:1}}/>
                            <Text style={{ fontSize:11,textAlign:'center'}}>{subDate(ticketInfo.end_time.time,ticketInfo.start_time.time)}</Text>
                            <Image source={imgUrl} style={{
                                resizeMode: "stretch",
                                height: 30,
                                width: 90,
                                marginLeft: 20
                            }}/>
                            <Text style={{marginLeft: "38%"}}>G40</Text>
                        </View>
                        <View style={{ marginTop: 10, height: 74,flexDirection:'column',flex:1}}>
                            <Text style={{ fontSize:25,textAlign:'center'}}>{timeToClock(ticketInfo.end_time.hours,ticketInfo.end_time.minutes)} </Text>
                            <Text style={{ textAlign:'center', marginTop: 5 }}>{ticketInfo.end_station} </Text>
                        </View>
                    </View>
                    <SeatSelectTable seatNum={seatNum} setSeatNum={setSeatNum} end_no={ticketInfo.end_no} start_no={ticketInfo.start_no} trainType={ticketInfo.train_type}/>
                </View>
            </Card.Body>
        </Card>

    )
}

export default TransitDetailCard
