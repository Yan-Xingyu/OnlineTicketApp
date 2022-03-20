import React, {useRef, useState} from 'react';
import {Modal, ScrollView, StyleSheet, Text, TouchableHighlight, TouchableOpacity, View} from 'react-native';
import {OTA_COLOR, weeks, WINDOWS_HEIGHT, WINDOWS_WIDTH} from '../constants/Constants';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {DateModal} from './PrivateComponent';
import {getTrainInfoByTag} from '../services/TicketService';
import {useNavigation} from '@react-navigation/native';
import {addDay} from './PToPSearchTabs';
import AlertModal from './AlertModal';
import {useCavy, wrap} from 'cavy';

export const generateDotted = (width) => {
    let dotted = []

    for(let i = 0; i < 50; ++i){
        dotted.push(
            <View key={'dotted' + i} style={{width: width / 76, marginRight: width / 152, height: 0.0015 * WINDOWS_HEIGHT, backgroundColor: '#dfdfe1'}}>
                <></>
            </View>
        )
    }
    dotted.push(
        <View key={'dotted' + 50} style={{width: width / 76, height: 0.0015 * WINDOWS_HEIGHT, backgroundColor: '#dfdfe1'}}>
            <></>
        </View>)
    return dotted
}

export const handleDate = (date) => {
    let nowDate = new Date(date.year + '/' + date.month + '/' + date.day)
    return {month: date.month, day: date.day, timestamp: nowDate.getTime(), dateString: getDateString(nowDate)}
}

export const getDateString = (date) => {
    let month = date.getMonth() + 1
    let day = date.getDate()
    if(month < 10)
        month = '0' + month
    if(day < 10)
        day = '0' + day
    return date.getFullYear() + '-' + month + '-' + day
}

export const getNowDate = () => {
    let date = new Date()
    let nowDate = new Date(date.getFullYear() + '/' + (date.getMonth() + 1) + '/' + (date.getDate()))
    let timestamp = nowDate.getTime()
    return {month: date.getMonth() + 1, day: date.getDate(), timestamp: timestamp, dateString: getDateString(nowDate)}
}

