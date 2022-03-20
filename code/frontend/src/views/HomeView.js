import React, {useEffect, useState} from 'react';
import {Text, Button, StatusBar} from 'react-native';
import {Icon, TabBar} from '@ant-design/react-native';
import HomeSearchBox from '../components/HomeSearchBox';
import OrderView from './OrderView';
import UserView from './UserView';
import {OTA_COLOR} from "../constants/Constants";
import {useCavy} from 'cavy';

const HomeView = ({route,navigation}) => {
    const [currentTab, setCurrentTab] = useState("Home")
    const generateTestHook = useCavy()

    useEffect(
        ()=>navigation.addListener('beforeRemove',(e)=>{
            if(route.params)
                e.preventDefault();
        })
    )
    return (
        <>
            <StatusBar backgroundColor={OTA_COLOR.themeColor} barStyle={ 'dark-content'}/>
            <TabBar unselectedTintColor={"#949494"}
                    tintColor={"#33A3F4"}
                    barTintColor={"#f5f5f5"} tabBarPosition={"bottom"}>
                <TabBar.Item
                    ref={generateTestHook("Tab.Home")}
                    title={"主页"}
                    icon={<Icon name="home"/>}
                    selected={currentTab === "Home"}
                    onPress={() => setCurrentTab("Home")}
                >
                    <HomeSearchBox navigation={navigation}/>
                </TabBar.Item>
                <TabBar.Item
                    ref={generateTestHook("Tab.Order")}
                    title={"订单"}
                    icon={<Icon name="profile"/>}
                    selected={currentTab === "Order"}
                    onPress={() => setCurrentTab("Order")}
                >
                    <OrderView navigation={navigation} setCurrentTab={setCurrentTab}/>
                </TabBar.Item>
                <TabBar.Item
                    ref={generateTestHook("Tab.User")}
                    title={"个人中心"}
                    icon={<Icon name="user"/>}
                    selected={currentTab === "User"}
                    onPress={() => setCurrentTab("User")}
                >

                    <UserView navigation={navigation} setCurrentTab={setCurrentTab}/>
                </TabBar.Item>
            </TabBar>
        </>
    )
}

export default HomeView;
