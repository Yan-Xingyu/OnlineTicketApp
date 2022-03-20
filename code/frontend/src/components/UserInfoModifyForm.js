import {RadioGroup, RadioButton} from 'react-native-flexi-radio-button'
import React, {useState,useRef, useImperativeHandle} from "react";
import {InputItem, List, Picker, Button, Provider} from '@ant-design/react-native'
import {ScrollView, Text, View} from "react-native";
import MobileInputItem from "./MobileInputItem";
import {JudgeUsername} from "../services/JudgeUsername";

const card_type = [{value: "中国居民身份证", label: "中国居民身份证"}]
const extra_info= [{value: 1, label: "成人"}, {value: 2, label: "儿童"}, {value: 3, label: "学生"}]

function UserInfoModifyForm({defaultUser, statusRef}){
    const [value, setValue] = useState([])
    const [pickerValue, setPickerValue] = useState(0)
    const userNameRef = useRef();
    const [username, setUsername] = useState(defaultUser.username)
    const [nameEmpty, setNameEmpty] = useState(false)
    const [nameDup, setNameDup] = useState(false)
    const [mail, setMail] = useState(defaultUser.email)
    const [mailEmpty, setMailEmpty] = useState(false)
    const [type, setType] = useState(defaultUser.type)
    const [emailJudge, setEmailJudge] = useState(false)

    let emailPattern =/^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/;

    useImperativeHandle(statusRef, () => ({
        // changeVal 就是暴露给父组件的方法
        getUser: () => {
            return(
                {
                    username: username,
                    e_mail: mail,
                    type: pickerValue[0],
                    nameDup: nameDup,
                    nameEmpty: nameEmpty,
                    mailEmpty: mailEmpty,
                    emailJudge: emailJudge
                }
            )
        }
    }))

    return (
        <Provider>
            <View style={{backgroundColor:'rgba(192, 190, 192, 0.8)'}}>
                <ScrollView style={{backgroundColor: 'rgba(192, 190, 192, 0.8)'}}>
                    <List renderHeader={'基本信息'}>
                        <MobileInputItem
                            defaultValue={defaultUser.username}
                            style={{marginLeft: 15}}
                            error={nameDup || nameEmpty}
                            onErrorClick={nameEmpty?"此为必填项":"用户名已存在"}
                            placeholder="用户名条件"
                            onBlur={() => JudgeUsername({username: username}, setNameDup, setNameEmpty)}
                            onChange={v => setUsername(v)}
                        >
                            <Text style={{fontSize: 18, width: 100}}>用 户 名：</Text>
                        </MobileInputItem>
                    </List>
                    <List renderHeader={'详细信息'}>
                        <List.Item extra={defaultUser.name}>
                            姓名
                        </List.Item>
                        <List.Item extra={"中国居民身份证"}>
                            证件类型 ：
                        </List.Item>


                        <List.Item disabled extra={
                            defaultUser.idCardNumber
                        }
                                   multipleLine>
                            证件号码：
                        </List.Item>


                    </List>
                    <List renderHeader={'联系方式'}>
                        <List.Item extra={defaultUser.telNumber}>
                            手机号码：
                        </List.Item>
                        <MobileInputItem
                            error={emailJudge || mailEmpty}
                            onErrorClick={mailEmpty?"此为必填项":"邮箱格式不正确"}
                            placeholder="请输入电子邮箱"
                            onChange={v => setMail(v)}
                            onBlur={() => {
                                if(mail === "")
                                    setMailEmpty(true)
                                else
                                    setMailEmpty(false)
                                if(mail !== "" && emailPattern.test(mail) || mail === ""){
                                    setEmailJudge(false)
                                }
                                else setEmailJudge(true)
                            }}
                            defaultValue={defaultUser.email}
                            style={{marginLeft: 15}}
                        >
                            <Text style={{fontSize: 18, width: 100}}>电子邮箱：</Text>
                        </MobileInputItem>
                    </List>
                    <List renderHeader={'附加信息'}>
                        <Picker
                            data={extra_info} cols={1} value={pickerValue}
                            onChange={v => {setPickerValue( v )}}
                        >
                            <List.Item>
                                旅客信息 ：
                            </List.Item>
                        </Picker>
                    </List>

                </ScrollView>
            </View>
        </Provider>
    )
}

export default UserInfoModifyForm;
