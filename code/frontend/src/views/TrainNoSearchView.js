import React, {useRef, useState} from 'react';
import {StatusBar, StyleSheet, Text, TouchableHighlight, TouchableOpacity, View} from 'react-native';
import {buttonValues, OTA_COLOR, weeks, WINDOWS_HEIGHT, WINDOWS_WIDTH} from '../constants/Constants';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {Card} from 'react-native-shadow-cards';
import {DateModal, PrivateKeyboard, TrainNoInput} from '../components/PrivateComponent';
import {getTrainInfoByTag} from '../services/TicketService';
import {getNowDate} from '../components/TrainNoPurchaseModal';
import {addDay} from '../components/PToPSearchTabs';

import AlertModal from '../components/AlertModal';
import {useCavy, wrap} from 'cavy';

const TrainNoSearchView = ({navigation}) => {

    let nowDate = getNowDate()
    let maxDate = addDay(nowDate, 15)

    const generateTestHook = useCavy()
    const TouchableHighlightTest = wrap(TouchableHighlight)
    const TouchableOpacityTest = wrap(TouchableOpacity)

    const [trainNo, setTrainNo] = useState('')
    const [date, setDate] = useState(nowDate)
    const [visible, setVisible] = useState(false)

    const keyboard = useRef(null)
    const input = useRef(null)
    const alertModalRef = useRef(null)

    return (
        <>
            <StatusBar backgroundColor={OTA_COLOR.themeColor}  barStyle={ 'dark-content'}/>

            <View style={{backgroundColor: OTA_COLOR.themeColor, flex: 1, alignItems: 'center'}}>
                <View style={{width: WINDOWS_WIDTH}}>
                    <TouchableOpacityTest style={{ marginLeft: 0.03 * WINDOWS_WIDTH, marginTop: 0.03 * WINDOWS_HEIGHT, marginBottom: 0.03 * WINDOWS_HEIGHT}}
                                      onPress={() => navigation.goBack()} ref={generateTestHook("TimeTable.GoHome")}>
                        <Ionicons name= {"chevron-back"} size={0.035 * WINDOWS_HEIGHT} color={'white'}/>
                    </TouchableOpacityTest>
                    <Text style={{fontSize: 0.04 * WINDOWS_HEIGHT, ...styles.titleStyle}}>时刻表</Text>
                    <Text style={{...styles.titleStyle, fontSize: 0.015 * WINDOWS_HEIGHT, marginTop: 0.015 * WINDOWS_HEIGHT}}>
                        轻松安排出行，享受完美旅程
                    </Text>
                </View>

                <Card style={{ width: 0.9 * WINDOWS_WIDTH, alignItems: 'center', top: 0.02 * WINDOWS_HEIGHT }}>
                    <View style={{width: 0.8 * WINDOWS_WIDTH, marginTop: 0.03 * WINDOWS_HEIGHT}}>

                        <Text style={{color: '#c1c1c3'}}>车次号</Text>
                        <TrainNoInput ref={input}
                                      style={{borderBottomColor: "#eae9ec", borderBottomWidth: 1, height: 0.04 * WINDOWS_HEIGHT, marginTop: 0.006 * WINDOWS_HEIGHT}}
                                      fontSize={0.025 * WINDOWS_HEIGHT}
                                      underlayColor={"white"}
                                      placeholder={"例如：G40"}
                                      value={trainNo}
                                      onPress={() => {
                                          input.current.startTwinkle()
                                          keyboard.current.display()
                                      }}/>


                        <Text style={{color: '#c1c1c3', marginTop: 0.02 * WINDOWS_HEIGHT}}>出发时间</Text>
                        <TouchableHighlightTest style={{marginTop: 0.006 * WINDOWS_HEIGHT, flexDirection: 'row', alignItems: 'flex-end'}}
                                         underlayColor={"white"} ref={generateTestHook("TimeTable.Calender")}
                                         onPress={() => setVisible(true)} >
                            <>
                                <Text style={{fontSize: 0.03 * WINDOWS_HEIGHT}}>{date.month + '月' + date.day + '日'}</Text>
                                <Text style={{ marginLeft: 0.035 * WINDOWS_WIDTH, fontSize: 0.02 * WINDOWS_HEIGHT, color: "#6faaea"}}>
                                    {weeks[(new Date(date.timestamp)).getDay()]}
                                </Text>
                            </>
                        </TouchableHighlightTest>

                        <TouchableOpacityTest style={styles.searchButtonStyle}
                                          onPress={() => {
                                              getTrainInfoByTag(date.timestamp, trainNo, data=>{
                                                  if(data.status > 0){
                                                      navigation.navigate('TrainNoDetail', {
                                                          TrainNo: trainNo,
                                                          date: date,
                                                          raw_data: data.data.data,
                                                          trainId: data.data.trainId
                                                      })
                                                  }
                                                  else{
                                                      alertModalRef.current.alert(data.message)
                                                  }
                                              })
                                          }} ref={generateTestHook("TimeTable.confirm")}>
                            <Text style={{color: "white", fontSize: 0.05 * WINDOWS_WIDTH}}>查询</Text>
                        </TouchableOpacityTest>
                    </View>
                </Card>

                <View style={{flex: 1, backgroundColor: 'white', width: WINDOWS_WIDTH, borderRadius: 0.04 * WINDOWS_WIDTH, alignItems:'center'}}>
                    <></>
                </View>
            </View>

            <DateModal selectOne={true}
                       minDate={nowDate}
                       maxDate={maxDate}
                       visible={visible}
                       onRequestClose={() => setVisible(false)}
                       onFinish={(date)=>{
                           setVisible(false)
                           setDate(date)
                       }}/>

            <AlertModal ref={alertModalRef}/>

            <PrivateKeyboard ref={keyboard}
                             buttonValues={buttonValues}
                             cancelLabel={'cancel'}
                             submitLabel={'submit'}
                             onSubmit={() => {
                                 keyboard.current.hide()
                                 input.current.stopTwinkle()
                             }}
                             onKeyPress={value => {
                                 if(trainNo.length < 7)
                                     setTrainNo(trainNo + value)
                             }}
                             onCancel={() => {
                                 setTrainNo(trainNo.substr(0, trainNo.length - 1))
                             }}/>
        </>
    )
}

const styles = StyleSheet.create({
    searchButtonStyle: {
        width: 0.8 * WINDOWS_WIDTH,
        height: 0.1 * WINDOWS_WIDTH,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#2296f3",
        borderRadius: 0.05 * WINDOWS_WIDTH,
        marginTop: 0.03 * WINDOWS_HEIGHT,
        marginBottom: 0.04 * WINDOWS_HEIGHT
    },
    titleStyle: {
        marginLeft: 0.05 * WINDOWS_WIDTH,
        color: 'white'
    }
})

export default TrainNoSearchView;


