import React, {forwardRef,useImperativeHandle, useRef} from 'react';
import {
    Modal,
    Text,
    TouchableHighlight,
    View,
    StyleSheet,
    Animated,
} from 'react-native';
import {Calendar} from 'react-native-calendars';
import {useState} from 'react';
import {WINDOWS_HEIGHT, WINDOWS_WIDTH} from '../constants/Constants';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {addDay} from './PToPSearchTabs';
import {handleDate} from './TrainNoPurchaseModal';
import {useCavy, wrap} from 'cavy';

const Tab = ({title, selectedSymbol, fontSize,index, style, onPress, disabled}) => {
    return (
        <TouchableHighlight
            onPressOut={() => onPress(title, index)}
            style={{...style, justifyContent: "center", alignItems: "center"}}
            underlayColor={"transparent"} disabled={disabled}>
            <Text style={{
                fontWeight: selectedSymbol === title ? "700" : "400",
                textAlign: "center",
                fontSize: fontSize,
                opacity: disabled ? 0.5 : 1
            }}>
                {title}
            </Text>
        </TouchableHighlight>
    )
}

export const Tabs = ({style, tabs, onPress}) => {
    const [selected, setSelected] = useState(tabs[0])
    const marginLeft = useRef(new Animated.Value(0.01 * style.width)).current
    const slide = (index) => {
        Animated.timing(marginLeft, {
            toValue: (index * 0.5 + 0.01) * style.width,
            duration: 250,
            useNativeDriver: false
        }).start()
    }

    return (
        <View style={{flexDirection: "row", backgroundColor: "#ebecf2",
            borderRadius: 0.011 * style.width,
            height: 0.09 * style.width, alignItems: "center", ...style}}>
            <Animated.View style={{position: "absolute",
                backgroundColor: "white",
                width: 0.48 * style.width,
                left: marginLeft,
                height: 0.07 * style.width,
                borderRadius: 0.011 * style.width
            }}>
            </Animated.View>
            {tabs.map((tab, index) =>
                <Tab key={tab.value + index}
                     title={tab.value}
                     index={index}
                     selectedSymbol={selected}
                     onPress={(title, index) => {
                         setSelected(title)
                         slide(index)
                         onPress(index)
                     }}
                     disabled={tab.disabled}
                     style={{width: 0.5 * style.width}}
                     fontSize={0.042 * style.width}
                />)}
        </View>
    )
}

