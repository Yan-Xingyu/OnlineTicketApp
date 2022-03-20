import React, {useState} from "react";
import {InputItem, List, Icon, Button, Provider} from '@ant-design/react-native'
import {ScrollView, Text, View, Image, StatusBar} from "react-native";
import imgUrl from '../img/train.png'
import {login} from "../services/LoginService";
import storage from '../storage/Storage';

import {useNavigation} from "@react-navigation/core";
import {Header} from "react-native-elements/dist/header/Header";
import {useCavy} from 'cavy';


function LoginForm ({setAsk, setRegister, modalVisible, setModalVisible, judge, setCurrentTab}){
    const navigation =useNavigation()
    const generateTestHook = useCavy()
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    return(
        <Provider>
            <View  style={{backgroundColor: 'rgba(192, 190, 192, 0.1)', flex: 1}}>
                <StatusBar backgroundColor={'rgba(37, 119, 227, 0.8)'}/>
                {judge ?
                    <Header
                        leftComponent={{
                            icon: 'left',
                            color: '#fff',
                            type: 'antdesign',
                            onPress: ()=>setCurrentTab("Home"),
                            iconStyle: {color: '#fff'}
                        }}
                        centerComponent={{
                            text: "登陆",
                            style: {color: '#fff', textAlignVertical: 'center', fontSize: 18}
                        }}
                        backgroundColor={'#6495ed'}
                    />
                    :
                    <Header
                        leftComponent={{
                            icon: 'left',
                            color: '#fff',
                            type: 'antdesign',
                            onPress: navigation.goBack,
                            iconStyle: {color: '#fff'}
                        }}
                        centerComponent={{
                            text: "登陆",
                            style: {color: '#fff', textAlignVertical: 'center', fontSize: 18}
                        }}
                        backgroundColor={'#6495ed'}
                    />
                }
                <ScrollView>
                    <Image source={imgUrl} style={{width: 80, height: 80, marginTop: 30, alignSelf: 'center'}}/>
                    <Text style={{marginTop: 10, fontSize: 25, alignSelf: "center"}}>欢迎登陆</Text>
                    <List renderHeader={'账号登陆'} style={{marginTop: 20}}>
                        <InputItem
                            ref={generateTestHook("Login.Username")}
                            autoCapitalize={'none'}
                            value={username}
                            placeholder="不区分大小写"
                            style={{marginLeft: 15}}
                            onChange={v=>setUsername(v)}
                            onChangeText={v=>setUsername(v)}
                        >
                            <Text style={{fontSize: 18, width: 100}}>用 户 名：</Text>
                        </InputItem>
                        <InputItem
                            value={password}
                            ref={generateTestHook("Login.Password")}
                            type={"password"}
                            placeholder="密码条件"
                            style={{marginLeft: 15}}
                            onChange={v=>setPassword(v)}
                            onChangeText={v=>setPassword(v)}
                        >
                            <Text style={{fontSize: 18, width: 100}}>密      码：</Text>
                        </InputItem>
                    </List>
                    <Button style={{width: 280, height: 45, marginTop: 35, alignSelf: "center"}}
                            type={"primary"} ref={generateTestHook("Login.confirm")}
                            onPress={()=>{login({username: username, password: password}, modalVisible, setModalVisible)}}
                    > 登陆 </Button>
                    <Button style={{width: 280, height: 45, marginTop: 15, alignSelf: "center"}}
                            onPress={()=>setRegister(true)} ref={generateTestHook("Register")}
                    > 注册 </Button>
                    <Button style={{width: 150, height: 25, marginTop: 15, alignSelf: "center"}}
                            type={"ghost"} onPress={()=>setAsk(true)} ref={generateTestHook("PasswordAsk")}> 忘记密码？ </Button>
                </ScrollView>
            </View>
        </Provider>
    )
}

export default LoginForm;
