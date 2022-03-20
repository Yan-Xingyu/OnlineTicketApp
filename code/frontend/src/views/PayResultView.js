import React, {useEffect, useState} from "react";
import {Icon, Provider} from '@ant-design/react-native'
import {Text, View, Image, Button} from "react-native";
import imgUrl from '../img/alipay.png'
import {useRoute,useNavigation} from "@react-navigation/core";
import item from "react-native-calendars/src/calendar-list/item";
import {useCavy} from 'cavy';

const renderResult = (result) =>{
    let get = []
    console.log("result: ", result)
    if(result.seatTable === undefined) {
        result.first.data.seatTable.map(
            (item,index)=>
                get.push(
                <View key={index} style={{alignSelf:"center" }}>
                    <Text style={{alignSelf:"center" }}>{item.name} </Text>
                    <Text style={{alignSelf:"center" }}>{item.seat}</Text>
                </View>
                )
        )
        result.second.data.seatTable.map(
            (item,index)=>
                get.push(
                    <View key={index} style={{alignSelf:"center" }}>
                        <Text style={{alignSelf:"center" }}>{item.name} </Text>
                        <Text style={{alignSelf:"center" }}>{item.seat}</Text>
                    </View>
                )
        )
        return get
    }
    return result.seatTable.map(
        (item,index)=>
            <View key={index} style={{alignSelf:"center" }}>
                <Text style={{alignSelf:"center" }}>{item.name} </Text>
                <Text style={{alignSelf:"center" }}>{item.seat}</Text>
            </View>
    )
}

function PayResultView (){
    const route = useRoute()
    const navigation = useNavigation()
    const generateTestHook = useCavy()
    useEffect(()=>{
        //setTimeout(()=>{navigation.navigate('Home')},600)
    })
    const [result,setResult] =useState(route.params.result)
    return(
        <Provider>
            <View  style={{backgroundColor: 'rgba(192, 190, 192, 0.1)', flex: 1}}>
                <View style={{backgroundColor: 'rgba(37, 119, 227, 0.8)', height: 50}}>

                </View>
                <Image source={imgUrl} style={{marginTop: 30, alignSelf: "center", width: 80, height: 80}}/>
                {
                    route.params.success>0?<>
                    <Text style={{alignSelf: "center", marginTop: 10, fontSize: 15, color: 'rgba(37, 119, 227, 0.8)'}}>支付成功</Text>


                    </>:<>
                        <Text style={{alignSelf: "center", marginTop: 10, fontSize: 15, color: 'rgba(37, 119, 227, 0.8)'}}>消费失败</Text>
                        <Text style={{alignSelf: "center", marginTop: 10, fontSize: 30, fontWeight: "bold"}}>{route.params.message}</Text>
                    </>
                }
                <View>
                    {renderResult(result)}
                </View>

                <Button title={"确定"} ref={generateTestHook("PayResult.confirm")} onPress={()=>navigation.navigate('Home',{
                    fromPay:true
                })} />

            </View>
        </Provider>
    )
}

export default PayResultView;
