import React, {useEffect, useState} from 'react';
import {StatusBar, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {OTA_COLOR, WINDOWS_HEIGHT, WINDOWS_WIDTH} from '../constants/Constants';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {Card} from 'react-native-shadow-cards';
import {weeks} from '../constants/Constants';
import TrainNoPurchaseModal from '../components/TrainNoPurchaseModal';
import {generateDotted} from '../components/TrainNoPurchaseModal';
import {useCavy, wrap} from 'cavy';

const TrainNoDetailView = ({route, navigation}) => {
    const {TrainNo, date, raw_data, trainId} = route.params
    const [data, setData] = useState(null)
    const [allTime, setAllTime] = useState(null)
    const [visible, setVisible] = useState(false)
    const generateTestHook = useCavy()
    const TouchableOpacityTest = wrap(TouchableOpacity)

    useEffect(() => {
        handleData(raw_data)
    }, [])

    const SquareText = ({color, text}) => {
        return (
            <View style={{width: 0.04 * WINDOWS_WIDTH, height: 0.04 * WINDOWS_WIDTH, backgroundColor: color, borderRadius: 0.01 * WINDOWS_WIDTH, justifyContent: 'center', alignItems: 'center'}}>
                <Text style={{color: 'white', fontSize: 0.03 * WINDOWS_WIDTH}}>{text}</Text>
            </View>
        )
    }

    const handleData = (data) => {
        const toStr = (t) => {
           return t < 10 ? '0' + t : t
        }

        let startTime = []
        let isArrive = []
        let isStart = []
        let stationName = []
        let stationNo = []
        let stopTime = []
        let arriveTime = []
        let isOnTime = []
        let nowTime = (new Date()).getTime()

        for(let item of data){
            startTime.push(toStr(item['leave_time']['hours']) + ':' + toStr(item['leave_time']['minutes']))
            isArrive.push(item['arrive_time']['time'] < nowTime)
            isStart.push(item['leave_time']['time'] < nowTime)
            stationName.push(item['station_name'])
            stationNo.push(item['station_no'])
            stopTime.push(item['stop_time'] + '分')
            arriveTime.push(toStr(item['arrive_time']['hours']) + ':' + toStr(item['arrive_time']['minutes']))
            isOnTime.push(item['arrive_time']['time'] < nowTime ? '准时' : '预计正点')
        }
        stopTime[0] = '始发站'
        stopTime[stopTime.length - 1] = '终点站'
        isStart[isStart.length - 1] = false

        let all = (data[data.length - 1]['arrive_time']['time'] - data[0]['leave_time']['time']) / 1000
        setAllTime(parseInt(all / 3600) + '小时' + parseInt(all % 3600 / 60) + '分钟')
        setData({startTime: startTime, isArrive: isArrive, isStart: isStart, stationName: stationName, stationNo: stationNo, stopTime: stopTime, arriveTime: arriveTime, isOnTime: isOnTime})
    }

    const generateCol = (title, index, cols) => {
        let retCols = []

        retCols.push(
            <View key={index + index + 0} style={styles.timeLineContainer}>
                <Text style={styles.timeLineText} key={index + 0}>{cols[0]}</Text>
            </View>
        )
        for(let i = 1; i < cols.length - 1; ++ i){
            retCols.push(
                <View key={index + index + i} style={styles.timeLineContainer}>
                    <Text style={{color: 'grey', ...styles.timeLineText}} key={index + i}>{cols[i]}</Text>
                </View>)
        }
        retCols.push(
            <View key={index + index + (cols.length - 1)} style={styles.timeLineContainer}>
                <Text key={index + (cols.length - 1)} style={styles.timeLineText}>{cols[cols.length - 1]}</Text>
            </View>)

        return (
            <View key={index} style={{alignItems:'center'}}>
                <View key={index + cols.length} style={styles.timeLineContainer}>
                    <Text key={index + (cols.length + 1)} style={{color: 'grey', ...styles.timeLineText}}>{title}</Text>
                </View>
                {retCols}
            </View>
        )
    }

    const generateLine = (index) => {
        const Circle = ({color}) => {
            return (
                <View style={{width: 0.012 * WINDOWS_HEIGHT, height: 0.012 * WINDOWS_HEIGHT, borderRadius: 0.006 * WINDOWS_HEIGHT, backgroundColor: color}}><></></View>
            )
        }

        const Line = ({color}) => {
            return (
                <View style={{width: 0.002 * WINDOWS_HEIGHT,height: 0.024* WINDOWS_HEIGHT, backgroundColor: color}}><></></View>
            )
        }
        let timeLine = []
        let i = 0;
        for(; i < data.isArrive.length; ++i){
            if(data.isArrive[i])
                timeLine.push(<Circle key={index + i} color={'#3898f5'}/>)
            else{
                timeLine.push(<Circle key={index + i} color={'#d4d3d5'}/>)
                ++i
                break
            }
            if(data.isStart[i])
                timeLine.push(<Line key={index + 50 + i} color={'#3898f5'}/>)
            else{
                ++i;
                break
            }
        }
        for(;i < data.isArrive.length; ++i){
            timeLine.push(<Line key={index + 50 + i} color={'#d4d3d5'}/>)
            timeLine.push(<Circle key={index + i} color={'#d4d3d5'}/>)
        }

        return (
            <View key={index} style={{alignItems: 'center', marginTop: 0.058 * WINDOWS_HEIGHT}}>
                {timeLine}
            </View>
        )
    }

    const generateContent = () => {
        return [generateCol('发时', 'startTime', data.startTime),
                generateLine('line'),
                generateCol('停靠车站', 'stationName',  data.stationName),
                generateCol('停留', 'stopTime', data.stopTime),
                generateCol('到时', 'arriveTime', data.arriveTime),
                generateCol('正晚点', 'isOnTime', data.isOnTime)]
    }

    return (
        <>
            <StatusBar backgroundColor={OTA_COLOR.themeColor}/>
            <View style={{backgroundColor: OTA_COLOR.themeColor, flex: 1, alignItems: 'center'}}>
                <View style={{flexDirection: 'row', justifyContent: "space-between", alignItems: "center", width: WINDOWS_WIDTH}}>
                    <TouchableOpacityTest style={{ marginLeft: 0.03 * WINDOWS_WIDTH}} onPress={() => navigation.goBack()} ref={generateTestHook("TimeTable.GoBack")}>
                        <Ionicons name= {"chevron-back"} size={0.035 * WINDOWS_HEIGHT} color={'white'}/>
                    </TouchableOpacityTest>
                    <View style={{flexDirection: 'row', alignItems: "center", justifyContent: 'center'}}>
                        <Text style={{color: 'white', fontSize:0.025 * WINDOWS_HEIGHT, marginRight: 0.005 * WINDOWS_WIDTH}}>{TrainNo}</Text>
                        <View style={styles.headerCircle}>
                            <Text style={{ opacity: 0.8, color: 'white', fontSize:0.013 * WINDOWS_HEIGHT, position:'relative', top: -0.001 * WINDOWS_HEIGHT}}>运行图</Text>
                        </View>
                    </View>
                    <TouchableOpacityTest style={{marginRight: 0.03 * WINDOWS_WIDTH}} onPress={()=> {setVisible(true)}} ref={generateTestHook("TimeTable.gotoOrder")}>
                        <Text style={{color: 'white', fontSize: 0.018 * WINDOWS_HEIGHT}}>去订票</Text>
                    </TouchableOpacityTest>
                </View>

                <Card style={{ width: 0.9 * WINDOWS_WIDTH, alignItems: 'center', bottom: -0.02 * WINDOWS_HEIGHT}}>
                    <View style={{width: 0.8 *WINDOWS_WIDTH, flexDirection: 'row', justifyContent: 'space-between', marginTop: 0.015 * WINDOWS_HEIGHT}}>
                        <View style={{flexDirection: 'row'}}>
                            <Text style={{fontSize: 0.018 * WINDOWS_HEIGHT, marginRight: 0.01 * WINDOWS_HEIGHT}}>候车室</Text>
                            <Text style={{fontSize: 0.018 * WINDOWS_HEIGHT, color: '#61a1f3'}}>候车厅</Text>
                        </View>
                        <View style={{flexDirection: 'row'}}>
                            <Text style={{fontSize: 0.018 * WINDOWS_HEIGHT, marginRight: 0.01 * WINDOWS_HEIGHT}}>检票口</Text>
                            <Text style={{fontSize: 0.018 * WINDOWS_HEIGHT, color: '#61a1f3'}}>进站检票口</Text>
                        </View>
                    </View>

                    <View style={{flexDirection: 'row', marginTop: 0.01 * WINDOWS_HEIGHT, marginBottom: 0.01 * WINDOWS_HEIGHT}}>
                        {generateDotted(0.8 * WINDOWS_WIDTH)}
                    </View>

                    <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: 0.8 * WINDOWS_WIDTH, marginBottom: 0.015 *WINDOWS_HEIGHT}}>
                        <View style={{flexDirection: 'column'}}>
                            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                <SquareText text={"始"} color={'orange'}/>
                                <Text style={{marginRight: 0.005 * WINDOWS_HEIGHT,fontSize:  0.025 * WINDOWS_HEIGHT}}>{data === null ? null : data.stationName[0]}</Text>
                            </View>
                            <Text style={{fontSize: 0.015 * WINDOWS_HEIGHT, color: 'grey'}}>{data === null ? null : data.startTime[0]}</Text>
                        </View>

                        <View style={{flexDirection: 'column', alignItems: 'center'}}>
                            <Text style={{fontSize: 0.016 *WINDOWS_HEIGHT, color: 'grey'}}>
                                {date.month + '月' + date.day + '日 ' + weeks[new Date(date.timestamp).getDay()]}
                            </Text>
                            <Text style={{fontSize: 0.014 *WINDOWS_HEIGHT, color: 'grey'}}>
                                {allTime === null ? null : allTime}
                            </Text>
                        </View>

                        <View style={{flexDirection: 'column', alignItems: 'flex-end'}}>
                            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                <SquareText text={"终"} color={'green'}/>
                                <Text style={{marginLeft: 0.005 * WINDOWS_HEIGHT, fontSize:  0.025 * WINDOWS_HEIGHT}}>
                                    {data === null ? null : data.stationName[data.stationName.length - 1]}
                                </Text>
                            </View>
                            <Text style={{fontSize: 0.015 * WINDOWS_HEIGHT, color: 'grey'}}>
                                {data === null ? null : data.startTime[data.startTime.length - 1]}
                            </Text>
                        </View>
                    </View>
                </Card>

                <View style={{flex: 1, backgroundColor: 'white', width: WINDOWS_WIDTH, borderRadius: 0.04 * WINDOWS_WIDTH, alignItems:'center'}}>
                    <View style={{width: 0.95 * WINDOWS_WIDTH, flexDirection: 'row', justifyContent: 'space-between', marginTop: 0.04 * WINDOWS_HEIGHT}}>
                        {data === null ? null : generateContent()}
                    </View>
                </View>
            </View>
            {data === null ? null :
                <TrainNoPurchaseModal visible={visible}
                                      onBack={()=>setVisible(false)}
                                      raw_data={{trainId: trainId, trainTag: TrainNo, data: data, date: date}}
                                      onRequestClose={() => setVisible(false)}
                                      onSearch={() => setVisible(false)}/>}
        </>
    )
}

export default TrainNoDetailView;

const styles = StyleSheet.create({
    headerCircle: {
        borderStyle: 'solid',
        borderWidth: 0.001 * WINDOWS_HEIGHT,
        borderColor: 'white',
        height: 0.02 * WINDOWS_HEIGHT,
        width: 0.05 * WINDOWS_HEIGHT,
        borderRadius: 0.01 * WINDOWS_HEIGHT,
        opacity: 0.8,
        alignItems: 'center'
    },
    timeLineText: {
        fontSize: 0.016 * WINDOWS_HEIGHT
    },
    timeLineContainer: {
        height: 0.02 * WINDOWS_HEIGHT,
        marginTop: 0.016 *WINDOWS_HEIGHT
    }
})