const TrainNoPurchaseModal = ({visible, onBack, raw_data, onRequestClose, onSearch}) => {
    const navigation = useNavigation()

    let nowDate = getNowDate()
    let maxDate = addDay(nowDate, 15)
    const [show, setShow] = useState(false)

    const handleRawData = raw => {
        let len = raw.data.stationName.length
        let tmp = JSON.parse(JSON.stringify(raw.data))
        tmp.isStart[len - 1] = tmp.isArrive[len - 1]
        return tmp
    }

    const handleData = data => {
        const toStr = (t) => {
            return t < 10 ? '0' + t : t
        }

        let startTime = []
        let isStart = []
        let stationName = []
        let stationNo = []
        let nowTime = (new Date()).getTime()

        for(let item of data){
            startTime.push(toStr(item['leave_time']['hours']) + ':' + toStr(item['leave_time']['minutes']))
            isStart.push(item['leave_time']['time'] < nowTime)
            stationName.push(item['station_name'])
            stationNo.push(item['station_no'])
        }
        setData({startTime: startTime, isStart: isStart, stationName: stationName, stationNo: stationNo})
    }

    const [data, setData] = useState(handleRawData(raw_data))
    const [date, setDate] = useState(raw_data.date)
    const [selectArray, setSelectArray] = useState((new Array(data.stationName.length)).fill(false))
    const [selectItems, setSelectItems] = useState([])
    const [change, setChange] = useState(false)
    const [symbol, setSymbol] = useState((new Array(data.stationName.length)).fill(0))
    const [validFlag, setValidFlag] = useState(true)
    const alertModalRef = useRef(null)

    const getMin = () => {
        return selectItems[0] < selectItems[1] ? 0 : 1
    }

    const handlePress = (index) => {
        let i = selectItems.indexOf(index)
        if(i === -1){
            if(selectItems.length === 2){
                setSelectItems([index])
                setSymbol((new Array(data.stationName.length)).fill(0))
                let select = (new Array(data.stationName.length)).fill(false)
                select[index] = true
                setSelectArray(select)
            }
            else{
                let item = selectItems
                item.push(index)
                setSelectItems(item)
                if(selectItems.length === 2){
                    let s = symbol
                    let min = getMin()
                    s[selectItems[min]] = 1
                    s[selectItems[1 - min]] = 2
                    setSymbol(s)
                }
                let select = selectArray
                select[index] = !select[index]
                setSelectArray(select)
            }
        }
        else{
            let item = selectItems
            item.splice(i, 1)
            setSelectItems(item)
            setSymbol((new Array(data.stationName.length)).fill(0))
            let select = selectArray
            select[index] = !select[index]
            setSelectArray(select)
        }
        setChange(!change)
    }

    const StationCard = ({stationName, startTime, selected, disabled, symbol, index}) => {
        return (
            <View style={{flexDirection: 'column', alignItems:'center', marginTop: 0.044 * WINDOWS_WIDTH}}>
                <TouchableHighlight style={{width: 0.2 * WINDOWS_WIDTH, backgroundColor: disabled? 'white' : selected ? '#4098f5' :'#edeff3' , height: 0.13 * WINDOWS_WIDTH, justifyContent: 'center', alignItems: 'center'}}
                                    onPress={() => {
                                        handlePress(index)
                                    }}
                                    underlayColor={'#edeff3'}
                                    disabled={disabled}>
                    <>
                        <Text style={{fontSize: 0.035 * WINDOWS_WIDTH, color: selected? 'white':'black'}}>{stationName}</Text>
                        <Text style={{fontSize: 0.03 * WINDOWS_WIDTH, color: '#b7b9bd'}}>{startTime}</Text>
                    </>
                </TouchableHighlight>
                {symbol === 0 ? <View style={{width: 0.044 * WINDOWS_WIDTH, height: 0.044 * WINDOWS_WIDTH}}><></></View> :
                    <View style={{width: 0.044 * WINDOWS_WIDTH, height: 0.044 * WINDOWS_WIDTH, borderRadius: 0.022 * WINDOWS_WIDTH, backgroundColor: '#4098f5', justifyContent: 'center', alignItems:'center', position: 'relative', top: -0.152 * WINDOWS_WIDTH}}>
                        <View style={{width: 0.04 * WINDOWS_WIDTH, height: 0.04 * WINDOWS_WIDTH, borderRadius: 0.02 * WINDOWS_WIDTH, backgroundColor: 'white'}}>
                            <Text style={{fontSize: 0.028 * WINDOWS_WIDTH, color: '#4098f5',textAlign:'center'}}>{symbol === 1 ? '发' : '到'}</Text>
                        </View>
                    </View>}
            </View>
        )
    }

    const generateLine = (num, key) => {
        let line = []
        for(let i = 0; i < num; ++i){
            line.push(<View key={key + i} style={styles.arrowLine}><></></View>)
        }
        return line
    }

    const BottomArrow = ({flag, symbol}) => {
        return (
            <View key={symbol + 0} style={{width: 0.9 * WINDOWS_WIDTH, flexDirection: flag ? 'row-reverse' : 'row'}}>
                <View key={symbol + 1} style={{justifyContent: 'space-between', alignItems: 'center', width: 0.2 * WINDOWS_WIDTH, height: 0.04 * WINDOWS_HEIGHT}}>
                    {generateLine( 8, symbol + 2)}
                    <View key={symbol + 3} style={styles.bottomArrow}><></></View>
                </View>
            </View>
        )
    }

    const PArrow = ({direction, symbol}) => {
        return(
            <View key={symbol + 0} style={{flexDirection: 'row', justifyContent:'space-between', alignItems: 'center', width: 0.08 * WINDOWS_WIDTH}}>
                {direction === 'left' ? <View key={symbol + 1} style={styles.leftArrow}><></></View>: null}
                {generateLine( 8, symbol + 2)}
                {direction === 'right' ? <View key={symbol + 3} style={styles.rightArrow}><></></View>: null}
            </View>
        )
    }

    const generateTimeLine = () => {
        const generateRow = (i, flag) => {
            let row = []
            for(let item = 2; item >= 0; --item){
                row.push(<StationCard index={i - item} key={"timeline" + (i - item)}
                                      stationName={data.stationName[i - item]}
                                      startTime={data.startTime[i - item]}
                                      disabled={data.isStart[i - item]}
                                      selected={selectArray[i - item]}
                                      symbol={symbol[i - item]}/>)
                if(item !== 0)
                    row.push(<PArrow key={'PArrow' + (i - item)} symbol={'PArrow' + (i - item)} direction={flag? 'right' : 'left'}/>)
            }
            return row
        }

        let timeLine = []

        let len = data.stationName.length

        let i = 2
        let flag = true
        for(; i < len; i += 3) {
            timeLine.push(
                <View key={"container" + i} style={{flexDirection: flag ? 'row' : 'row-reverse', justifyContent: 'space-between', alignItems: 'center', width: 0.9 * WINDOWS_WIDTH}}>
                    {generateRow(i, flag)}
                </View>)
            if(i !== len - 1){
                timeLine.push(<BottomArrow key={'BArrow' + i} symbol={'BArrow' + i} flag={flag}/>)
                flag = !flag
            }
            else{
                return timeLine
            }
        }
        i -= 2
        if(len - i === 1){
            timeLine.push(
                <View key={"container" + i} style={{flexDirection: flag ? 'row' : 'row-reverse', justifyContent: 'space-between', alignItems: 'center', width: 0.9 * WINDOWS_WIDTH}}>
                    <StationCard index={i} key={"timeline" + i} stationName={data.stationName[i]} startTime={data.startTime[i]}
                                 disabled={data.isStart[i]} selected={selectArray[i]} symbol={symbol[i]}/>
                </View>
            )
        }
        else{
            timeLine.push(
                <View key={"high"} style={{width: 0.9 * WINDOWS_WIDTH, flexDirection: flag ? 'row' : 'row-reverse'}}>
                    <View key={"container" + i} style={{flexDirection: flag ? 'row' : 'row-reverse', justifyContent: 'space-between', alignItems: 'center', width: 0.55 * WINDOWS_WIDTH}}>
                        <StationCard index={i} key={"timeline" + i} stationName={data.stationName[i]} startTime={data.startTime[i]}
                                     disabled={data.isStart[i]} selected={selectArray[i]} symbol={symbol[i]}/>
                        <PArrow key={'PArrow' + i} symbol={'PArrow' + i} direction={flag? 'right' : 'left'}/>
                        <StationCard index={i + 1} key={"timeline" + (i + 1)} stationName={data.stationName[i + 1]} startTime={data.startTime[i + 1]}
                                     disabled={data.isStart[i + 1]} selected={selectArray[i + 1]} symbol={symbol[i+1]}/>
                    </View>
                </View>
            )
        }
        return timeLine;
    }

    const generateTestHook = useCavy()
    const TouchableOpacityTest = wrap(TouchableOpacity)

    return (
        <Modal visible={visible} onRequestClose={onRequestClose}>
            <View style={{backgroundColor: OTA_COLOR.themeColor, width: WINDOWS_WIDTH, height: WINDOWS_HEIGHT, alignItems: 'center'}}>
                <View style={{width: WINDOWS_WIDTH, marginBottom: 0.05 * WINDOWS_HEIGHT}}>
                    <TouchableOpacityTest style={{ marginLeft: 0.03 * WINDOWS_WIDTH, marginTop: 0.03 * WINDOWS_HEIGHT, marginBottom: 0.03 * WINDOWS_HEIGHT}}
                                      onPress={onBack} ref={generateTestHook("TimeTable.Modal.GoBack")}>
                        <Ionicons name= {"chevron-back"} size={0.035 * WINDOWS_HEIGHT} color={'white'}/>
                    </TouchableOpacityTest>
                    <Text style={styles.titleStyle}>正在购买{raw_data.trainTag}的车票</Text>
                </View>

                <View style={{flex: 1, backgroundColor: 'white', width: WINDOWS_WIDTH, borderRadius: 0.04 * WINDOWS_WIDTH, alignItems:'center'}}>
                    <View style={{width: 0.9 * WINDOWS_WIDTH}}>

                        <View style={{flexDirection: 'row', alignItems:'center', marginTop: 0.03 * WINDOWS_HEIGHT, marginBottom: 0.01 * WINDOWS_HEIGHT}}>
                            <Ionicons name= {'calendar-outline'} size={0.022 * WINDOWS_HEIGHT} color={'#9e9ea0'} />
                            <Text style={{marginLeft: 0.008 * WINDOWS_HEIGHT, fontSize: 0.017 * WINDOWS_HEIGHT, color: '#9e9ea0'}}>选择出发日期</Text>
                        </View>
                        <TouchableHighlight style={{flexDirection: 'row', alignItems: 'flex-end', marginBottom: 0.015 * WINDOWS_HEIGHT}}
                                         underlayColor={"white"}
                                         onPress={() => setShow(true)} >
                            <>
                                <Text style={{fontSize: 0.03 * WINDOWS_HEIGHT}}>{date.month + '月' + date.day + '日'}</Text>
                                <Text style={{ marginLeft: 0.035 * WINDOWS_WIDTH, fontSize: 0.02 * WINDOWS_HEIGHT, color: "#6faaea"}}>
                                    {weeks[(new Date(date.timestamp)).getDay()]}
                                </Text>
                            </>
                        </TouchableHighlight>

                        <View style={{flexDirection: 'row'}}>
                            {generateDotted(0.9 * WINDOWS_WIDTH)}
                        </View>
                        <View style={{flexDirection: 'row', alignItems:'center', marginTop: 0.03 * WINDOWS_HEIGHT, marginBottom: 0.01 * WINDOWS_HEIGHT}}>
                            <Ionicons name= {'train-outline'} size={0.025 * WINDOWS_HEIGHT} color={'#9e9ea0'} />
                            <Text style={{marginLeft: 0.008 * WINDOWS_HEIGHT, fontSize: 0.017 * WINDOWS_HEIGHT, color: '#9e9ea0'}}>
                                {data.isStart[data.isStart.length - 1] ? '该车次已到站，可更改日期继续购票' :
                                    data.isStart[data.isStart.length - 2] ? '该车次已接近终点，可更改日期继续购票': '请选择出发-到达的站点'}
                            </Text>
                        </View>
                        <ScrollView style={{ width: 0.9 * WINDOWS_WIDTH, height: 0.5 * WINDOWS_HEIGHT }}>
                            {change ? generateTimeLine() : generateTimeLine()}
                        </ScrollView>

                    </View>
                    <TouchableOpacity style={[styles.searchButtonStyle, {backgroundColor: !validFlag || selectItems.length !== 2 ? '#c9c9cb' : "#2296f3"}]}
                                      onPress={() => {
                                          let min = getMin()
                                          navigation.navigate('Purchase',{
                                              isOneWay: true,
                                              trainId: raw_data.trainId,
                                              start_no: data.stationNo[selectItems[min]],
                                              end_no: data.stationNo[selectItems[1-min]],
                                              date: date.timestamp
                                          })
                                          onSearch()
                                      }}
                                      disabled={!validFlag || selectItems.length !== 2}>
                        <Text style={{color: "white", fontSize: 0.05 * WINDOWS_WIDTH}}>购买</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <AlertModal ref={alertModalRef}/>

            <DateModal selectOne={true}
                       minDate={nowDate}
                       maxDate={maxDate}
                       visible={show}
                       onRequestClose={() => setShow(false)}
                       onFinish={(d)=>{
                           setShow(false)
                           let pre = date.timestamp
                           setDate(d)
                           if(pre !== d.timestamp){
                               getTrainInfoByTag(d.timestamp, raw_data.trainTag, data => {
                                   if(data.status > 0){
                                       handleData(data.data.data)
                                       setValidFlag(true)
                                   }
                                   else{
                                       setValidFlag(false)
                                       alertModalRef.current.alert(data.message)
                                   }
                               })
                           }
                       }}/>

        </Modal>
    )
}

