import React from 'react'
import {Card, WingBlank} from "@ant-design/react-native";

import {Text, View} from "react-native";
import AntDesign from "react-native-vector-icons/AntDesign";
import EvilIcons from "react-native-vector-icons/EvilIcons";

import FontAwesome from "react-native-vector-icons/FontAwesome";
import Ionicons from "react-native-vector-icons/Ionicons";
import {useNavigation} from "@react-navigation/native";
import {useCavy} from 'cavy';

export default function RailGuideCard() {
    const navigation = useNavigation()
    const generateTestHook = useCavy()

    return (
        <WingBlank size={'md'} style={{marginTop: 20}}>
            <Card>
                <Card.Header title="常用功能" style={{fontSize: 2}}/>
                <Card.Body>
                    <View style={{flexDirection: 'row'}}>
                        <View style={{flex: 1}}>
                            <EvilIcons name={"lock"} size={30} style={{alignSelf: 'center'}}/>
                            <Text style={{fontSize: 11, alignSelf: 'center'}}>修改密码</Text>
                        </View>
                        <View style={{flex: 1}}>
                            <EvilIcons name={"envelope"} size={30} style={{alignSelf: 'center'}}
                                onPress={()=>navigation.navigate("PasswordModify")} ref={generateTestHook("User.ModifyPassword")}/>
                            <Text style={{fontSize: 11, alignSelf: 'center'}}>修改密码</Text>
                        </View>
                        <View style={{flex: 1}}>
                            <Ionicons name={"phone-portrait-outline"} size={22} style={{alignSelf: 'center'}}/>
                            <Text style={{fontSize: 11, alignSelf: 'center'}}>修改密码</Text>
                        </View>
                    </View>
                </Card.Body>
            </Card>
        </WingBlank>


    )
}
