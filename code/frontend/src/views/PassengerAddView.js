import React from 'react'
import {Text, View} from "react-native";
import {Icon} from "@ant-design/react-native";
import UserInfoForm from "../components/UserInfoForm";
import {Header} from "react-native-elements/dist/header/Header";
import {useNavigation} from "@react-navigation/core";

function PassengerAddView (){
    const navigation=useNavigation();
    return(
        <View  style={{backgroundColor: 'rgba(192, 190, 192, 0.1)', flex: 1}}>
           {/* <View style={{backgroundColor: 'rgba(37, 119, 227, 0.8)', height: 50}}>
                <Icon name={"left"} style={{marginTop: 15, marginLeft: 20}}/>
            </View>*/}
            <Header
                leftComponent={{icon: 'left', color: '#fff', type: 'antdesign',onPress:navigation.goBack, iconStyle: {color: '#fff'} }}

                rightComponent={<Text
                    style={{color: '#fff', textAlignVertical: 'center', fontSize: 16}}>购票须知</Text>}
                backgroundColor={'#6495ed'}
            />
            <UserInfoForm />
        </View>
    )
}

export default PassengerAddView
