import React, {useEffect, useState, } from 'react';
import {StatusBar, StyleSheet, Text, View,DeviceEventEmitter} from 'react-native'
import {BASE_URL, OTA_COLOR, WINDOWS_WIDTH} from "../constants/Constants";
import {postByBody, postByParam} from "../utils/Ajax";
import MyTimeLine from "../components/MyTimeLine";
import storage from "../storage/Storage";
import LoginModal from "./LoginView";

const color = OTA_COLOR;

const OrderView = ({setCurrentTab}) => {
    const [order,setOrder] = useState([]);
    const [showModal,setShowModal]=useState(false);
    useEffect(()=>{
        getData()
    },[showModal])
    useEffect(()=>{
        let subscription = DeviceEventEmitter.addListener('UPDATE_ORDER_DATA', getData)
        return(()=>{
            subscription.remove();
        })
    })
    const getData = ()=>{
        const url = BASE_URL+"/getOrderByTime";
        storage.load({key:"userId"}).then(ret=>{
            console.log(ret.userid);
            let params = {
                "userId":ret.userid,
                "method":"A",
                "startTime":new Date().getTime()
            }
            postByBody(url,params,response=> {
                setOrder(response)
                console.log()
                console.log(order);
            })
        }).catch(err=>{setShowModal(true)})
    }
    return (
        <>
            <StatusBar backgroundColor={'white'}/>
            <LoginModal judge={true} modalVisible={showModal} setModalVisible={setShowModal} setCurrentTab={setCurrentTab}/>
            <View  style={styles.header}>
                <Text style={styles.title}>未出行订单</Text>
            </View>
            <MyTimeLine data={order} />
        </>
    );
};
const styles = StyleSheet.create({
    tab: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: color.backgroundColor,
    },
    header:{
        elevation:10,
        shadowColor: 'black',
        opacity:1,
        shadowOpacity:1,
        shadowOffset:{height:0,width:0},
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
})
export default OrderView;
