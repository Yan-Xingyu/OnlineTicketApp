import React, {useEffect, useState} from "react";
import {InputItem, List,  Button, Provider} from '@ant-design/react-native'
import {ScrollView, Text, View, StatusBar} from "react-native";

import {useNavigation} from "@react-navigation/core";
import {Header} from "react-native-elements/dist/header/Header";
import MobileInputItem from "./MobileInputItem";
import {getSms, getSmsAsk} from "../services/getSms";
import storage from "../storage/Storage";
import {PasswordAsk, PasswordModify} from "../services/PasswordService";
import {JudgeE_mail, JudgeUsername} from "../services/JudgeUsername";
import {useCavy} from 'cavy';

let pPattern = /^.*(?=.{6,})(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*? ]).*$/;
let emailPattern =/^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/;

function PasswordAskForm ({setAsk}){
    const [password, setPassword] = useState("")
    const [password2, setPassword2] = useState("")
    const [passwordEmpty, setPasswordEmpty] = useState(false)
    const [passwordPattern, setPasswordPattern] = useState(false)
    const [passwordJudge, setPasswordJudge] = useState(false)
    const [button, setButton] = useState(true)
    const [sms, setSms] = useState("")
    const [time, setTime] = useState(0)
    const [disabled, setDisabled] = useState(false)
    const [e_mail, setE_mail] = useState("")
    const [e_mailEmpty, setE_mailEmpty] = useState(false)
    const [e_mailPattern, setE_mailPattern] = useState(false)
    const [nameEmpty, setNameEmpty] = useState(false)
    const [username, setUsername] = useState("")
    const generateTestHook = useCavy()

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

    const E_mailBlur = () => {
        if(e_mail === "")
            setE_mailEmpty(true)
        else
            setE_mailEmpty(false)
        if(e_mail !== "" && emailPattern.test(e_mail) || e_mail === ""){
            setE_mailPattern(false)
        }
        else setE_mailPattern(true)
    }

    const UsernameBlur = () => {
        if(username === "")
            setNameEmpty(true)
        else
            setNameEmpty(false)
    }

    return(
        <Provider>
            <View  style={{backgroundColor: 'rgba(192, 190, 192, 0.1)', flex: 1}}>
                <StatusBar backgroundColor={'rgba(37, 119, 227, 0.8)'}/>
                <Header
                    leftComponent={{
                        icon: 'left',
                        color: '#fff',
                        type: 'antdesign',
                        onPress: ()=>{setAsk(false)},
                        iconStyle: {color: '#fff'}
                    }}
                    centerComponent={{
                        text: "找回密码",
                        style: {color: '#fff', textAlignVertical: 'center', fontSize: 18}
                    }}
                    backgroundColor={'#6495ed'}
                />
                <ScrollView>
                    <List renderHeader={'找回密码'} style={{marginTop: 20}}>
                        <MobileInputItem
                            key={"username"}
                            value={username}
                            error={nameEmpty}
                            onErrorClick={"此为必填项"}
                            placeholder="请输入注册的用户名"
                            style={{marginLeft: 15}}
                            onBlur={() => {UsernameBlur()}}
                            onChange={v => setUsername(v)}
                            onChangeText={v => setUsername(v)}
                            ref={generateTestHook("PasswordAsk.Username")}
                        >
                            <Text style={{fontSize: 18, width: 100}}>用 户 名：</Text>
                        </MobileInputItem>
                        <MobileInputItem
                            value={e_mail}
                            key={"email"}
                            error={e_mailEmpty || e_mailPattern}
                            onErrorClick={e_mailEmpty?"此为必填项":"邮箱格式不正确"}
                            placeholder="请输入注册的电子邮箱"
                            style={{marginLeft: 15}}
                            onChange={v => setE_mail(v)}
                            onChangeText={v => setE_mail(v)}
                            onBlur={() => {
                                E_mailBlur()
                            }}
                            ref={generateTestHook("PasswordAsk.E_mail")}
                        >
                            <Text style={{fontSize: 18, width: 100}}>电子邮箱：</Text>
                        </MobileInputItem>
                        <MobileInputItem
                            value={password}
                            key={"input1"}
                            error={passwordEmpty || passwordPattern}
                            onErrorClick={passwordEmpty?"此为必填项":"密码格式不正确"}
                            id={"password"}
                            type={"password"}
                            placeholder="请输入新密码"
                            style={{marginLeft: 15}}
                            onChange={v=>setPassword(v)}
                            onChangeText={v=>setPassword(v)}
                            onBlur={() => {passwordBlur()}}
                            ref={generateTestHook("PasswordAsk.Password")}
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
                            ref={generateTestHook("PasswordAsk.Password2")}
                        >
                            <Text style={{fontSize: 18, width: 100}}>密码确认：</Text>
                        </MobileInputItem>
                        {disabled ?
                            <InputItem key={"input3"} onChange={v=>setSms(v)} extra={
                                <Button type={"primary"} disabled={true} style={{height: 35, width: 130}}>{time}</Button>
                            }>
                            </InputItem>
                            :
                            <InputItem key={"input3"}  onChange={v=>setSms(v)} extra={
                                <Button type={"primary"} style={{height: 35, width: 130}}
                                        onPress={() => {
                                            getSmsAsk({username: username, e_mail: e_mail}, setSms, setTime, setDisabled)
                                        }} ref={generateTestHook("PasswordAsk.getSms")}>获取验证码</Button>
                            }>
                            </InputItem>
                        }
                    </List>
                    <Button style={{width: 280, height: 45, marginTop: 35, alignSelf: "center"}}
                            type={"primary"}
                            disabled={nameEmpty || passwordPattern || passwordJudge || passwordEmpty || e_mailPattern || e_mailEmpty}
                            onPress={() => {
                                PasswordAsk({username: username, password: password, Sms: sms, e_mail: e_mail}, setAsk)
                            }} ref={generateTestHook("PasswordAsk.confirm")}
                    > 确认 </Button>
                </ScrollView>
            </View>
        </Provider>
    )
}

export default PasswordAskForm;