export const DateModal = forwardRef(({selectOne, visible, onRequestClose, minDate, maxDate, onFinish}, _ref) => {
    const [month, setMonth] = useState(minDate.month)

    const [startDate, setStartDate] = useState(minDate)
    const [endDate, setEndDate] = useState(addDay(minDate, 3))
    const startDateOpacity = useRef(new Animated.Value(0)).current
    const endDateOpacity = useRef(new Animated.Value(0)).current
    const [marked, setMarked] = useState(null)

    const tabs = ["出发日期", "返回日期"]
    const tabWidth = 0.9 * WINDOWS_WIDTH
    const marginLeft = useRef(new Animated.Value(0.01 * tabWidth)).current
    const [selected, setSelected] = useState(tabs[0])
    const [disabled, setDisabled] = useState(true)

    const generateTestHook = useCavy()
    const startAnime = (index, date) => {
        if(index === 1){
            Animated.timing(startDateOpacity,{
                toValue: 1,
                duration: 400,
                useNativeDriver: false
            }).start(()=>setMarked(null))
            Animated.sequence([
                Animated.delay(250),
                Animated.timing(marginLeft, {
                    toValue: 0.51 * tabWidth,
                    duration: 400,
                    useNativeDriver: false
                })
            ]).start()
        }
        else if(index === 0){
            Animated.parallel([
                Animated.timing(marginLeft, {
                    toValue: 0.01 * tabWidth,
                    duration: 400,
                    useNativeDriver: false
                }),
                Animated.timing(startDateOpacity,{
                    toValue: 0,
                    duration: 400,
                    useNativeDriver: false
                }),
                Animated.timing(endDateOpacity,{
                    toValue: 0,
                    duration: 400,
                    useNativeDriver: false
                })
            ]).start()
        }
        else{
            Animated.timing(endDateOpacity,{
                toValue: 1,
                duration: 200,
                useNativeDriver: false
            }).start(()=>onFinish(startDate, date))
        }
    }

    useImperativeHandle(_ref, () => ({
        startInitialize: () => {
            marginLeft.setValue(0.01 * tabWidth)
            startDateOpacity.setValue(0)
            endDateOpacity.setValue(0)
            setMarked(null)
            setSelected(tabs[0])
            setDisabled(true)
        },
        endInitialize: (start) => {
            setStartDate(start)
            setMonth(start.month)
            marginLeft.setValue(0.51 * tabWidth)
            startDateOpacity.setValue(1)
            endDateOpacity.setValue(0)
            setMarked(null)
            setSelected(tabs[1])
            setDisabled(false)
        }
    }))

    const getMarkedDate = (date) => {
        let mark = {}
        mark[date.dateString] = {selected: true, selectedColor: "#1E90FF"}
        return mark
    }

    return (
        <>
            <Modal animationType={'fade'} visible={visible} animated={true} transparent={true}>
                    <View style={styles.backgroundShadow}><></></View>
            </Modal>

            <Modal animationType={"slide"}
                visible={visible}
                transparent={true}
                onRequestClose={() => {
                    onRequestClose()
                    setMonth(minDate.month)
                }}>
                <TouchableHighlight
                    style={{backgroundColor: "transparent", flex: 1}}
                    onPressOut={() => {
                        onRequestClose()
                        setMonth(minDate.month)
                    }}
                    underlayColor={"transparent"}>
                    <></>
                </TouchableHighlight>
                <View style={styles.calendarContainer}>
                    <View style={{alignItems: "center", marginTop: 0.06 * WINDOWS_WIDTH}}>
                        {selectOne ? null :
                            <>
                                <View style={{flexDirection: "row", backgroundColor: "#ebecf2",
                                    borderRadius: 0.011 * tabWidth,
                                    height: 0.09 * tabWidth, alignItems: "center"}}>
                                    <Animated.View style={{position: "absolute",
                                        backgroundColor: "white",
                                        width: 0.48 * tabWidth,
                                        left: marginLeft,
                                        height: 0.07 * tabWidth,
                                        borderRadius: 0.011 * tabWidth
                                    }}>
                                    </Animated.View>
                                    <Tab title={tabs[0]} style={{width: 0.5 * tabWidth}} fontSize={0.042 * tabWidth} index={0}
                                         selectedSymbol={selected} disabled={false}
                                         onPress={(title, index) => {
                                             if(selected !== title){
                                                 setMarked(null)
                                                 setDisabled(true)
                                                 setSelected(tabs[0])
                                                 startAnime(index)
                                             }
                                         }}/>
                                    <Tab title={tabs[1]} style={{width: 0.5 * tabWidth}} fontSize={0.042 * tabWidth} index={1}
                                         selectedSymbol={selected} disabled={disabled} onPress={()=>{}}/>
                                </View>

                                <View style={{flexDirection: "row"}}>
                                    <Animated.View style={{opacity: startDateOpacity}}>
                                        <Text style={{fontSize: 0.03 * WINDOWS_WIDTH,color: "#1E90FF", width: 0.45 * WINDOWS_WIDTH, textAlign: "center"}}>
                                            {startDate.month+'月'+startDate.day+'日'}
                                        </Text>
                                    </Animated.View>
                                    <Animated.View style={{opacity: endDateOpacity}}>
                                        <Text style={{fontSize: 0.03 * WINDOWS_WIDTH,color: "#1E90FF", width: 0.45 * WINDOWS_WIDTH, textAlign: "center"}}>
                                            {endDate.month+'月'+endDate.day+'日'}
                                        </Text>
                                    </Animated.View>
                                </View>
                            </>}

                    </View>
                    <Calendar style={{marginBottom: 0.06 * WINDOWS_WIDTH}}
                              current={selected === tabs[0] ? minDate.dateString : startDate.dateString}
                              minDate={selected === tabs[0] ? minDate.dateString : startDate.dateString}
                              maxDate={maxDate} ref={generateTestHook("DateSelect")}
                              onDayPress={day => {
                                  let date = handleDate(day)
                                  if(selectOne){
                                      setMarked(getMarkedDate(date))
                                      onFinish(date)
                                      setMonth(minDate.month)
                                  }
                                  else{
                                      if(selected === tabs[0]){
                                          setMarked(getMarkedDate(date))
                                          setStartDate(date)
                                          setDisabled(false)
                                          setSelected(tabs[1])
                                          startAnime(1)
                                      }
                                      else{
                                          setEndDate(date)
                                          setMarked(getMarkedDate(date))
                                          startAnime(3, date)
                                      }
                                  }
                              }}
                              markedDates={marked}
                              onMonthChange={date => setMonth(date.month)}
                              disableArrowLeft={selected === tabs[0] ? month === minDate.month : month === startDate.month}
                              disableArrowRight={month === maxDate.month}/>
                </View>
            </Modal>
        </>
    )
})

