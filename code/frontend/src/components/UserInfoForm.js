import React, {useState, useEffect} from "react";
import MobileInputItem from "./MobileInputItem";
import {List, Button, Provider, Picker} from '@ant-design/react-native'
import {ScrollView, Text} from "react-native";
import {useNavigation, useRoute} from "@react-navigation/core";
import {PassengerAdd} from "../services/PassengerAdd";
import storage from "../storage/Storage";
import {PassengerModify} from "../services/PassengerModify";
import {useCavy} from 'cavy';

const card_type = [{value: "二代身份证", label: "二代身份证"}]
const type = [{value: 0, label: "学生票"}, {value: 1, label: "成人票"}]
const user_id = storage.load({key: "userId"}).catch(error => console.log(error))

let cPattern = /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/;
let mPattern = /^((13[0-9])|(14[5|7])|(15([0-3]|[5-9]))|(18[0,5-9]))\d{8}$/;

function handleClick(route, data, navigation){
    storage.load({key: "userId"})
        .then(ret => {
            console.log(ret)
            route.params.info === undefined? PassengerAdd(ret.userid, data, navigation, route) : PassengerModify(route.params.info.id,data,navigation, route)
        })
}

function getParams(params, setUsername, setCard_id, setTel_number, setP_type){
    setUsername(params.info.real_name)
    setCard_id(params.info.card_id)
    setTel_number(params.info.tel_number)
    let tmp = []
    tmp.push(params.info.type)
    setP_type(tmp)
}

function UserInfoForm(){
    const [value, setValue] = useState(0)
    const [watch, setWatch] = useState("")
    const [p_type, setP_type] = useState(0)
    const [username, setUsername] = useState("")
    const [nameEmpty, setNameEmpty] = useState(false)
    const [card_id, setCard_id] = useState("")
    const [card_idEmpty, setCard_idEmpty] = useState(false)
    const [tel_number, setTel_number] = useState("")
    const [tel_numberEmpty, setTel_numberEmpty] = useState(false)
    const [card_idPattern, setCard_idPattern] = useState(false)
    const [telPattern, setTelPattern] = useState(false)
    const navigation =useNavigation()
    const route = useRoute()
    const generateTestHook = useCavy()

    const UserBlur = () => {
        if(username === "") setNameEmpty(true)
        else setNameEmpty(false)
    }

    const cardBlur = () => {
        if(card_id === "") setCard_idEmpty(true)
        else setCard_idEmpty(false)
        if(cPattern.test(card_id))
            setCard_idPattern(false)
        else    setCard_idPattern(true)
    }

    const telBlur = () => {
        if(tel_number === "") setTel_numberEmpty(true)
        else setTel_numberEmpty(false)
        if(mPattern.test(tel_number))   setTelPattern(false)
        else    setTelPattern(true)
    }

    useEffect(()=>{
        if(route.params.info !== undefined)
            getParams(route.params, setUsername, setCard_id, setTel_number, setP_type)
    }, [watch])

    return(
        <Provider>
            <ScrollView>
                <List renderHeader={'新增乘客'} style={{marginTop: 20}}>
                    <MobileInputItem
                        defaultValue={route.params.info === undefined? "":route.params.info.real_name}
                        error={nameEmpty}
                        value={username}
                        ref={generateTestHook("PassengerAdd.Username")}
                        onErrorClick={"此为必填项"}
                        onBlur={() => {
                           UserBlur()
                        }}
                        placeholder="用户名条件"
                        style={{marginLeft: 15}}
                        onChange={v => {setUsername(v)
                            console.log(username)}}
                        onChangeText={v => setUsername(v)}
                    >
                        <Text style={{fontSize: 18, width: 100}}>姓名：</Text>
                    </MobileInputItem>
                    <Picker
                        data={type}
                        cols={1}
                        value={p_type}
                        ref={generateTestHook("PassengerAdd.P_type")}
                        onChange={v => setP_type( v )}
                    >
                        <List.Item>
                            乘客类型 ：
                        </List.Item>
                    </Picker>
                    <Picker
                        data={card_type}
                        ref={generateTestHook("PassengerAdd.C_type")}
                        cols={1}
                        value={value}
                        onChange={v => setValue( v )}
                    >
                        <List.Item>
                            证件类型 ：
                        </List.Item>
                    </Picker>
                    <MobileInputItem
                        defaultValue={route.params.info === undefined? "":route.params.info.card_id}
                        error={card_idEmpty || card_idPattern}
                        onErrorClick={card_idEmpty?"此为必填项":"证件号码格式有误"}
                        onChange={v=>setCard_id(v)}
                        onChangeText={v=>setCard_id(v)}
                        ref={generateTestHook("PassengerAdd.Card_id")}
                        value={card_id}
                        onBlur={() => {cardBlur()}}
                        placeholder="请填写身份证号"
                        style={{marginLeft: 15}}
                    >
                        <Text style={{fontSize: 18, width: 100}}>证件号码：</Text>
                    </MobileInputItem>
                </List>
                <List renderHeader={'手机号码'} style={{marginTop: 20}}>
                    <MobileInputItem
                        value={tel_number}
                        defaultValue={route.params.info === undefined? "":route.params.info.tel_number}
                        error={tel_numberEmpty || telPattern}
                        onErrorClick={tel_numberEmpty?"此为必填项": "手机号码格式有误"}
                        onChange={v => setTel_number(v)}
                        onChangeText={v=>setTel_number(v)}
                        ref={generateTestHook("PassengerAdd.Tel_number")}
                        onBlur={() => {telBlur()}}
                        placeholder={"请输入手机号码"}
                        style={{marginLeft: 15}}>
                        <Text style={{fontSize: 18, width: 100}}>手机号码：</Text>
                    </MobileInputItem>
                </List>
                <Button type={"primary"}
                        ref={generateTestHook("PassengerAdd.confirm")}
                        disabled={nameEmpty || tel_numberEmpty || telPattern || card_idPattern || card_idEmpty}
                        onPress={()=>handleClick(route,{username: username, card_id: card_id, tel_number: tel_number
                            , type: p_type[0]}, navigation)}
                        style={{width: 300, height: 40, marginTop: 10, alignSelf: "center"}}>
                    确认
                </Button>
            </ScrollView>
        </Provider>
    )
}

export default UserInfoForm;
