import React, {forwardRef, useImperativeHandle, useRef, useState} from 'react';
import {
    Animated,
    StyleSheet,
    Text,
    View,
    TouchableHighlight, findNodeHandle, UIManager, TouchableOpacity,
} from 'react-native';
import { weeks, WINDOWS_WIDTH} from '../constants/Constants';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AddressSearchModal from './AddressSearchModal';
import {Card} from 'react-native-shadow-cards';
import {DateModal, Tabs} from './PrivateComponent';
import {getDateString, getNowDate} from './TrainNoPurchaseModal';
import {useNavigation} from '@react-navigation/native';
import {useCavy, wrap} from 'cavy';

const ExchangeButton = ({size, color, style, onPress}) => {
    const outSize = size;
    const inSize = 0.9 * size;
    const arrowWidth = 0.2 * size;
    const arrowHeight = (outSize - inSize) / 4 * Math.sqrt(2);
    const levelMargin = (0.5 - Math.sqrt(2) / 4) * arrowWidth - Math.sqrt(2) / 4 * arrowHeight;
    const verticalMargin = Math.sqrt(2) / 4 * arrowWidth - (Math.sqrt(2) / 2 + 1) * 0.5 * arrowHeight;

    const rotateValue = useRef(new Animated.Value(0)).current;
    const rotateAngle = rotateValue.interpolate({
        inputRange: [0, 1],
        outputRange: ["0deg", "180deg"]
    })

    const rotate = () => {
        rotateValue.setValue(0)
        Animated.timing(rotateValue,{
            toValue: 1,
            duration: 200,
            useNativeDriver: false
        }).start()
    }

    return (
        <TouchableHighlight style={{width: size, height: size, ...style}}
                            onPress={() =>{
                                rotate()
                                onPress()
                            }}
                            underlayColor={"transparent"}>
            <>
                <Animated.View style={{width: size, height:size, transform: [{rotateZ: rotateAngle}]}}>
                    <View style={{width: outSize, height: outSize, borderRadius: 0.5 * outSize, backgroundColor: color, justifyContent: "center", alignItems: "center"}}>
                        <View style={{width: inSize, height: inSize, borderRadius: 0.5 * inSize, backgroundColor: "white"}}><></></View>
                    </View>
                    <View style={{position: "absolute", top: 0.5 * size - arrowHeight - verticalMargin, right: -levelMargin, width: arrowWidth, height: arrowHeight, backgroundColor: color, transform: [{rotateZ: '45deg'}]}}>
                        <></>
                    </View>
                    <View style={{position: "absolute", top: 0.5 * size + verticalMargin, left: -levelMargin, width: arrowWidth, height: arrowHeight, backgroundColor: color, transform: [{rotateZ: '45deg'}]}}>
                        <></>
                    </View>
                    <View style={{position: "absolute", top:0.4 * size, height: 0.1 * size, width: 0.5 * size, backgroundColor: "white"}}><></></View>
                    <View style={{position: "absolute", top:0.5 * size, height: 0.1 * size, marginLeft: 0.5 * size, width: 0.5 * size, backgroundColor: "white"}}><></></View>
                </Animated.View>
                <Ionicons name={"train-outline"} color={color} size={0.7 * size} style={{position: "absolute", top: 0.15 * size, right: 0.15 * size}}/>
            </>
        </TouchableHighlight>
    )
}

const AddressButton = forwardRef(({defaultPlace, onFinish, style, disabled}, _ref) => {
    const [value, setValue] = useState(defaultPlace)
    const [visible, setVisible] = useState(false)

    useImperativeHandle(_ref, () => ({
        getValue: () => value
    }))

    return(
        <>
            <AddressSearchModal visible={visible} setVisible={setVisible} onRequestClose={() => {setVisible(false)}}
                                onFinish={value => {
                                    setValue(value)
                                    if (onFinish !== undefined)
                                        onFinish(value)
                                }}/>
            <TouchableHighlight style={style} onPress={() => setVisible(true)} underlayColor={"transparent"}>
                <Text style={style ===undefined || style.fontSize === undefined ? null : {fontSize: style.fontSize, fontWeight: "bold"}}>{value}</Text>
            </TouchableHighlight>
        </>
    )
})

export const addDay = (date, day) => {
    let newDate = new Date(date.timestamp + day * 86400000)
    return {month: newDate.getMonth() + 1, day: newDate.getDate(), timestamp: newDate.getTime(), dateString: getDateString(newDate)}
}

