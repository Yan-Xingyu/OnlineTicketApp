import React, {useEffect, useState} from "react";
import {
    StyleSheet, Text, View, FlatList, StatusBar, TouchableOpacity, Modal, BackHandler, DeviceEventEmitter
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {WINDOWS_WIDTH, WINDOWS_HEIGHT, OTA_COLOR, BASE_URL} from "../constants/Constants";
import {useRoute} from "@react-navigation/core";
import {useNavigation} from "@react-navigation/native";
import {calPrice, seat2str, calSeat, calCrossDay, calUseTime} from "../utils/OrderUtil"
import {datetime_to_stamp} from "../utils/HandleDate";
import {postByParam} from "../utils/Ajax";
import {ProgressBar} from "@react-native-community/progress-bar-android";
import {purchase,changeTicket} from "../services/TicketService";
const color = OTA_COLOR;
const PageHeader = ({goBack,status})=>{

    return(
        <>
            {(status>0)&&<View style={{height:StatusBar.currentHeight,backgroundColor:'transparent'}}/>}
            <View style={styles.header} >
                <TouchableOpacity onPress={goBack}>
                    <AntDesign name={"arrowleft"} size={30} color={'white'} />
                </TouchableOpacity>
                <Text style={styles.title}>订单详情</Text>
                <AntDesign name={"arrowleft"} size={30} color={color.themeColor} />
            </View>
        </>

    )
}
const PersonInfo = ({item,trainType})=>{
    return(
        <View style={{flexDirection: 'column',width:0.9*WINDOWS_WIDTH,marginTop:10}}>
            <View style={{justify:'between',flexDirection: 'row',width:0.9*WINDOWS_WIDTH,marginBottom:5}}>
                <Text style={{flex:1,fontWeight:'bold',fontSize:16}}>
                    {item.passengerId.real_name}
                    <Text style={{fontSize:12,color:'grey',flex:3,fontWeight:'normal'}}>{(item.orderType)?"学生票":"成人票"}</Text>
                </Text>
                <Text style={{color:'grey',textAlign: 'right',flex:1}}>{calSeat(item.seatType,item.seatPosition)}</Text>
            </View>
            <View style={{justify:'between',flexDirection: 'row',width:0.9*WINDOWS_WIDTH}}>
                <Text style={{flex:2,color:'grey',textAlign: 'left'}}>二代身份证{item.passengerId.card_id}</Text>
                <Text style={{flex:1,color:'grey',textAlign: 'right'}}>{seat2str(item.seatType,trainType)} ￥{item.seatPrice.toFixed(2)}</Text>
            </View>
        </View>
    )
}

const TicketInfo = ({ticket})=>{
    return(
        <>
            <View style={styles.ticketWrapper}>
                <View style={styles.columnFlexWrapper}>
                    <Text style={[{fontSize:15},styles.centerText]}>{ticket.startStation}</Text>
                    <Text style={[{fontSize:22},styles.centerText]}>{ticket.startTime.substring(11,16)}</Text>
                </View>
                <View style={[styles.columnFlexWrapper,{alignItems: 'center'}]}>
                    <Text style={[{fontSize:15},styles.centerText]}>{ticket.trainTag}</Text>
                    <MaterialIcons name={"directions-railway"} size={30} color={'rgb(148,170,211)'} />
                    <Text style={[{fontSize:10},styles.centerText]}>{ticket.useTime}</Text>
                </View>
                <View style={[styles.columnFlexWrapper,{alignItems: 'center'}]}>
                    <Text style={[{fontSize:15},styles.centerText]}>{ticket.endStation}</Text>
                    <View style={[styles.rowFlexWrapper]}>
                        <Text style={[{fontSize:22},styles.centerText]}>{ticket.endTime.substring(11,16)}</Text>
                        {(ticket.crossDay>0)&&
                            <Text style={{fontSize: 10,color:'white'}}>
                                +{ticket.crossDay}天
                            </Text>
                        }
                    </View>
                </View>
            </View>
            <View style={styles.rowFlexWrapper}>
                <Text style={[styles.bottomText,{textAlign:'left'}]}>发车时间：{ticket.startTime.substring(0,10)}</Text>
            </View>
        </>
    )
}
const ToolBar = ({cancelOrder,modifyOrder})=>{
    const tools = ["退票",null,"改签"];
    return (
        <View style={styles.toolBar}>
            {tools.map((tool,index)=> {
                    return(
                        (tool)?
                            <TouchableOpacity key={index} style={{flex: 1}}
                                              onPress={()=>{
                                                  if(tool === "退票")
                                                    cancelOrder();
                                                  else if(tool==="改签")
                                                    modifyOrder();
                                              }}
                            >
                                <Text style={styles.toolBarButton}>
                                    {tool}
                                </Text>
                            </TouchableOpacity>:
                            <View key={index} style={styles.separator_v}/>
                    )
                }
            )}
        </View>
    )
}
const ModalPage = ({giveOrder,status,params})=>{
    const navigation = useNavigation();
    const [processing,setProcessing] = useState(true);
    const [loop,setLoop] = useState(0);
    const [order,setOrder] = useState(giveOrder);
    useEffect(()=>{
        if(status === 0) cancelOrder();
        else if(status === 1 || status === 2) purchaseOrder();
        else setProcessing(false);
    },[])
    useEffect(()=>{
        if(processing === false) {
            setLoop(0);
            return;
        }
        setTimeout(()=>{
            if(loop === 3) setLoop(0);
            else setLoop(loop+1);
        },500)
    },[loop])
    const purchaseOrder = ()=>{
        setProcessing(true);
        const callback = (response)=>{
            if(response.status!==200) {
                alert(response.message);
                navigation.navigate("Home");
            }
            else{
                postByParam(BASE_URL+"/findOrderById",{"orderId":response.data.orderId},(ret)=>{
                    setOrder(ret);
                    DeviceEventEmitter.emit("STOP_LOADING")
                    setProcessing(false);
                })
            }

        };
        if(status === 1)
            purchase(params.userid, params.trainId, params.start_no, params.end_no, params.data, callback);
        else if(status === 2)
            changeTicket(params.userid, params.trainId, params.start_no, params.end_no, params.data, params.orderId,callback)
    }
    const cancelOrder = ()=>{
        setProcessing(true);
        postByParam(BASE_URL+"/cancelOrder",{"orderId":order.orderId},_=> {
            let newOrder = order;
            newOrder["status"]=0;
            setOrder(newOrder);
            DeviceEventEmitter.emit("STOP_LOADING")
            DeviceEventEmitter.emit('UPDATE_ORDER_DATA')
            setProcessing(false);


        })
    }
    const modifyOrder = ()=>{
        let passengers= [];
        order.orderItems.map((item)=>{
            passengers.push(item.passengerId.id)
        })
        console.log("ids"+passengers)
        navigation.navigate('RailInfoList',{date:datetime_to_stamp(order.startTime),
            isChange:true,
            start:order.startStation,
            end:order.endStation,
            passengers:passengers,
            orderId:order.orderId
        })
    }
    const getStatus = (orderStatus)=>{
        if(processing)
            return(
                <View style={{marginRight:30}}>
                    <ProgressBar styleAttr='Inverse' color={'grey'} style={{width: 30}}/>
                    <Text style={{color:'grey', fontSize: 16}}>正在处理{".".repeat(loop)}</Text>
                </View>
            )
        if(status === -1)
        {
            if(orderStatus===0) return <Text style={[{fontSize:16,color:'grey',marginRight:30}]}>已退票</Text>;
            else if(orderStatus===1) return <Text style={[{fontSize:16,color:'grey',marginRight:30}]}>已出票</Text>;
            else if(orderStatus===2) return <Text style={[{fontSize:16,color:'grey',marginRight:30}]}>已改签</Text>;
        }
        else if(status === 0) return <Text style={[{fontSize:16,color:'grey',marginRight:30}]}>退票成功</Text>;
        else if(status === 1) return <Text style={[{fontSize:16,color:'grey',marginRight:30}]}>购票成功</Text>;
        else if(status === 2) return <Text style={[{fontSize:16,color:'grey',marginRight:30}]}>改签成功</Text>;
    }
    return(
         <View style={styles.contentContainer}>
            <View style={{flexDirection:'row',justifyContent:'space-between',width:WINDOWS_WIDTH,alignItems:'center'}}>
                <View style={styles.priceText}>
                    <Text style={[{fontWeight:'bold',fontSize:22,color:color.themeColor,marginTop:10},]}>
                        总额￥{(status <= 0 ||processing ===false)?calPrice(order.orderItems).toFixed(2):"——"}
                    </Text>
                    <Text style={[{fontSize:12,color:'rgb(200,200,200)'}]}>下单时间 {order.orderTime}</Text>
                </View>
                {getStatus(order.status)}
            </View>
            <View style={styles.separator_h}/>

             {(status <= 0 || !processing) && <FlatList
                 data={order.orderItems}
                 renderItem={({item}) => <PersonInfo item={item} trainType={order.trainType}/>}
                 keyExtractor={item => item.id}
                 style={{flexGrow: 0, width: 0.9 * WINDOWS_WIDTH, marginBottom: 15}}
             />}

            {order.status?<ToolBar cancelOrder={cancelOrder} modifyOrder={modifyOrder}/>:null}
         </View>
    )
};
const ProcessingView = ({initialStatus})=>{
    const [ready,setReady] = useState(true);
    const [status,setStatus] = useState(-1);
    const [loop,setLoop] = useState(0);
    const stop = ()=>{
        setReady(false);
        setTimeout(()=>{
            setStatus(-1);
        },700)
    }
    useEffect(()=> {
        setStatus(initialStatus);
    },[])
    useEffect(()=>{
        if(ready === false) {
            setLoop(0);
            return;
        }
        setTimeout(()=>{
            if(loop === 3) setLoop(0);
            else setLoop(loop+1);
        },500)
    },[loop])
    useEffect(()=>{
        let subscription = DeviceEventEmitter.addListener('STOP_LOADING', stop)
        return(()=>{
            subscription.remove();
        })
    })
    const getStatusString = ()=>{
        if(ready) return "正在处理";
        else if(status === 0) return "退票成功";
        else if(status === 1) return "购票成功";
        else if(status === 2) return "改签成功";
    }
        return(
            <Modal
                   transparent={true}
                   presentationStyle={"overFullScreen"}
                   visible={(status>=0)}
                 >
                <View style={{width:WINDOWS_WIDTH,height:WINDOWS_HEIGHT,justifyContent:'center',alignItems:'center',backgroundColor:'rgba(0,0,0,0.3)'}}>
                    <View style={{position:'relative',bottom:0.02*WINDOWS_HEIGHT,flexDirection:'row',width:0.4*WINDOWS_WIDTH,height:0.1*WINDOWS_HEIGHT,backgroundColor:'rgba(0,0,0,0)',alignItems:'center',justifyContent:'center'}}>
                        {ready&&<ProgressBar styleAttr='Inverse' color={'rgba(255,255,255,0.9)'} style={{width: 30}}/>}
                        <Text style={{color: 'white', fontSize: 24}}>{getStatusString()}{".".repeat(loop)}</Text>
                    </View>
                </View>
            </Modal>
        )
}
const OrderDetailView = ({navigation})=>{
    const {data,status,fromWhere,params} = useRoute().params
    const [from,setFrom] = useState(fromWhere)
    console.log(data);
    useEffect(()=>{
        const backHandler = BackHandler.addEventListener("hardwareBackPress",()=>{
            goBack();
            return true;
        })
        return(()=>backHandler.remove())
    })
    const goBack=()=>{
        if(from==="order") {DeviceEventEmitter.emit("UPDATE_ORDER_DATA");navigation.goBack();}
        else if(from === "orderStatus") navigation.navigate("OrderStatus");
        else navigation.navigate("Home");
    }
    return(
        <View style={styles.pageWrapper}>
            <StatusBar backgroundColor={color.themeColor}/>
            <PageHeader goBack={goBack} status={status}/>
            <TicketInfo ticket={data}/>
            <ProcessingView initialStatus={status}/>
            <ModalPage giveOrder={data} status={status} params={(status>=1)?params:null}/>
        </View>
    )
};
const styles = StyleSheet.create({
    header:{
        padding:10,
        flex:1,
        flexDirection:'row',
        maxHeight:50,
        justifyContent:"space-between",
    },
    title:{
        flex:1,
        color:'white',
        textAlign: 'center',
        fontSize:22
    },

    centerText:{
        textAlign:'center',
        color:'white',
    },
    bottomText:{
        fontSize:12,
        color:'white',
        marginLeft: 20,
    },
    pageWrapper:{
        flex:1,
        backgroundColor:color.themeColor,//"rgb(245,245,245)",
    },
    ticketWrapper:{
        marginTop:0.03*WINDOWS_HEIGHT,
        flex:1,
        flexDirection: 'row',
        justifyContent:'flex-start',
        marginRight:0.15*WINDOWS_WIDTH,
        marginLeft: 0.15*WINDOWS_WIDTH,
        maxHeight:0.1*WINDOWS_HEIGHT,
    },
    priceText:{
        textAlign: 'left',
        marginLeft: 0.05*WINDOWS_WIDTH,
    },
    contentContainer:{
        position: "absolute",
        left: 0,
        bottom: 0,
        width: WINDOWS_WIDTH,
        minHeight:0.76*WINDOWS_HEIGHT,
        flex: 1,
        flexDirection: "column",
        alignItems: 'center',
        backgroundColor: color.backgroundColor,
        borderTopStartRadius:20,
        borderTopEndRadius:20,
    },
    toolBar:{
        flexDirection: 'row',
        marginTop:0.01*WINDOWS_HEIGHT
    },
    toolBarButton:{
        textAlign: "center",
        paddingLeft: 0.01*WINDOWS_WIDTH,
        paddingRight: 0.01*WINDOWS_WIDTH,
        fontSize:14,
        color:color.themeColor
    },
    separator_h:{
        height: 0,
        width:0.97*WINDOWS_WIDTH,
        borderTopWidth: 1,
        borderColor: color.separatorColor,
        opacity: 1,
        marginTop: 10
    },
    separator_v:{
        width:0,
        height:20,
        borderLeftWidth:1,
        borderColor: color.separatorColor,
        opacity: 1,
        textAlignVertical:'center',
    },
    columnFlexWrapper:{
        flex:1,
        flexDirection:'column',
    },
    rowFlexWrapper:{
        flexDirection: 'row',
    },
});
export default OrderDetailView;
