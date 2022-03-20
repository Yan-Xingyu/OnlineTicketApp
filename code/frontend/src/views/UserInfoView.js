import React, {Component, useEffect, useRef, useState} from "react";
import {InputItem, List, Picker, Icon, Button, Provider} from '@ant-design/react-native'
import {ScrollView, Text, View, StatusBar} from "react-native";
import {Header} from "react-native-elements/dist/header/Header";
import UserInfoModifyForm from "../components/UserInfoModifyForm";
import {GetUserInfo} from "../services/GetUserInfo";
import storage from "../storage/Storage";
import {modify} from "../services/ModifyUser";
import LoginModal from "./LoginView";
import {useCavy, wrap} from 'cavy';

const extra_info = [{value: 0, label: "成人"}, {value: 1, label: "儿童"}, {value: 3, label: "学生"}]
const Item = List.Item;



function UserInfoView ({navigation}) {
    const [modified, setModified] = useState(false)
    const [name, setName] = useState("")
    const [username, setUsername] = useState("")
    const [card_id, setCard_id] = useState("")
    const [tel_number, setTel_number] = useState("")
    const [mail, setMail] = useState("")
    const [type, setType] = useState(-1)
    const [loginModalVisible, setLoginModalVisible] = useState(false)
    const UserInfo = useRef()
    const generateTestHook = useCavy()
    const LoginModalTest = wrap(LoginModal)

    const stateSwitch = (modified, setModified) => {
        if(!modified) {
            setModified(!modified)
            return
        }
        const data = UserInfo.current.getUser()
        storage.load({key: "userId"})
            .then(ret => {
                modify(ret.userid, data, modified, setModified)
            })
            .catch(error => console.log(error))
    }
    const get = () =>{
        console.log(UserInfo)
        UserInfo.current.getUser()
    }

    useEffect(()=> {
        storage.load({key: "userId"})
            .then(ret => {
                console.log("userid"+ret.userid)
                    GetUserInfo(ret.userid, setTel_number, setCard_id, setUsername, setMail, setName, setType)
                }
            )
            .catch(error => console.log(error))
    }, [loginModalVisible])

    useEffect(()=>{
        storage.load({key: "userId"})
            .then(ret => {
                console.log("userid"+ret.userid)
                GetUserInfo(ret.userid, setTel_number, setCard_id, setUsername, setMail, setName, setType)
            }).catch(()=>{
                setLoginModalVisible(true)
        })
    })

    return (
        <Provider>
            <View style={{backgroundColor: 'rgba(192, 190, 192, 0.1)', flex: 1}}>
                <Header
                    leftComponent={{
                        icon: 'left',
                        color: '#fff',
                        type: 'antdesign',
                        onPress: navigation.goBack,
                        iconStyle: {color: '#fff'}
                    }}
                    centerComponent={{
                        text: '个人资料',
                        style: {color: '#fff', textAlignVertical: 'center', fontSize: 18}
                    }}
                    rightComponent={<Text
                        style={{color: '#fff', textAlignVertical: 'center', fontSize: 16}}
                        onPress={() => stateSwitch(modified, setModified)}>{modified ? "完成" : "修改"}</Text>}
                    backgroundColor={'#33A3F4'}
                />
                {modified ? <UserInfoModifyForm defaultUser={ {
                        name: name,
                        idCardNumber:card_id,
                        idType:0,
                        username:username,
                        telNumber:tel_number,
                        email:mail,
                        type: type
                    }} statusRef={UserInfo}/>
                    :
                    <ScrollView style={{backgroundColor: 'rgba(192, 190, 192, 0.8)'}}>
                        <List renderHeader={'基本信息'}>
                            <Item disabled extra={username} onPress={() => {
                            }}>
                                用 户 名：
                            </Item>
                        </List>
                        <List renderHeader={'详细信息'}>
                            <Item disabled extra={name} onPress={() => {
                            }}>
                                姓 名：
                            </Item>
                            <Item disabled extra="中国China" onPress={() => {
                            }}>
                                国家地区：
                            </Item>
                            <Item disabled extra="中国居民身份证" onPress={() => {
                            }}>
                                证件类型：
                            </Item>
                            <Item disabled extra={card_id} onPress={() => {
                            }}>
                                证件号码：
                            </Item>
                            <Item disabled extra="已通过" onPress={() => {
                            }}>
                                审核状态：
                            </Item>
                        </List>
                        <List renderHeader={'联系方式'}>
                            <Item disabled extra={tel_number} onPress={() => {
                            }}>
                                手机号码：
                            </Item>
                            <Item disabled extra={mail} onPress={() => {
                            }}>
                                电子邮箱：
                            </Item>
                        </List>
                        <List renderHeader={'附加信息'}>
                            {console.log(type)}
                            <Item disabled extra={type===-1?"":extra_info[type].label} onPress={() => {
                            }}>

                                旅客类型：
                            </Item>
                        </List>
                        <List>
                            <Button onPress={()=>{storage.remove({key: "telNumber"}).catch(error => console.log(error)); storage.remove({key: "userId"}).catch(error => console.log(error)); storage.remove({key: "token"}).then(()=> navigation.navigate("Home")).catch(error => console.log(error))}}>退出登录</Button>
                        </List>
                    </ScrollView>}
                <LoginModalTest ref={generateTestHook("UserInfo.LoginModal")} modalVisible={loginModalVisible} setModalVisible={setLoginModalVisible} judge={false}/>
            </View>
        </Provider>
    )
}

export default UserInfoView;