const PToPSearchTabs = ({style}) => {
    const cardWidth = 0.9 * WINDOWS_WIDTH
    const fontSize =  0.058 * cardWidth
    const navigation = useNavigation();

    const dateModal = useRef(null)
    const [visible, setVisible] = useState(false)

    let nowDate = getNowDate()
    let maxDate = addDay(nowDate, 15)
    const [startDate, setStartDate] = useState(nowDate)
    const [endDate, setEndDate] =useState(addDay(startDate, 3))
    const [endDateDisabled, setEndDateDisabled] = useState(true)
    const dateOpacity = useRef(new Animated.Value(0)).current
    const DateButton = ({date, justifyContent, disabled, onPress}) => {
        return (
            <TouchableHighlight disabled={disabled} underlayColor={"white"} onPress={onPress}
                             style={{flexDirection: "row", justifyContent: justifyContent,alignItems: 'flex-end', width: 0.35 * cardWidth}}>
                <>
                    <Text style={{fontSize: fontSize, fontWeight: "bold"}}>{date.month + '月' + date.day + '日'}</Text>
                    <Text style={{marginLeft: 0.3 * fontSize,fontSize: 0.65 * fontSize, color: "#6faaea"}}>
                        {weeks[(new Date(date.timestamp)).getDay()]}
                    </Text>
                </>
            </TouchableHighlight>
        )
    }


    const leftAddressButton = useRef(null)
    const rightAddressButton = useRef(null)
    const [exchangeSymbol, setExchangeSymbol] = useState(false)

    const leftAddressButtonView = useRef(null)
    const rightAddressButtonView = useRef(null)
    const llSpace = useRef(new Animated.Value(0)).current
    const lrSpace = useRef(new Animated.Value(0)).current
    const rrSpace = useRef(new Animated.Value(0)).current
    const rlSpace = useRef(new Animated.Value(0)).current
    const exchange = () => {
        UIManager.measure(findNodeHandle(leftAddressButtonView.current), (x, y, leftWidth) => {
            UIManager.measure(findNodeHandle(rightAddressButtonView.current), (x, y, rightWidth) => {
                const run = (a, b, c, d) => {
                    Animated.parallel([
                        Animated.timing(a,{
                            toValue: 0.9 * cardWidth - leftWidth,
                            duration: 300,
                            useNativeDriver: false}),
                        Animated.timing(b, {
                            toValue: 0.9 * cardWidth - rightWidth,
                            duration: 300,
                            useNativeDriver: false})
                    ]).start(() => {
                        c.setValue(0)
                        d.setValue(0)
                        setExchangeSymbol(!exchangeSymbol)
                    })
                }

                if(exchangeSymbol){
                    run(lrSpace, rlSpace,llSpace,rrSpace)
                }
                else {
                    run(llSpace, rrSpace,lrSpace,rlSpace)
                }
            })
        })
    }

    const tabs = [{value: "单程", disabled: false}, {value: "往返", disabled: false}]
    const [selectIndex, setSelectIndex] = useState(0)
    const slide = (index) => {
        if(index === 0){
            Animated.timing(dateOpacity, {
                toValue: 0,
                duration: 350,
                useNativeDriver: false
            }).start(() => {setEndDateDisabled(true)})
        }
        else{
            if(endDate.timestamp < startDate.timestamp){
                let end = addDay(startDate, 3)
                if(end.timestamp > maxDate.timestamp){
                    end = maxDate
                }
                setEndDate(end)
            }
            Animated.timing(dateOpacity, {
                toValue: 1,
                duration: 350,
                useNativeDriver: false
            }).start(() => {setEndDateDisabled(false)})
        }
        setSelectIndex(index)
    }

    const [selectBox, setSelectBox] = useState(false)
    const CheckBox = ({text, onClick}) => {
        const [selected, setSelected] = useState(false)
        return (
            <TouchableHighlight underlayColor={"transparent"}
                                style={{flexDirection: "row",  alignItems: "center"}}
                                onPress={()=>{
                                    setSelected(!selected)
                                    if(onClick !== undefined){
                                        onClick(selected)
                                    }
                                }}>
                <>
                    <View style={selected ? styles.selectedStyle : styles.notSelectedStyle}>
                        {selected? <Ionicons name= {"checkmark"}
                                             size={0.025 * WINDOWS_WIDTH}
                                             color={"white"} /> : null}
                    </View>
                    <Text style={{fontSize: 0.032 * WINDOWS_WIDTH, color: "#848386"}}>{text}</Text>
                </>
            </TouchableHighlight>
        )
    }

    const handleQuery = () => {
        let leftAddressValue = leftAddressButton.current.getValue()
        let rightAddressValue = rightAddressButton.current.getValue()

        navigation.navigate('RailInfoList', {
            isOneWay: selectIndex === 0,
            start: exchangeSymbol ? rightAddressValue : leftAddressValue,
            end: exchangeSymbol ? leftAddressValue: rightAddressValue,
            date: startDate.dateString === nowDate.dateString ? (new Date()).getTime() : startDate.timestamp,
            returnDate: endDate.timestamp,
            onlyHighSpeed: selectBox
        })
    }

    const generateTestHook = useCavy()
    const ExchangeButtonTest = wrap(ExchangeButton)
    const DateButtonTest = wrap(DateButton)
    const TouchableOpacityTest = wrap(TouchableOpacity)

    return (
            <Card style={style}>
                <View style={{marginLeft: 0.05 * cardWidth, marginRight: 0.05 * cardWidth}} >

                    <Tabs style={{width: 0.9 * cardWidth, marginTop: 0.05 * cardWidth, marginBottom: 0.05 * cardWidth}} tabs={tabs} onPress={slide}/>

                    <View style={{flexDirection: "row", alignItems: "center", marginBottom: 0.03 *cardWidth}}>
                        <Animated.View style={[{position: "absolute"}, exchangeSymbol? {right: lrSpace}:{left: llSpace}]}
                                       ref={leftAddressButtonView} onLayout={()=>{}}>
                            <AddressButton ref={leftAddressButton} defaultPlace={"北京"} style={{fontSize: fontSize}}/>
                        </Animated.View>

                        <ExchangeButtonTest ref={generateTestHook("PtoPSearch.Exchange")} size={0.08 * cardWidth} style={{marginLeft: 0.41 * cardWidth}} color={"#0c86f0"} onPress={exchange}/>

                        <Animated.View style={[{position: "absolute"}, exchangeSymbol?{left: rlSpace}:{right: rrSpace}]}
                                       ref={rightAddressButtonView} onLayout={()=>{}}>
                            <AddressButton ref={rightAddressButton} defaultPlace={"上海"} style={{fontSize: fontSize}}/>
                        </Animated.View>
                    </View>

                    <View style={{flexDirection: "row", flexWrap: "nowrap", justifyContent: "space-between", paddingTop: 0.025 * cardWidth,
                        paddingBottom: 0.025 * cardWidth, borderColor: "#f2f2f4", borderTopWidth: 0.7, borderBottomWidth: 0.7}}>
                        <DateButtonTest date={startDate} justifyContent={"flex-start"}
                                    onPress={() => {
                                        dateModal.current.startInitialize()
                                        setVisible(true)
                                    }} ref={generateTestHook("PtoPSearch.Start.DateSelect")}/>
                        <Animated.View style={{opacity: dateOpacity}}>
                            <DateButtonTest date={endDate} justifyContent={"flex-end"} disabled={endDateDisabled}
                                        onPress={() => {
                                            dateModal.current.endInitialize(startDate)
                                            setVisible(true)
                                        }} ref={generateTestHook("PtoPSearch.End.DateSelect")}/>
                        </Animated.View>
                    </View>

                    <View style={{flexDirection: "row-reverse", marginVertical: 0.03 * cardWidth}}>
                        <CheckBox text={"仅看高铁/动车"} onClick={(selected) => setSelectBox(selected)}/>
                    </View>

                    <TouchableOpacityTest style={[styles.searchButtonStyle, {marginBottom: 0.04 * cardWidth}]} activeOpacity={0.8} onPress={handleQuery} ref={generateTestHook("PtoPSearch.confirm")}>
                        <Text style={{color: "white", fontSize: 0.05 * WINDOWS_WIDTH}}>查询</Text>
                    </TouchableOpacityTest>
                </View>
                <DateModal selectOne={selectIndex === 0}
                           ref={dateModal}
                           minDate={nowDate}
                           maxDate={maxDate}
                           visible={visible}
                           onRequestClose={() => setVisible(false)}
                           onFinish={(startDate, endDate)=>{
                               setVisible(false)
                               setStartDate(startDate)
                               if(selectIndex !== 0){
                                   setEndDate(endDate)
                               }
                           }}/>
            </Card>
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
    },
    selectedStyle: {
        width: 0.035 * WINDOWS_WIDTH,
        height: 0.035 * WINDOWS_WIDTH,
        borderRadius: 0.0175 * WINDOWS_WIDTH,
        backgroundColor: "#0886ef",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 0.01 * WINDOWS_WIDTH
    },
    notSelectedStyle: {
        width: 0.035 * WINDOWS_WIDTH,
        height: 0.035 * WINDOWS_WIDTH,
        borderRadius: 0.0175 * WINDOWS_WIDTH,
        borderWidth: 1,
        borderStyle: "solid",
        borderColor: "#e5e5e7",
        marginRight: 0.01 * WINDOWS_WIDTH
    },
})

export default PToPSearchTabs;
