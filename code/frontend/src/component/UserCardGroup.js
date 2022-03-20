import React, {Component, createRef, useRef, useState} from 'react';
import {Card, Flex, WingBlank} from "@ant-design/react-native";
import {Text, TouchableHighlight, View} from "react-native";
import Entypo from "react-native-vector-icons/Entypo";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import {useCavy} from 'cavy';
import storage from '../storage/Storage';

export default function UserCardGroup({navigation, setCurrentTab, setVisible}) {
    const generateTestHook = useCavy()

    const handleClick = () => {
        storage.load({key: "userId"})
            .then( ret => {
                navigation.navigate('OrderStatus');
                setCurrentTab("Order")
            })
            .catch(err => {
                setVisible(true)
            })
    }

    return (
        <WingBlank size="md">
            <Card style={{marginTop: 25, height: 80}}>
                <Card.Body style={{flexDirection: 'row'}}>
                    <View style={{flex: 1}}>
                        <Entypo name={"v-card"} style={{alignSelf: 'center'}} size={33} color={'#8fc5e8'}/>
                        <Text style={{alignSelf: 'center', fontSize: 11}}>乘车人</Text>
                    </View>
                    <View style={{flex: 1}}>
                        <FontAwesome name={"list-alt"} style={{alignSelf: 'center'}} size={33} color={'#8fc5e8'} onPress={()=>{
                            handleClick()
                        }}/>
                        <Text style={{alignSelf: 'center', fontSize: 11}}>我的订单</Text>
                    </View>
                        <View style={{flex: 1}} >
                            <Entypo name={"user"} style={{alignSelf: 'center'}} size={33}
                                    onPress={()=>navigation.navigate('UserInformation')}
                                    color={'#8fc5e8'} ref={generateTestHook("Tab.User.UserInfo")}/>
                            <Text style={{alignSelf: 'center', fontSize: 11}}>个人信息</Text>
                        </View>
                </Card.Body>
            </Card>

        </WingBlank>
    )
}
