import React, {Component, createRef, useRef, useState} from 'react';
import {FlatList, SafeAreaView, Text, TouchableHighlight, View, ScrollView, StatusBar} from 'react-native';
import EvilIcons from "react-native-vector-icons/EvilIcons";
import UserCardGroup from "../component/UserCardGroup";
import {Card, WingBlank} from "@ant-design/react-native";
import AntDesign from "react-native-vector-icons/AntDesign";
import {ListItem, Avatar} from 'react-native-elements'
import RailGuideCard from "../component/RailGuideCard";
import LoginModal from './LoginView';

export default function UserView({navigation, setCurrentTab}) {
    const [visible, setVisible] = useState(false)

    return (

        <View style={{backgroundColor:'white', height: '100%'}}>
            <StatusBar backgroundColor={'rgba(15,123,255,0.65)'} barStyle={ 'dark-content'}/>
            <ScrollView>
                <View style={{flexDirection: 'column', backgroundColor: 'rgba(15,123,255,0.65)', height: 200}}>
                    <View style={{flexDirection: 'row-reverse'}}>
                        <AntDesign name={"setting"} size={25} style={{paddingHorizontal: 10, paddingVertical: 10}}
                                   color={'white'}/>
                    </View>
                    <View style={{flexDirection: 'row', paddingTop: 5}}>
                        <EvilIcons name={"user"} size={70} color={'white'}/>
                        <Text style={{
                            alignSelf: 'center',
                            textAlignVertical: 'center',
                            color: 'white',
                            fontSize: 25
                        }}>尊敬的用户</Text>
                    </View>
                    <UserCardGroup navigation={navigation} setCurrentTab={setCurrentTab} setVisible={setVisible}/>
                </View>
                <RailGuideCard/>
                <WingBlank size={'md'} style={{marginTop: 20}}>
                    <Card>
                        <Card.Header title="信息服务"/>
                        <ListItem key='1' bottomDivider topDivider>
                            <ListItem.Content>
                                <ListItem.Title><Text style={{fontSize: 13}}>公告</Text></ListItem.Title>
                            </ListItem.Content>
                            <ListItem.Chevron/>
                        </ListItem>
                        <ListItem key='2' bottomDivider>
                            <ListItem.Content>
                                <ListItem.Title><Text style={{fontSize: 13}}>常见问题</Text></ListItem.Title>
                            </ListItem.Content>
                            <ListItem.Chevron/>
                        </ListItem>
                        <ListItem key='3' bottomDivider>
                            <ListItem.Content>
                                <ListItem.Title><Text style={{fontSize: 13}}>使用须知</Text></ListItem.Title>
                            </ListItem.Content>
                            <ListItem.Chevron/>
                        </ListItem>
                        <ListItem key='4' bottomDivider>
                            <ListItem.Content>
                                <ListItem.Title><Text style={{fontSize: 13}}>关于</Text></ListItem.Title>
                            </ListItem.Content>
                            <ListItem.Subtitle><Text style={{fontSize: 13}}>版本号 0.0.0</Text></ListItem.Subtitle>
                            <ListItem.Chevron/>
                        </ListItem>

                    </Card>
                </WingBlank>
                <LoginModal judge={true} modalVisible={visible} setModalVisible={setVisible} setCurrentTab={setCurrentTab}/>
            </ScrollView>
            <View style={{height: 50}}>
            </View>
        </View>

    )
}