export const PrivateKeyboard = forwardRef(({onKeyPress, onSubmit, onCancel, buttonValues, submitLabel, cancelLabel}, _ref) => {

    const generateTestHook = useCavy()
    const TouchableHighlightTest = wrap(TouchableHighlight)

    const PrivateKeyButton = ({value, label, color, underlayColor, onPress, icon, width, height, fontSize, fontColor}) => {
        return (
            <TouchableHighlightTest style={{width: width, height: height, borderRadius: 0.1 * width, marginBottom: 0.03 * width,
                justifyContent: "center", alignItems: "center", backgroundColor: color}}
                                underlayColor={typeof underlayColor === "undefined" ? '#e8e6ee' : underlayColor}
                                onPress={()=>onPress(value, label)} ref={generateTestHook("TimeTable.Keyboard"+value)}>
                <>
                    {typeof value === "undefined" ? null : <Text style={{fontSize: fontSize, color: fontColor}}>{value}</Text>}
                    {typeof icon === "undefined" ? null : <Ionicons name={icon} size={fontSize} color={fontColor}/>}
                </>
            </TouchableHighlightTest>
        )
    }

    const bottom = useRef(new Animated.Value(-0.3 * WINDOWS_HEIGHT)).current
    const rowNo = buttonValues[0].length
    const buttonWidth = WINDOWS_WIDTH / rowNo - 0.005 * WINDOWS_WIDTH;

    const display = () => {
        Animated.timing(bottom, {toValue: 0, duration: 300, useNativeDriver:false}).start()
    }

    const hide = () => {
        Animated.timing(bottom, {toValue: - 0.3 * WINDOWS_HEIGHT, duration: 300, useNativeDriver:false}).start()
    }

    useImperativeHandle(_ref, ()=> ({
        display: display,
        hide: hide
    }))

    return (
        <Animated.View style={[styles.keyboardStyle, {bottom: bottom}]}>
            {buttonValues.map((item, index) =>
                <View key={index} style={{flexDirection: 'row', justifyContent: "space-between"}}>
                    {item.map((button, index) =>
                        <PrivateKeyButton key={index}
                                       value={button.value} label={button.label}
                                       icon={button.icon}
                                       onPress={(value, label) => {
                                           if(label === submitLabel){
                                               if(typeof onSubmit !== "undefined")
                                                   onSubmit()
                                           }
                                           else if(label === cancelLabel){
                                               if(typeof onCancel !== "undefined")
                                                   onCancel()
                                           }
                                           else if(typeof onKeyPress !== "undefined"){
                                                   onKeyPress(value)
                                           }
                                       }}
                                       width={buttonWidth}
                                       height={0.6 * buttonWidth}
                                       color={"white"}
                                       fontSize={0.3 * buttonWidth} fontColor={button.fontColor}/>
                    )}
                </View>
            )}
        </Animated.View>
    )
})


export const TrainNoInput = forwardRef(({style, fontSize, underlayColor, value, placeholder, onPress}, _ref) => {

    //光标闪烁的动画
    const cursorOpacity = useRef(new Animated.Value(0)).current

    const generateTestHook = useCavy()
    const TouchableHighlightTest = wrap(TouchableHighlight)
    const animation = Animated.loop(
        Animated.sequence([
            Animated.timing(cursorOpacity,{toValue: 1, duration: 1, useNativeDriver: false}),
            Animated.delay(500),
            Animated.timing(cursorOpacity, {toValue: 0, duration: 1, useNativeDriver: false}),
            Animated.delay(300)
        ])
    )

    useImperativeHandle(_ref, () => ({
        startTwinkle: () => {
            animation.reset()
            animation.start()
        },
        stopTwinkle: () => {
            animation.reset()
            Animated.timing(cursorOpacity,{toValue: 0, duration: 1, useNativeDriver: false}).start()
        }
    }))

    return (
        <>
            <TouchableHighlightTest style={{flexDirection: "row", ...style}}
                                onPressOut={onPress}
                                underlayColor={underlayColor} ref={generateTestHook("TimeTable.Input")}>
                <>
                    <Text style={{fontSize: fontSize}}>{value}</Text>
                    <Animated.View style={{opacity: cursorOpacity}}>
                        <Text style={{fontSize: fontSize}}>|</Text>
                    </Animated.View>
                    {value === "" ? <Text style={{color: "grey", fontSize: fontSize}}>{placeholder}</Text> : null}
                </>
            </TouchableHighlightTest>
        </>
    )
})

const styles = StyleSheet.create({
    calendarContainer: {
        position: "absolute",
        bottom: 0,
        width: WINDOWS_WIDTH,
        backgroundColor:"white",
        borderTopRightRadius: 0.04 * WINDOWS_WIDTH,
        borderTopLeftRadius: 0.04 * WINDOWS_WIDTH,
    },
    backgroundShadow: {
        position: "absolute",
        top: 0,
        width: WINDOWS_WIDTH,
        height: WINDOWS_HEIGHT,
        backgroundColor: "rgba(0, 0, 0, 0.4)"
    },
    keyboardStyle: {
        backgroundColor: "#e8e6ee",
        position: "absolute",
        width: WINDOWS_WIDTH,
        marginTop: 0.01 * WINDOWS_HEIGHT
    }
})
