import React, {useEffect, useState} from "react";
import {InputItem, List, Icon, Button, Provider} from '@ant-design/react-native'
import {ScrollView, Text, View, Image, StatusBar} from "react-native";

import {useNavigation} from "@react-navigation/core";
import {Header} from "react-native-elements/dist/header/Header";
import MobileInputItem from "./MobileInputItem";
import {getSms} from "../services/getSms";
import storage from "../storage/Storage";
import {PasswordModify} from "../services/PasswordService";
import {useCavy} from 'cavy';

let pPattern = /^.*(?=.{6,})(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*? ]).*$/;

function PasswordModifyForm (){
    const navigation =useNavigation()
    const [password, setPassword] = useState("")
    const [password2, setPassword2] = useState("")
    const [passwordEmpty, setPasswordEmpty] = useState(false)
    const [passwordPattern, setPasswordPattern] = useState(false)
    const [passwordJudge, setPasswordJudge] = useState(false)
    const [button, setButton] = useState(true)
    const [sms, setSms] = useState("")
    const [time, setTime] = useState(0)
    const [disabled, setDisabled] = useState(false)

    useEffect (() => {
        setTimeout(()=> {
            if(time > 0)
                setTime(time - 1)
            else
                setDisabled(false)
        },1000)
    },[time])

    const passwordBlur = () => {
        setButton(false)
        if(password === "") {
            setPasswordEmpty(true); return
        }
        setPasswordEmpty(false);
        if(pPattern.test(password))
            setPasswordPattern(false)
        else
            setPasswordPattern(true)
        if(password === password2) setPasswordJudge(false)
        else setPasswordJudge(true)
    }

    const passwordJudgeBlur = () => {
        setButton(false)
        if(password === password2) setPasswordJudge(false)
        else setPasswordJudge(true)
    }

    const generateTestHook = useCavy()

    return(
        <Provider>
            <View  style={{backgroundColor: 'rgba(192, 190, 192, 0.1)', flex: 1}}>
                <StatusBar backgroundColor={'rgba(37, 119, 227, 0.8)'}/>
                    <Header
                        leftComponent={{
                            icon: 'left',
                            color: '#fff',
                            type: 'antdesign',
                            onPress: navigation.goBack,
                            iconStyle: {color: '#fff'}
                        }}
                        centerComponent={{
                            text: "修改密码",
                            style: {color: '#fff', textAlignVertical: 'center', fontSize: 18}
                        }}
                        backgroundColor={'#6495ed'}
                    />
                <ScrollView>
                    <List renderHeader={'修改密码'} style={{marginTop: 20}}>
                        <MobileInputItem
                            key={"input1"}
                            error={passwordEmpty || passwordPattern}
                            onErrorClick={passwordEmpty?"此为必填项":"密码格式不正确"}
                            id={"password"}
                            type={"password"}
                            placeholder="请输入新密码"
                            style={{marginLeft: 15}}
                            value={password}
                            onChange={v=>setPassword(v)}
                            onChangeText={v=>setPassword(v)}
                            onBlur={() => {passwordBlur()}}
                            ref={generateTestHook("Modify.Password")}
                        >
                            <Text style={{fontSize: 18, width: 100}}>新  密  码：</Text>
                        </MobileInputItem>
                        <MobileInputItem
                            key={"input2"}
                            value={password2}
                            error={passwordJudge}
                            onErrorClick={"两次密码输入不一致"}
                            id={"confirm"}
                            type={"password"}
                            placeholder="再次输入密码"
                            style={{marginLeft: 15}}
                            onChange={v=>setPassword2(v)}
                            onChangeText={v=>setPassword2(v)}
                            onBlur={() => {passwordJudgeBlur()}}
                            ref={generateTestHook("Modify.Password2")}
                        >
                            <Text style={{fontSize: 18, width: 100}}>密码确认：</Text>
                        </MobileInputItem>
                        {disabled ?
                            <InputItem ref={generateTestHook("Modify.Sms")} key={"input3"} onChange={v=>setSms(v)} extra={
                                <Button type={"primary"} disabled={true} style={{height: 35, width: 130}}>{time}</Button>
                            }>
                            </InputItem>
                            :
                            <InputItem key={"input3"}  onChange={v=>setSms(v)} extra={
                                <Button type={"primary"} style={{height: 35, width: 130}}
                                        ref={generateTestHook("Modify.getSms")}
                                        onPress={() => {
                                            storage.load({key: "userId"})
                                                .then(ret => {
                                                    console.log(ret.userid)
                                                    getSms(ret.userid, setSms, setTime, setDisabled)
                                                })
                                                .catch(error=>console.log(error))
                                        }}>获取验证码</Button>
                            }>
                            </InputItem>
                        }
                    </List>
                    <Button style={{width: 280, height: 45, marginTop: 35, alignSelf: "center"}}
                            type={"primary"}
                            disabled={passwordPattern || passwordJudge || passwordEmpty}
                            onPress={()=>{
                                storage.load({key: "userId"})
                                    .then(ret => {
                                        PasswordModify({id: ret.userid, password: password, Sms: sms}, navigation)
                                    })
                                    .catch(error=>console.log(error))
                            }} ref={generateTestHook("Modify.confirm")}
                    > 确认 </Button>
                </ScrollView>
            </View>
        </Provider>
    )
}

export default PasswordModifyForm;
