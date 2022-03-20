import React, {useState} from "react";
import { Icon } from '@ant-design/react-native'
import {Text, View} from "react-native";
import RegisterForm from "../components/RegisterForm";
import {Header} from "react-native-elements/dist/header/Header";
import {useNavigation} from "@react-navigation/core";

function RegisterView ({setRegister, setModalVisible}){
    const navigation =useNavigation()

    return(
        <View style={{backgroundColor: 'rgba(192, 190, 192, 0.1)', flex: 1}}>
            {/*<Header
                leftComponent={{icon: 'left', color: '#fff', type: 'antdesign',onPress:navigation.goBack, iconStyle: {color: '#fff'} }}


                backgroundColor={'#6495ed'}
            />*/}
            <RegisterForm setRegister={setRegister} setModalVisible={setModalVisible}/>

        </View>
    )
}

export default RegisterView
