import {JudgeE_mail, JudgeUsername} from "../services/JudgeUsername";
import {register} from "../services/RegisterService";
import React, {useState} from "react";
import {InputItem, List, Picker, Button, Provider} from '@ant-design/react-native'
import {ScrollView, Text} from "react-native";
import MobileInputItem from "./MobileInputItem";
import {useNavigation} from "@react-navigation/native";
import {Header} from "react-native-elements/dist/header/Header";
import {useCavy} from 'cavy';

const card_type = [{value: "中国居民身份证", label: "中国居民身份证"}, {value: "港澳台居民身份证", label: "港澳台居民身份证"}]
const extra_info= [{value: 0, label: "成人"}, {value: 1, label: "儿童"}, {value: 2, label: "学生"}]
let emailPattern =/^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/;
let pPattern = /^.*(?=.{6,})(?=.*\d)(?=.*[A-Z])(?=.*[a-z]).*$/;
let cPattern = /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/;
let mPattern = /^((13[0-9])|(14[5|7])|(15([0-3]|[5-9]))|(18[0-1,5-9]))\d{8}$/;


function RegisterForm({setRegister, setModalVisible}){
    const navigation = useNavigation()
    const [value, setValue] = useState([])
    const [pickerValue, setPickerValue] = useState([])
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [password2, setPassword2] = useState("")
    const [real_name, setReal_name] = useState("")
    const [card_id, setCard_id] = useState("")
    const [tel_number, setTel_number] = useState("")
    const [e_mail, setE_mail] = useState("")
    const [nameDup, setNameDup] = useState(false)
    const [nameEmpty, setNameEmpty] = useState(false)
    const [passwordJudge, setPasswordJudge] = useState(false)
    const [passwordEmpty, setPasswordEmpty] = useState(false)
    const [emailJudge, setEmailJudge] = useState(false)
    const [realnameEmpty, setRealnameEmpty] = useState(false)
    const [card_idEmpty, setCard_idEmpty] = useState(false)
    const [tel_numberEmpty, setTel_numberEmpty] = useState(false)
    const [e_mailEmpty, setE_mailEmpty] = useState(false)
    const [passwordPattern, setPasswordPattern] = useState(false)
    const [card_idPattern, setCard_idPattern] = useState(false)
    const [telPattern, setTelPattern] = useState(false)
    const [button, setButton] = useState(true)
    const [e_mailDup, setE_mailDup] = useState(false)
    const generateTestHook = useCavy()

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

    const card_idBlur = () => {
        setButton(false)
        if(card_id === "") setCard_idEmpty(true)
        else setCard_idEmpty(false)
        if(cPattern.test(card_id))
            setCard_idPattern(false)
        else    setCard_idPattern(true)
    }

    const telBlur = () => {
        setButton(false)
        if(tel_number === "") setTel_numberEmpty(true)
        else    setTel_numberEmpty(false)
        if(mPattern.test(tel_number))
            setTelPattern(false)
        else    setTelPattern(true)
    }

    const E_mailBlur = () => {
        if(e_mail === "")
            setE_mailEmpty(true)
        else
            setE_mailEmpty(false)
        if(e_mail !== "" && emailPattern.test(e_mail) || e_mail === ""){
            setEmailJudge(false)
            JudgeE_mail({e_mail: e_mail}, setE_mailDup)
        }
        else setEmailJudge(true)
    }

    return (
        <Provider>
            <ScrollView style={{backgroundColor: 'rgba(192, 190, 192, 0.8)'}}>
                <Header
                    key={"header"}
                    leftComponent={{
                        icon: 'left',
                        color: '#fff',
                        type: 'antdesign',
                        onPress: ()=>setRegister(false),
                        iconStyle: {color: '#fff'}
                    }}
                    centerComponent={{
                        text: "注册",
                        style: {color: '#fff', textAlignVertical: 'center', fontSize: 18}
                    }}
                    backgroundColor={'#6495ed'}
                />
                <List key={"list1"} renderHeader={'基本信息'}>
                    <MobileInputItem
                        key={"account"}
                        ref={generateTestHook("Register.Username")}
                        value={username}
                        symbol={"account"}
                        error={nameDup || nameEmpty}
                        onErrorClick={nameEmpty?"此为必填项":"用户名已存在"}
                        placeholder="请输入用户名"
                        style={{marginLeft: 15}}
                        onBlur={() => JudgeUsername({username: username}, setNameDup, setNameEmpty)}
                        onChange={v => setUsername(v)}
                        onChangeText={v => setUsername(v)}
                    >
                        {console.log(nameDup)}
                        <Text key={"accountText"} style={{fontSize: 18, width: 100}}>用 户 名：</Text>
                    </MobileInputItem>
                    <MobileInputItem
                        value={password}
                        symbol={"password"}
                        ref={generateTestHook("Register.Password")}
                        key={"password"}
                        error={passwordEmpty || passwordPattern}
                        type={"password"}
                        onErrorClick={passwordEmpty?"此为必填项":"密码格式不正确"}
                        placeholder="至少6位，大小写字母，数字"
                        style={{marginLeft: 15}}
                        onChange={v => setPassword(v)}
                        onChangeText={v => setPassword(v)}
                        onBlur={() => {passwordBlur()}}
                    >
                        <Text key={"passwordText"} style={{fontSize: 18, width: 100}}>密      码：</Text>
                    </MobileInputItem>
                    <MobileInputItem
                        value={password2}
                        ref={generateTestHook("Register.Password2")}
                        password={"confirm"}
                        key={"confirm"}
                        error={passwordJudge}
                        onErrorClick={"两次密码输入不一致"}
                        type={"password"}
                        placeholder="请再次输入密码"
                        style={{marginLeft: 15}}
                        onChange={v => setPassword2(v)}
                        onChangeText={v => setPassword2(v)}
                        onBlur={() => {passwordJudgeBlur()}}
                    >
                        <Text key={"confirmText"} style={{fontSize: 18, width: 100}}>确认密码：</Text>
                    </MobileInputItem>
                </List>
                <List key={"list2"} renderHeader={'详细信息'}>
                    <Picker
                        key={"type"}
                        ref={generateTestHook("Register.Card_type")}
                        data={card_type}
                        cols={1}
                        value={value}
                        onChange={v => setValue(v)}
                    >
                        <List.Item key={"type1"}>
                            证件类型 ：
                        </List.Item>
                    </Picker>
                    <MobileInputItem
                        ref={generateTestHook("Register.Real_name")}
                        symbol={"name"}
                        key={"name"}
                        value={real_name}
                        error={realnameEmpty}
                        onErrorClick={"此为必填项"}
                        onBlur={() =>{ if(real_name === "") setRealnameEmpty(true)
                        else setRealnameEmpty(false)}}
                        placeholder="输入真实姓名"
                        style={{marginLeft: 15}}
                        onChange = {v => setReal_name(v)}
                        onChangeText = {v => setReal_name(v)}
                    >
                        <Text key={"nameText"} style={{fontSize: 18, width: 100}}>姓        名：</Text>
                    </MobileInputItem>
                    <MobileInputItem
                        symbol={"code"}
                        key={"code"}
                        ref={generateTestHook("Register.Card_id")}
                        value={card_id}
                        error={card_idEmpty || card_idPattern}
                        onErrorClick={card_idEmpty?"此为必填项":"格式不正确"}
                        onBlur={() =>{card_idBlur()}}
                        placeholder="请输入18位身份证号"
                        style={{marginLeft: 15}}
                        onChange = {v => setCard_id(v)}
                        onChangeText={v => setCard_id(v)}
                    >
                        <Text key={"codeText"} style={{fontSize: 18, width: 100}}>证件号码：</Text>
                    </MobileInputItem>
                </List>
                <List key={"list3"} renderHeader={'联系方式'}>
                    <MobileInputItem
                        ref={generateTestHook("Register.tel_number")}
                        symbol={"phone"}
                        key={"phone"}
                        value={tel_number}
                        error={tel_numberEmpty || telPattern}
                        onBlur={() => {
                            telBlur()
                        }}
                        onErrorClick={tel_numberEmpty?"此为必填项":"手机号格式不正确"}
                        placeholder="请输入手机号"
                        style={{marginLeft: 15}}
                        onChange={v => setTel_number(v)}
                        onChangeText={v => setTel_number(v)}
                    >
                        <Text key={"phoneText"} style={{fontSize: 18, width: 100}}>手机号码：</Text>
                    </MobileInputItem>
                    <MobileInputItem
                        ref={generateTestHook("Register.E_mail")}
                        symbol={"email"}
                        key={"email"}
                        value={e_mail}
                        error={emailJudge || e_mailEmpty || e_mailDup}
                        onErrorClick={e_mailEmpty?"此为必填项":(emailJudge?"邮箱格式不正确":"邮箱已经被注册过")}
                        placeholder="请输入电子邮箱"
                        style={{marginLeft: 15}}
                        onChange={v => setE_mail(v)}
                        onChangeText={v => setE_mail(v)}
                        onBlur={() => {
                            E_mailBlur()
                        }}
                    >
                        <Text key={"emailText"} style={{fontSize: 18, width: 100}}>电子邮箱：</Text>
                    </MobileInputItem>
                </List>
                <List key={"list4"} renderHeader={'附加信息'}>
                    <Picker key={"picker1"}
                            ref={generateTestHook("Register.Tourist_type")}
                        data={extra_info} cols={1} value={pickerValue}
                        onChange={v=>setPickerValue(v)}
                    >
                        <List.Item key={"listItem2"}>
                            旅客信息 ：
                        </List.Item>
                    </Picker>
                </List>
                <Button key={"Button"} style={{width: 250, height: 45, marginTop: 20, alignSelf: "center"}}
                        type={"primary"} disabled={nameDup || nameEmpty || passwordPattern || passwordJudge || passwordEmpty
                        || value === [] || pickerValue === [] || realnameEmpty || card_idPattern || card_idEmpty || telPattern
                        || tel_numberEmpty || emailJudge || e_mailEmpty}
                        onPress={()=>register({username: username, password: password, real_name: real_name,
                            e_mail: e_mail, card_id: card_id, tel_number: tel_number,  tourist_type: pickerValue[0], passwordJudge: passwordJudge,
                            emailJudge: emailJudge, nameDup: nameDup}, navigation, setRegister)} ref={generateTestHook("Register.confirm")}> 注册 </Button>
            </ScrollView>
        </Provider>
    )
}

export default RegisterForm;
