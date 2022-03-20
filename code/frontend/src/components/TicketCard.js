import {useNavigation} from "@react-navigation/native";
import {DeviceEventEmitter, Image, StyleSheet, Text, TouchableHighlight, TouchableOpacity, View} from "react-native";
import React, {useEffect, useState} from "react";
import {WINDOWS_HEIGHT, WINDOWS_WIDTH, OTA_COLOR, BASE_URL} from "../constants/Constants";
import RightArrow from "../img/right.png"
import {postByParam} from "../utils/Ajax";
import {datetime_to_stamp} from "../utils/HandleDate";
import {calUseTime,calCrossDay} from "../utils/OrderUtil"
const color = OTA_COLOR;


const TicketCard = ({order}) => {
    const navigation = useNavigation();
    const [crossDay, setCrossDay] = useState(0);
    const [useTime, setUseTime] = useState("");
    const [data,setData]=useState(order);
    useEffect(()=>{
        setData(order);
    },[order])
    useEffect(() => {
        setUseTime(calUseTime(data.startTime, data.endTime))
        setCrossDay(calCrossDay(data.startTime, data.endTime));
    }, [data])


    return (<TouchableHighlight activeOpacity={0}
                                underlayColor={color.touchableColor}
                                onPress={() => {
                                    let fullData = data
                                    fullData["crossDay"] = crossDay
                                    fullData["useTime"] = useTime
                                    navigation.navigate("OrderDetail", {"data": fullData,"status":-1,"fromWhere":"order"})
                                }}
                                style={styles.card}
        >
            <>
                <View style={{flexDirection: "row", justifyContent: 'space-evenly'}}>
                    <View style={{alignItems: 'flex-end'}}>
                        <Text style={[{fontSize: 16}]}>
                            {data.startStation}
                        </Text>
                        <Text style={[{fontSize: 22, fontWeight: 'bold', color: 'black'}]}>
                            {data.startTime.substring(11, 16)}
                        </Text>
                    </View>
                    <View style={{alignItems: 'center'}}>
                        <Text style={[{fontSize: 12, position: "relative", top: 10}]}>
                            {data.trainTag}
                        </Text>
                        <Image source={RightArrow} style={{
                            resizeMode: "stretch",
                            height: 30,
                            width: 90,
                        }}/>
                        <Text style={[{fontSize: 10, position: "relative", bottom: 10, fontWeight: '300'}]}>
                            {useTime}
                        </Text>
                    </View>
                    <View style={{alignItems: 'flex-start'}}>
                        <Text style={[{fontSize: 16}]}>
                            {data.endStation}
                        </Text>
                        <View style={[{flexDirection: 'row', alignItems: 'flex-start'}]}>
                            <Text style={{fontSize: 22, fontWeight: 'bold', color: 'black'}}>
                                {data.endTime.substring(11, 16)}
                            </Text>
                            {(crossDay) ?
                                <Text style={{fontSize: 10}}>
                                    +{crossDay}天
                                </Text> : null}
                        </View>
                    </View>
                </View>
                <View style={styles.separator_h}/>
                <View style={styles.RowFlexBetweenWrapper}>
                    {(data.status===1)?<Text style={styles.status}>已出票</Text>:(data.status===0)?<Text style={styles.status}>已退票</Text>:<Text style={styles.status}>已改签</Text>}
                    {(data.status===1)&&
                    <View style={styles.RowFlexEndWrapper}>
                        <TouchableOpacity onPress={() => {
                            refresh(data.orderId, (response) => {
                                console.log("aaa",response)
                                setData(response)
                            })
                        let passengers= [];
                        data.orderItems.map((item)=>{
                        passengers.push(item.passengerId.id)
                    })
                        console.log("ids"+passengers)
                        navigation.navigate('RailInfoList',{date:datetime_to_stamp(data.startTime),
                        isChange:true,
                        start:data.startStation,
                        end:data.endStation,
                        passengers:passengers,
                        orderId:data.orderId
                    })

                    }}>
                        <Text style={[styles.leftItem, {fontSize: 14, color: color.themeColor}]}>
                        改签
                        </Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => {
                                // refresh(data.orderId,(response)=>setData(response))
                                let fullData = data
                                fullData["crossDay"] = crossDay
                                fullData["status"] = 0
                                fullData["useTime"] = useTime
                                navigation.navigate("OrderDetail", {"data": fullData,"status":0})
                    }}>
                        <Text style={[styles.rightItem, {fontSize: 14, color: color.themeColor}]}>
                        退票
                        </Text>
                        </TouchableOpacity>
                        </View>}
                </View>
            </>
        </TouchableHighlight>
    )
}
const refresh = (orderId,callback)=>{
    const url = BASE_URL+"/findOrderById";
    postByParam(url,{"orderId":orderId},callback);
}
export default TicketCard;

const styles = StyleSheet.create({
    status:{
        marginLeft:0.025 * WINDOWS_WIDTH,
        fontSize:14,
        color:'#dcdcdc'
    },
    RowFlexBetweenWrapper: {
        justifyContent: 'space-between',
        flexDirection: "row",
        marginTop: 0.005 * WINDOWS_HEIGHT,
    },
    RowFlexEndWrapper: {
        justifyContent: 'flex-end',
        flexDirection: "row",
        paddingTop: 0.015 * WINDOWS_WIDTH,
        paddingBottom: 0.015 * WINDOWS_WIDTH,
    },
    leftItem: {
        textAlign: "left",
        paddingLeft: 0.025 * WINDOWS_WIDTH,
        paddingRight: 0.01 * WINDOWS_WIDTH,
    },
    centerItem: {
        textAlign: "center",
        paddingLeft: 0.01 * WINDOWS_WIDTH,
        paddingRight: 0.01 * WINDOWS_WIDTH,
    },
    rightItem: {
        textAlign: "right",
        paddingLeft: 0.01 * WINDOWS_WIDTH,
        paddingRight: 0.025 * WINDOWS_WIDTH,
    },
    tab: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: color.backgroundColor,
    },
    card: {
        marginTop:0.025 * WINDOWS_WIDTH,
        borderRadius: 0.0125 * WINDOWS_WIDTH,
        borderColor: color.separatorColor,
        borderWidth: 0.7,
        backgroundColor: 'white',
        width:0.8*WINDOWS_WIDTH,
        paddingTop: 10,
        elevation: 5,  //  设置阴影角度，通过这个设置有无阴影（这个是最重要的，决定有没有阴影）

        shadowColor: 'black',  //  阴影颜色

        shadowOffset: { width: 0, height: 0 },  // 阴影偏移

        shadowOpacity: 1,  // 阴影不透明度

        shadowRadius: 5,  //  圆角
    },
    separator_h: {
        height: 0,
        borderTopWidth: 0.7,
        borderColor: color.separatorColor,
        opacity: 1,
        marginTop: 0.025 * WINDOWS_WIDTH
    },
})
