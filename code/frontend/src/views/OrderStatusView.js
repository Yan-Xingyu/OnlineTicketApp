import React, {useEffect, useState} from "react";
import {BASE_URL, WINDOWS_WIDTH} from "../constants/Constants";
import storage from "../storage/Storage";
import {postByBody, postByParam} from "../utils/Ajax";
import LoginModal from "./LoginView";
import {StatusBar, View, Text, FlatList, Image, TouchableOpacity, StyleSheet, DeviceEventEmitter} from "react-native";
import {Tabs} from "@ant-design/react-native";
import {OTA_COLOR} from "../constants/Constants";
import RightArrow from "../img/right.png";
import {calCrossDay,calPrice,calUseTime} from "../utils/OrderUtil";
import {useNavigation} from "@react-navigation/native";
import ColorTrain from "../img/color_train.png"
import GreyTrain from "../img/grey_train.png"
import NothingBlue from "../img/nothing_blue.png"
import {datetime_to_stamp} from "../utils/HandleDate";
const OrderList =({order,refreshing})=>{
    const navigation = useNavigation();
    const renderItem=(item,index)=>{
        const status2str= (status)=>{
            if(status === 0) return "已退票";
            if(status === 1) return "已出票";
            else if(status === 2) return "已改签";
        }
        return(
            <TouchableOpacity style={styles.card}
            onPress={()=>{
                let fullData = item.item
                fullData["crossDay"] = calCrossDay(item.item.startTime,item.item.endTime);
                fullData["useTime"] = calUseTime(item.item.startTime,item.item.endTime);
                navigation.navigate("OrderDetail", {"data": fullData,"status":-1,"fromWhere":"orderStatus"})
            }}
            >
                {item.item.status===1?
                    <Image source={ColorTrain} style={{
                    resizeMode: "stretch",
                    height: 30,
                    width: 30,

                    }}/>:
                    <Image source={GreyTrain} style={{
                        resizeMode: "stretch",
                        height: 30,
                        width: 30,

                    }}/>
                }
                <View style={{marginLeft:10,flexGrow:1}}>
                    <View style={{flexDirection:'row',justifyContent:"space-between",alignItems:'center'}}>
                        <View style={{flexDirection:'row'}}>
                            <Text style={{fontSize:18}}>{item.item.startStation} </Text>
                            <Image source={RightArrow} style={{
                                resizeMode: "stretch",
                                height: 20,
                                width: 20,
                                top: 3,
                            }}/>
                            <Text style={{fontSize:18}}> {item.item.endStation}</Text>
                        </View>
                        <Text style={{}}>{status2str(item.item.status)}</Text>
                    </View>
                    <View style={{flexDirection:'row',marginVertical:5}}>
                        <Text style={{color:"#aaaaaa"}}>{item.item.startTime.substring(5,10)}  </Text>
                        <Text style={{color:"#aaaaaa"}}>
                            {item.item.startTime.substring(11,16)} 至 {item.item.endTime.substring(11,16)}
                        </Text>
                    </View>
                    <View style={{flexDirection:'row',marginVertical:5}}>
                        <Text style={{color:"#aaaaaa"}}>{item.item.trainTag} / </Text>
                        <Text style={{color:"black"}}>￥{calPrice(item.item.orderItems).toFixed(2)}</Text>
                    </View>
                    {item.item.status===1&&
                    <View style={{flexDirection:'row',justifyContent:'flex-end'}}>
                        <TouchableOpacity
                            style={styles.button}
                            onPress={()=>{
                                let passengers= [];
                                item.item.orderItems.map((i)=>{
                                    passengers.push(i.passengerId.id)
                                })
                                navigation.navigate('RailInfoList',{date:datetime_to_stamp(item.item.startTime),
                                    isChange:true,
                                    start:item.item.startStation,
                                    end:item.item.endStation,
                                    passengers:passengers,
                                    orderId:item.item.orderId
                                })
                            }}
                        >
                            <Text >改签</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.button}
                            onPress={()=>{
                                    let fullData = item.item
                                    fullData["crossDay"] = calCrossDay(item.item.startTime,item.item.endTime);
                                    fullData["useTime"] = calUseTime(item.item.startTime,item.item.endTime);
                                    fullData["status"] = 0;
                                    navigation.navigate("OrderDetail", {"data": fullData,"status":0});
                            }}
                        >
                            <Text>退票</Text>
                        </TouchableOpacity>
                    </View>
                    }
                </View>
            </TouchableOpacity>
        )
    }
    return(
        <View style={{backgroundColor:OTA_COLOR.backgroundColor,flex:1}}>
            {(order.length===0)&&
            <View style={{alignItems:'center',marginTop:0.2*WINDOWS_WIDTH}}>
                <Image source={NothingBlue} style={{
                    resizeMode: "stretch",
                    height: 0.4*WINDOWS_WIDTH,
                    width: 0.6*WINDOWS_WIDTH,
                    //backgroundColor:'red',flexGrow:1
                }}/>
                <Text style={{marginTop:0.025*WINDOWS_WIDTH,fontSize:16}}>没有相关订单信息</Text>
            </View>
            }
            <FlatList data={order}
                      renderItem={renderItem}
                      keyExtractor={(item,index)=>index}/>

        </View>
    )
}
const OrderStatusView = ()=>{
    const [status, setStatus] = useState("A");
    const [order, setOrder] = useState([]);
    const [showModal,setShowModal]=useState(false);
    const refreshing = ()=>{
        const url = BASE_URL+"/getOrderByTime";
        storage.load({key:"userId"}).then(ret=>{
            console.log("bbbb")
            let params = {
                "userId":ret.userid,
                "method":status,
                "startTime":new Date().getTime()
            }
            postByBody(url,params,response=> {
                console.log(response)
                setOrder(response)
            })
        }).catch(err=>{setShowModal(true)})
    }
    useEffect(()=>{
        let subscription = DeviceEventEmitter.addListener('UPDATE_ORDER_STATUS_DATA', refreshing)
        return(()=>{
            subscription.remove();
        })
    })
    useEffect(()=>{
        refreshing();
    },[status,showModal]);
    const tabs = [
        { title: '全部' },
        { title: '未出行' },
        { title: '历史订单' },
    ];
    const changeTab = (tab, index)=>{
        if(index===0) setStatus("A");
        else if(index===1) setStatus("F");
        else if(index===2) setStatus("H");
    }
    return(
        <>
            <StatusBar backgroundColor={'white'}/>
            <View  style={styles.header}>
                <Text style={styles.title}>我的订单</Text>
            </View>
            <Tabs tabs={tabs}
                  initialPage={0}
                  prerenderingSiblingsNumber={0}
                  onChange={changeTab}
                  onTabClick={changeTab}
            >
                    <OrderList order={order} refreshing={refreshing}/>
            </Tabs>
        </>
    )
}
export default OrderStatusView;
const styles = StyleSheet.create({
    card:{
        backgroundColor:'white',
        borderRadius:3,
        marginTop:7,
        marginHorizontal:15,
        flexDirection:"row",
        paddingHorizontal:10,
        paddingBottom:5,
        paddingTop:15,
    },
    button:{
        borderRadius:3,
        borderColor:OTA_COLOR.separatorColor,
        borderWidth:1,
        paddingHorizontal:20,
        paddingVertical:6,
        marginHorizontal:15,
        marginVertical:6,
    },
    header:{
        // elevation:10,
        shadowColor: 'black',
        opacity:1,
        // shadowOpacity:1,
        // shadowOffset:{height:0,width:0},
        backgroundColor:'white',
        width:WINDOWS_WIDTH,
        height:40,
        justifyContent:'center',
        alignItems:'center',
        flexDirection:'row'
    },
    title:{
        fontWeight:'bold',
        fontSize:19
    }
});
