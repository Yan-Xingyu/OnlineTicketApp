import React, {useEffect, useRef, useState} from 'react';
import {Modal, Text, View} from "react-native";
import {Card, TabBar, Flex, DatePickerView, Button} from "@ant-design/react-native";
import RailwayInfoList, {RailwayCard} from "../component/RailwayInfoList";
import Entypo from "react-native-vector-icons/Entypo";
import AntDesign from "react-native-vector-icons/AntDesign";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import {Header} from "react-native-elements";
import {Calendar, CalendarList, Agenda} from 'react-native-calendars';
import RailFilterModal from "../components/RailFilterModal";
import {stampToDate} from "../utils/HandleDate";


export const StationContext= React.createContext({});

export default function ReturnListView({route, navigation}) {
    const {isOneWay, start, end, date, returnDate,isChange,passengers} = route.params


    const getMarked = (Date) => {

        let Marked = {}
        Marked[Date.dateString] = {selected: true, selectedColor: "#1E90FF"}
        return Marked
    }
    const getMarkedByTimestamp = (timestamp) => {

        let Marked = {}
        Marked[stampToDate(timestamp)] = {selected: true, selectedColor: "#1E90FF"}
        return Marked
    }

    const getDate=(timeStamp)=>{
        let d = new Date(timeStamp)
        let month = d.getMonth() + 1

        if(month < 10){
            month = '0' + month
        }

        return d.getFullYear() + '-' + month  + '-' + d.getDate();
    }
    const addDataString =(date)=>{
        return{dateString:getDate(date)}
    }
    const [startDate, setStartDate] = useState(date);//format:timeStamp
    const [marked, setMarked] = useState(getMarked(addDataString(startDate)))

    const [modalVisible, setModalVisible] = useState(false);
    const [filter, setFilter] = useState(false);
    const [startFilter,setStartFilter] =useState([]);
    const [endFilter,setEndFilter] = useState([]);
    const [startTimeFilter,setStartTimeFilter] =useState([])
    const [endTimeFilter,setEndTimeFilter] =useState([])
    const [selectedTab, setSelectedTab] = useState("null");
    const updateMarkDate = (timestamp)=>{
        setMarked(getMarkedByTimestamp(timestamp))
        navigation.setParams({
            date: timestamp,
        })
    }
    let listRef = null

    const setCondition =(s,e,st,et)=>{
        listRef.setCondition(s,e,st,et)
    }
    const onFinish =(f)=>{
        listRef.onFinish(f)
    }

    const addFilter = (option,val)=>{
        if(option===1)  {
            //listRef.current.changeStart(val)
            let before = startFilter;
            before.push(val)
            setStartFilter(before)
        }
        if(option===2)  {
            //listRef.current.changeEnd(val)
            let before = endFilter;
            before.push(val)
            setEndFilter(before)
        }
        if(option===3)  {
            // listRef.current.changeStartTime(val)
            let before = startTimeFilter;
            before.push(val)
            setStartTimeFilter(before)
        }
        if(option===4)  {
            //listRef.current.changeEndTime(val)
            let before = endTimeFilter;
            before.push(val)
            setEndTimeFilter(before)
        }
        if(option===-1)  {
            //listRef.current.subStart(val)
            let before = startFilter;
            let remove = before.indexOf(val)
            before.splice(remove,1)
            setStartFilter(before)
        }
        if(option===-2)  {
            // listRef.current.subEnd(val)
            let before = endFilter;
            let remove = before.indexOf(val)
            before.splice(remove,1)
            setEndFilter(before)
        }
        if(option===-3)  {
            // listRef.current.subStartTime(val)
            let before = startTimeFilter;
            let remove = before.indexOf(val)
            before.splice(remove,1)
            setStartTimeFilter(before)
        }
        if(option===-4)  {
            //listRef.current.subEndTime(val)
            let before = endTimeFilter;
            let remove = before.indexOf(val)
            before.splice(remove,1)
            setEndTimeFilter(before)
        }
    }

    const conFirm = (status) =>{

        listRef.current.confirm(status)
    }
    const setSorter =(option)=>{
        listRef.onSort(option)
    }

    return (
        <View style={{height: '100%'}}>
            <Header
                leftComponent={{
                    icon: 'left',
                    color: '#fff',
                    type: 'antdesign',
                    onPress: navigation.goBack,
                    iconStyle: {color: '#fff'}
                }}
                centerComponent={{
                    text: '选择返程',
                    style: {color: '#fff', textAlignVertical: 'center', fontSize: 18}
                }}

                backgroundColor={'#6495ed'}
            />
            <View style={{flex: 1}}>

                <RailwayInfoList style={{flex: 1}} date={startDate}
                                 startCity={start} endCity={end}
                                 selectDay={(day)=>{

                                     setStartDate(day);

                                     updateMarkDate(day)
                                 }}
                                 changeVisible={() => setModalVisible(true)}
                                 isOneWay={isOneWay}
                                 onRef={ node =>listRef = node }
                                 route={route}
                                 navigation={navigation}
                />
                <View style={{height: 51, backgroundColor: 'white', borderColor: 'white'}}>
                    <TabBar
                        tintColor="#33A3F4"
                        unselectedTintColor="#949494"
                        /* unselectedTintColor="#949494"
                         barTintColor="#f5f5f5"*/
                    >
                        <TabBar.Item
                            icon={<MaterialCommunityIcons name={"filter-menu-outline"} color={"#949494"}/>}
                            onPress={() => setFilter(true)}
                            title="筛选"
                        />
                        <TabBar.Item
                            icon={<Entypo name={"back-in-time"} color={"#949494"}/>}
                            selectedIcon={<Entypo name={"back-in-time"} color={"#33A3F4"}/>}
                            onPress={() => {
                                if (selectedTab === "costTab")
                                {   setSelectedTab("null")
                                    setSorter(0)
                                }
                                else {setSelectedTab("costTab")
                                    setSorter(1)
                                }
                            }
                            }
                            selected={selectedTab === "costTab"}
                            title="耗时排序"
                        />
                        <TabBar.Item
                            icon={<AntDesign name={"clockcircleo"} color={"#949494"}/>}
                            selectedIcon={<AntDesign name={"clockcircleo"} color={"#33A3F4"}/>}
                            selected={selectedTab === "beginTab"}
                            onPress={() => {
                                if (selectedTab === "beginTab"){
                                    setSelectedTab("null")
                                    setSorter(0)
                                }

                                else {setSelectedTab("beginTab")
                                    setSorter(2)
                                }
                            }
                            }
                            title="出发时间"
                        />
                        <TabBar.Item
                            icon={<FontAwesome name={"rmb"} color={"#949494"}/>}
                            selectedIcon={<FontAwesome name={"rmb"} color={"#33A3F4"}/>}
                            title="价格排序"
                            onPress={() => {
                                if (selectedTab === "priceTab"){
                                    setSelectedTab("null")
                                    setSorter(0)
                                }
                                else {
                                    setSelectedTab("priceTab")
                                    setSorter(3)
                                }
                            }
                            }
                            selected={selectedTab === "priceTab"}
                        />
                    </TabBar>

                < /View>

                <Modal
                    transparent={false}
                    onClose={() => setModalVisible(false)}
                    visible={modalVisible}
                    animationType={'slide'}
                >
                    <View style={{paddingVertical: 20}}>
                        <View style={{height: 30, width: '100%', flexDirection: 'row'}}>
                            <AntDesign name={"close"} size={20} style={{flex: 1, paddingLeft: 30}}
                                       onPress={() => setModalVisible(false)}/>
                            <Text style={{height: 30, fontWeight: 'bold', fontSize: 16, flex: 1, textAlign: 'center'}}>
                                选择日期
                            </Text>
                            <AntDesign size={20} style={{flex: 1, paddingRight: 30}}/>
                        </View>
                        <CalendarList
                            minDate={Date()}
                            onDayPress={(day) => {
                                console.log('selected day', day);
                                setStartDate(day.timestamp)
                                navigation.setParams({
                                    date: day.timestamp,
                                })
                                setMarked(getMarked(day))
                                setModalVisible(false)
                                changeStatus()
                            }}
                            markedDates={marked}
                        />

                    </View>
                </Modal>
                <RailFilterModal setVisible={()=>setFilter(!filter)} visible={filter}
                                 startCity={start} endCity={end}
                                 route={route} setCondition={setCondition} onFinish={onFinish}
                                 style={{height:"150"}}
                />
            </View>
        </View>


    )
}