const styles = StyleSheet.create({
    titleStyle: {
        marginLeft: 0.05 * WINDOWS_WIDTH,
        color: 'white',
        fontSize: 0.033 * WINDOWS_HEIGHT
    },
    bottomArrow: {
        width: 0,
        height: 0,
        borderTopWidth: 0.01 * WINDOWS_WIDTH,
        borderTopColor: '#acacae',
        borderLeftWidth: 0.006 * WINDOWS_WIDTH,
        borderRightWidth: 0.006 * WINDOWS_WIDTH,
        borderRightColor:'transparent',
        borderLeftColor: 'transparent'
    },
    leftArrow: {
        width: 0,
        height: 0,
        borderTopWidth: 0.006 * WINDOWS_WIDTH,
        borderBottomColor: 'transparent',
        borderBottomWidth: 0.006 * WINDOWS_WIDTH,
        borderRightWidth: 0.01 * WINDOWS_WIDTH,
        borderRightColor:'#acacae',
        borderTopColor: 'transparent'
    },
    rightArrow: {
        width: 0,
        height: 0,
        borderTopWidth: 0.006 * WINDOWS_WIDTH,
        borderBottomColor: 'transparent',
        borderBottomWidth: 0.006 * WINDOWS_WIDTH,
        borderLeftWidth: 0.01 * WINDOWS_WIDTH,
        borderLeftColor:'#acacae',
        borderTopColor: 'transparent'
    },
    arrowLine: {
        width: 0.006 * WINDOWS_WIDTH,
        height: 0.006 * WINDOWS_WIDTH,
        backgroundColor: '#acacae'
    },
    searchButtonStyle: {
        width: 0.8 * WINDOWS_WIDTH,
        height: 0.05 * WINDOWS_HEIGHT,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 0.05 * WINDOWS_WIDTH,
        marginBottom: 0.06 * WINDOWS_HEIGHT,
        position: 'absolute',
        bottom: 0
    },
})

export default TrainNoPurchaseModal;
