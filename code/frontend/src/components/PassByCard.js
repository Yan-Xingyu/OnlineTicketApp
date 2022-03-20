import React from "react";

import {useRoute,useNavigation} from "@react-navigation/core";
import {Image, Text, TouchableHighlight, View} from "react-native";
import {Card, WingBlank} from "@ant-design/react-native";
import {subDate, getDayDif, stampToDate} from "../utils/HandleDate";
import imgUrl from "../img/right.png";
import AntDesign from "react-native-vector-icons/AntDesign";

export function SeatTable({rail}){
    return(
        (rail.trainType>0)?<View style={{flexDirection:"row",justifyContent:'space-around',flex:1}}>
                <Text>
                    {`一等座${rail.firstSeat>30?"有":(rail.firstSeat+"张")}`}
                </Text>
            <Text>
                {`二等座${rail.secondSeat>30?"有":(rail.secondSeat+"张")}`}
            </Text>
            <Text>
                {`商务座${rail.vipSeat>30?"有":(rail.vipSeat+"张")}`}
            </Text>
            <Text>
                {`站票${rail.standSeat>30?"有":(rail.standSeat+"张")}`}
            </Text>
            </View>:<View style={{flexDirection:"row",justifyContent:'space-around',flex:1}}>
            <Text>
                {`软座${rail.firstSeat>30?"有":(rail.firstSeat+"张")}`}
            </Text>
            <Text>
                {`硬座${rail.secondSeat>30?"有":(rail.secondSeat+"张")}`}
            </Text>
            <Text>
                {`硬卧${rail.hardLieSeat>30?"有":(rail.hardLieSeat+"张")}`}
            </Text>
            <Text>
                {`软卧${rail.softLieSeat>30?"有":(rail.softLieSeat+"张")}`}
            </Text>
            <Text>
                {`站票${rail.standSeat>30?"有":(rail.standSeat+"张")}`}
            </Text>
        </View>


    )
}


export  function PassByCard({railInfo,date}){


    const navigation =useNavigation()
    const route = useRoute()
    return(
        <TouchableHighlight
            activeOpacity={0.7}
            underlayColor="#DDDDDD"
           onPress={() => {
            /*   console.log("startNo",railInfo.firstRail.start_no)*/
              navigation.navigate('Transit',{
                    isOneWay:route.params.isOneWay,
                    isPassBy: true,
                    date:date,
                    firstTrainId: railInfo.firstRail.trainId,
                    firstStartNo:railInfo.firstRail.start_no,
                    firstEndNo:railInfo.firstRail.end_no,
                    secondTrainId: railInfo.secondRail.trainId,
                    secondStartNo:railInfo.secondRail.start_no,
                    secondEndNo:railInfo.secondRail.end_no,
                    isChange:route.params.isChange,
                    passengers:route.params.passengers,
                    orderId:route.params.orderId,
                    fromTransit: true
                });

            }}
        >
            <WingBlank size={"md"}>
                <Card  >
                    <View style={{flexDirection:"column"}}>
                        <View style={{flexDirection:"row"}}>
                            <Text style={{color:'rgb(255,81,0)',flex:4}}>{`总历时${subDate(railInfo.secondRail.arriveTime,railInfo.firstRail.startTime)}`}</Text>
                            <Text style={{flex:5,fontSize:12,color:'rgb(255,81,0)'}}><AntDesign name={"sync"} color={"blue"} />{subDate(railInfo.secondRail.startTime,railInfo.firstRail.startTime)}</Text>
                        </View>

                        <View style={{flexDirection:"row",justifyContent:'space-around'}}>
                            <Text style={{textAlignVertical:'center',paddingLeft:0}}>{railInfo.firstRail.startStation}</Text>
                            <View>
                                <Text style={{textAlign:"center",color:'blue'}}>{railInfo.firstRail.trainTag}</Text>
                                <Image source={imgUrl} style={{
                                    resizeMode: "stretch",
                                    height: 12,
                                    width: 60,
                                    marginLeft: 20
                                }}/>
                                <View style={{flexDirection:'row'}}>
                                    <Text style={{fontSize:12,textAlign:'center'}}>{`${railInfo.firstRail.startClock}-${railInfo.firstRail.arriveClock}`}</Text>
                                    {getDayDif(railInfo.firstRail.startDate,railInfo.firstRail.endDate)>0? <Text style={{color:'rgb(255,81,0)'}}>{`+${getDayDif(railInfo.firstRail.startDate,railInfo.firstRail.endDate)}`+`天`}</Text>
                                    :null}
                                         </View>
                                  </View>
                            <View>
                                <Text style={{textAlign:'center'}}>{railInfo.firstRail.endStation}</Text>
                                <AntDesign name={"down"}  style={{textAlign:'center'}}/>
                                <Text style={{textAlign:'center'}}>{railInfo.secondRail.startStation}</Text>
                            </View>

                            <View>
                                <Text style={{textAlign:"center",color:'blue'}}>{railInfo.secondRail.trainTag}</Text>
                                <Image source={imgUrl} style={{
                                resizeMode: "stretch",
                                height: 12,
                                width: 60,
                                marginLeft: 20
                            }}/>
                                <View style={{flexDirection:'row'}}>
                                    <Text style={{fontSize:12,textAlign:'center'}}>{`${railInfo.secondRail.startClock}-${railInfo.secondRail.arriveClock}`}</Text>
                                    {getDayDif(railInfo.secondRail.startDate,railInfo.secondRail.endDate)>0? <Text style={{color:'rgb(255,81,0)'}}>{`+${getDayDif(railInfo.secondRail.startDate,railInfo.secondRail.endDate)}`+`天`}</Text>
                                        :null}
                                </View>
                                 </View>

                            <Text style={{textAlignVertical:'center'}}>{railInfo.secondRail.endStation}</Text>
                        </View>
                        <View style={{flexDirection:'row'}}>
                            <Text >第一程</Text>
                            <SeatTable rail={railInfo.firstRail}/>
                        </View>

                        <View style={{flexDirection:'row'}}>
                            <Text>第二程</Text>
                            <SeatTable rail={railInfo.secondRail}/>
                        </View>
                    </View>
                </Card>
            </WingBlank>
        </TouchableHighlight>
    )
}
