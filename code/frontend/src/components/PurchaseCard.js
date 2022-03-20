import React, {useEffect, useState} from "react";
import { Icon, Flex, Card} from '@ant-design/react-native'
import { Text, View, TouchableHighlight, Image} from "react-native";
import imgUrl from '../img/right.png'
import {useRoute} from "@react-navigation/core";
import {stampToMonthDay, subDate, timeToClock} from "../utils/HandleDate";
import {PriceTable} from "./PriceTable";


function PurchaseCard ({openModal,ticketInfo}){
    const [count, setCount] = useState(0)
    const route= useRoute()
    const dateWeek = stampToMonthDay(route.params.date)
    console.log("ticketInfo: "+ticketInfo[0])
     return(
        <Card style={{height:180}}>
            <Card.Body >
                <View style={{flexDirection: "column"}}>
                    <View style={{ height: 80,flexDirection:'row'}}>
                        <View style={{ marginTop: 10, flexDirection:'column',flex:1}}>
                            <Text style={{fontSize:25,textAlign:'center'}}>{timeToClock(ticketInfo.start_time.hours,ticketInfo.start_time.minutes)} </Text>
                            <Text style={{ textAlign:'center', marginTop: 5 }}>{ticketInfo.start_station} </Text>
                            <Text/>
                            <TouchableHighlight
                                style={{width: 65, alignSelf: "center"}}
                                activeOpacity={0.6}
                                underlayColor="#DDDDDD"
                                onPress={() => setCount(1)}>
                                <View>
                                    <Flex>
                                        <Flex.Item style={{ paddingLeft: 4, paddingRight: 4 }}>
                                            <Icon name={"left"} size={'xxs'}/>
                                        </Flex.Item>
                                        <Text>前一天</Text>
                                    </Flex>
                                </View>
                            </TouchableHighlight>
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
                            <Text style={{ fontSize:11,textAlign:'center'}}>{ticketInfo.train_tag} </Text>
                            <Text style={{fontSize:21}}/>
                            <TouchableHighlight
                                style={{alignItems: "center",
                                    padding: 1}}
                                activeOpacity={0.6}
                                underlayColor="#DDDDDD"
                                onPress={openModal}>
                                <View>
                                    <View style={{ flexDirection:'row'}}>
                                        <Text>{dateWeek[0]+'月'+dateWeek[1]+' '+dateWeek[2]}</Text>
                                        <Icon name={"down"} size={'xxs'}/>
                                    </View>
                                </View>
                            </TouchableHighlight>
                        </View>
                        <View style={{ marginTop: 10, height: 74,flexDirection:'column',flex:1}}>
                            <Text style={{ fontSize:25,textAlign:'center'}}>{timeToClock(ticketInfo.end_time.hours,ticketInfo.end_time.minutes)} </Text>
                            <Text style={{ textAlign:'center', marginTop: 5 }}>{ticketInfo.end_station} </Text>
                            <Text />
                            <TouchableHighlight
                                style={{width: 60, alignSelf: "center"}}
                                activeOpacity={0.6}
                                underlayColor="#DDDDDD"
                                onPress={() => setCount(1)}>
                                <View>
                                    <Flex>
                                        <Text>后一天</Text>
                                        <Flex.Item>
                                            <Icon name={"right"} size={'xxs'}/>
                                        </Flex.Item>
                                    </Flex>
                                </View>
                            </TouchableHighlight>
                        </View>
                    </View>
                    <View style={{marginTop: 30, marginLeft: "5%"}}>

                    </View>
                    <PriceTable end_no={ticketInfo.end_no} start_no={ticketInfo.start_no} trainType={ticketInfo.train_type}/>
                </View>
            </Card.Body>
        </Card>
    )
}

export default PurchaseCard
