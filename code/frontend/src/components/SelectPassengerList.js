import React, { useLayoutEffect, useState} from "react";
import {PassengerGet} from "../services/PassengerGet";
import CheckBox from "react-native-check-box";
import {List, Icon, Button, Provider} from '@ant-design/react-native'
import {ScrollView, Text, TouchableHighlight, View} from "react-native";
import {useNavigation, useRoute} from "@react-navigation/core";
import storage from "../storage/Storage";
import {useCavy} from 'cavy';

function handleClick(rowidx, checked, setChecked){
    checked[rowidx] = !checked[rowidx]
    let tmp = []
    checked.map((row, rowidx)=>{
        if(row === true)
            tmp.push(true)
        else
            tmp.push(false)
    })
    setChecked(tmp)
}

function renderList(route, list, checked, setChecked, navigation){
    const generateTestHook = useCavy()

    let result = []
    list.map((row, rowidx)=>{
        console.log(rowidx)
        result.push(
            <List.Item key={rowidx}>
                <View style={{flexDirection: "row"}}>
                    <TouchableHighlight
                        style={{alignItems: "center",
                            padding: 1}}
                        activeOpacity={0.6}
                        underlayColor={"white"}
                        onPress={() => navigation.push('PassengerAdd', {info: row, date:route.params.date, trainId: route.params.trainId, start_no: route.params.start_no, end_no: route.params.end_no})}>
                        <Icon name={"edit"} style={{marginTop: 10}}/>
                    </TouchableHighlight>
                    <View style={{flexDirection: "column"}}>
                        <View style={{flexDirection: "row"}}>
                            <Text style={{fontSize: 20, marginLeft: 15}}>{row.real_name}</Text>
                            <Text style={{marginLeft: 5, marginTop: 5, color: "grey"}}>{row.type === 0? "成人票" : "学生票"}</Text>
                        </View>
                        <Text style={{color: "grey", marginTop: 5, marginLeft: 15}}>二代身份证 {row.card_id}</Text>
                    </View>
                    <CheckBox ref={generateTestHook("Passenger"+rowidx)} style={{marginTop: 15, marginLeft: '90%', position: 'absolute'}} isChecked={ checked[rowidx] } onClick={()=>handleClick(rowidx, checked, setChecked)}/>
                </View>
            </List.Item>
        )
    })
    console.log(list)
    return result
}


function SelectPassengerList () {
    const [passengers, setPassengers] = useState([])
    const [watch] = useState('')
    const [checked, setChecked] = useState([])
    const navigation = useNavigation();
    const route = useRoute()
    const generateTestHook = useCavy()

    useLayoutEffect(()=>{
        storage.load({key: "userId"})
            .then(ret => {
                PassengerGet(ret.userid, setPassengers, route.params, setChecked)
            }).catch(err=>console.log(err))
    }, [watch])
    console.log("Transit",route.params)
    return(
        <Provider>
            <ScrollView>
                <Button type={"primary"} style={{width: 200, alignSelf: "center", marginTop: 15, height: 30}}
                        ref={generateTestHook("PassengerAdd")} onPress={()=>{
                            if (route.params.fromTransit)
                                navigation.push('PassengerAdd',
                                    {
                                        date:route.params.date,
                                        firstTrainId:route.params.firstTrainId,
                                        secondTrainId:route.params.secondTrainId,
                                        firstStartNo:route.params.firstStartNo,
                                        secondStartNo:route.params.secondStartNo,
                                        firstEndNo:route.params.firstEndNo,
                                        secondEndNo:route.params.secondEndNo,
                                        isChange:route.params.isChange,
                                        orderId:route.params.orderId,
                                        isOneWay:route.params.isOneWay,
                                        fromTransit:true
                                    })


                            navigation.push('PassengerAdd',{date:route.params.date, trainId: route.params.trainId, start_no: route.params.start_no, end_no: route.params.end_no})}}
                >
                    <Text style={{fontSize: 15}}>新增乘客</Text>
                </Button>
                <List style={{marginTop: 20}}>
                    {renderList(route, passengers, checked, setChecked, navigation)}
                </List>
            </ScrollView>
            <View>
                <Button style={{alignSelf: "center", width: '80%', marginBottom: 40}} ref={generateTestHook("PassengerSelect.confirm")} onPress={() =>
                {
                    if (!route.params.fromTransit)
                    navigation.push("Purchase", {passengers: passengers, checked: checked, num: 1,date:route.params.date, trainId: route.params.trainId, start_no: route.params.start_no, end_no: route.params.end_no})
                    else navigation.push("Transit",
                        {passengers: passengers,
                            checked: checked,
                            num: 1,
                            date:route.params.date,
                            firstTrainId: route.params.firstTrainId,
                            firstStartNo:route.params.firstStartNo,
                            firstEndNo:route.params.firstEndNo,
                            secondTrainId: route.params.secondTrainId,
                            secondStartNo:route.params.secondStartNo,
                            secondEndNo:route.params.secondEndNo,
                            isPassBy: true
                        })

                }} type={"primary"}>确认</Button>
            </View>
        </Provider>
    )
}
export default SelectPassengerList;
