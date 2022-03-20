import React, { useRef, useState} from 'react';
import {
    Modal,
    Text,
    StyleSheet,
    TouchableHighlight,
    View,
    SectionList,
    TextInput,
    TouchableOpacity, TouchableWithoutFeedback, Image, TouchableOpacityComponent
} from 'react-native';
import {SearchBar, WingBlank} from '@ant-design/react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {WINDOWS_HEIGHT, WINDOWS_WIDTH} from '../constants/Constants';
import {station_name} from '../constants/station_name';
import location from '../img/location.png'

const cities = ["北京","上海","杭州", "广州","南京", "成都", "西安","郑州", "重庆"]

const letters = ["A", "B", "C", "D", "E", "F", "G","H", "J","K","L","M","N", "P","Q","R","S","T", 'W', 'X', 'Y', 'Z']



const searchFromStation =(text)=>{
    let count = 0;
    let res = [];
    for(var i in station_name){
        const alpha =  station_name[i];
        for(var j in alpha.data)
        {
            const station = alpha.data[j]
            const pat = new RegExp("^" + text);
            if(pat.test(station))
            {
                count+=1;
                res.push(station);
                if(count>=5) return res;
            }
        }
    }
    return res;
}
const AddressSearchModal = ({visible, setVisible, onFinish, onRequestClose}) => {


    const list = useRef(null)

    const input = useRef();
    const [value, setValue] =  useState("")
    const [drawerVisible,setDrawerVisible] = useState(false)
    const [timeOutEventId,setTimeOutEventId] = useState(0);
    const [isStation,setIsStation] = useState(false);
    const [stationList,setStationList] = useState([])
    const onBlur=()=>{
        setDrawerVisible(false)
    }
    const onChangeText = (text)=>{
        setIsStation(false)
        setValue(text)
        clearTimeout(timeOutEventId);
        if(text!=="") {
            setDrawerVisible(true)
            input.current.focus()
            let eventId = setTimeout(() => {
                setStationList(searchFromStation(text))
            }, 50)
            setTimeOutEventId(eventId)
        }
        else {
            setStationList([])
            setDrawerVisible(false)
        }
    }
    const onSubmitEditing = ()=>{
        if(!isStation)input.current.clear();
        input.current.blur();
        console.log("onSubmit")


    }
    const InputProps ={
        value:value,
        ref:input,
        autoCorrect:false,
        maxLength:20,
        multiline:false,
        placeholder:"请输入车站",
        placeholderTextColor:"#dcdcdc",
        selectTextOnFocus:true,
        underlineColorAndroid:'transparent',
    }

    const LetterButton = ({letter, onPress, index}) => {
        const [letterColor, setLetterColor] = useState("#71a5d3")

        return (
            <TouchableHighlight style={styles.labelButtonStyle}
                                onPress={() => onPress(letter, index)}
                                underlayColor={"#0784f0"}
                                onPressIn={()=>setLetterColor("white")}
                                onPressOut={()=>setLetterColor("#71a5d3")}>
                <Text style={{color: letterColor, fontSize: 0.035 * WINDOWS_WIDTH}}>{letter}</Text>
            </TouchableHighlight>
        )
    }

    const CityButton = ({city}) => {
        return (
            <TouchableHighlight style={styles.cityButtonStyle}
                                onPress={()=> {
                                    setVisible(false)
                                    onFinish(city)
                                }} underlayColor={"white"}>
                    <Text style={{fontSize: 0.02 * WINDOWS_HEIGHT}}>{city}</Text>
            </TouchableHighlight>
        )
    }

    const LetterLabel = ({letter}) => {
        return (
            <View style={{backgroundColor: "#efeff4", height: 0.05 * WINDOWS_HEIGHT, justifyContent: "center"}}>
                <WingBlank>
                    <Text style={{fontSize: 0.02 * WINDOWS_HEIGHT}}>{letter}</Text>
                </WingBlank>
            </View>
        )
    }

    const CityLabel = ({city}) => {
        return (
            <WingBlank>
                <TouchableHighlight style={{height: 0.05 * WINDOWS_HEIGHT, justifyContent: "center"}}
                                    onPress={()=>{
                                        setVisible(false)
                                        onFinish(city)
                                    }} underlayColor={"white"}>
                    <Text style={{fontSize: 0.025 * WINDOWS_HEIGHT}}>{city}</Text>
                </TouchableHighlight>
            </WingBlank>
        )
    }

    return (
        <>
            <Modal animationType={'slide'} visible={visible} onRequestClose={onRequestClose}>
                <View style={styles.headerStyle}>
                    <TouchableHighlight style={styles.backStyle} onPress={() => setVisible(false)} underlayColor={"#efeff4"}>
                        <Ionicons name= {"chevron-back"}
                                  size={styles.backStyle.width < styles.backStyle.height ? styles.backStyle.width : styles.backStyle.height}
                                  color={"grey"} />
                    </TouchableHighlight>

                    <View style={[styles.searchBarStyle,{flexDirection:"row"}]}>
                        <TextInput {...InputProps}
                                   onBlur={onBlur}
                                   onChangeText={onChangeText}
                                   onSubmitEditing={onSubmitEditing}
                                   style={{width:0.7*WINDOWS_WIDTH,
                                       paddingBottom:0,
                                       paddingTop:0,
                                       borderRadius:10,
                                       backgroundColor:'white',}}
                        />
                            <Image source={location} style={{resizeMode:'stretch',height:20,width:20,position:'relative',right:25}}/>
                    </View>
                </View>
                {drawerVisible?<View style={{zIndex:99,height:0.8*WINDOWS_HEIGHT,width:WINDOWS_WIDTH}}>
                    {
                        stationList.map((station,index)=>{
                            return(
                                <TouchableOpacity key={index}
                                                  style={{
                                                      height:30,
                                                      borderBottomColor:'#dcdcdc',
                                                      borderBottomWidth:1,
                                                      marginTop:0.01*WINDOWS_HEIGHT,
                                                  }}
                                                  onPress={()=>{
                                                      console.log(station)
                                                      setValue('')
                                                      setDrawerVisible(false)
                                                      setStationList([])
                                                      setIsStation(true)
                                                      setVisible(false)
                                                      onFinish(station)
                                                  }}>
                                    <>
                                            <Text style={{backgroundColor:'transparent',
                                                width:WINDOWS_WIDTH,
                                                height:0.035*WINDOWS_HEIGHT,

                                                textAlignVertical:'center',
                                                marginLeft:0.04*WINDOWS_WIDTH,
                                            }}>{station}</Text>
                                    </>
                                </TouchableOpacity>
                            )
                        })
                    }
                </View>:

                <View>
                    <SectionList ListHeaderComponent={
                        <>
                            <WingBlank>
                                <View style={{height: 0.24 * WINDOWS_HEIGHT, marginTop: 0.03 * WINDOWS_HEIGHT}}>
                                    <Text>热门城市</Text>
                                    <View style={{flexDirection: "row", justifyContent: "space-between", flexWrap: "wrap"}}>
                                        {cities.map((city, index) =>(<CityButton key={index} city={city}/>))}
                                    </View>
                                </View>
                            </WingBlank>
                        </>
                    }
                                 sections={station_name}
                                 keyExtractor={(item, index) => item}
                                 renderItem={({item}) => <CityLabel city={item}/>}
                                 renderSectionHeader={({ section: { title } }) => <LetterLabel letter={title} />}
                                 getItemLayout={(data, index) => {
                                     const length = 0.05 * WINDOWS_HEIGHT
                                     const offset = (0.05 * index) * WINDOWS_HEIGHT
                                     return {length: length, offset: offset, index}
                                 }}
                                 ref={list}
                    />


                    <View style={{position: "absolute", top: 0, right: 0, height: WINDOWS_HEIGHT, justifyContent: "center"}}>
                        <View style={{height: 0.8 * WINDOWS_HEIGHT, justifyContent: "space-around"}}>
                            {letters.map((letter, index) => (
                                <LetterButton key={index} letter={letter} index={index}
                                              onPress={(data, key)=> {
                                                  list.current.scrollToLocation({sectionIndex: key, itemIndex: 0, viewOffset: 0})
                                              }} />
                            ))}
                        </View>
                    </View>
                </View>}

            </Modal>
        </>

    )
}

const styles = StyleSheet.create({
    headerStyle: {
        flexDirection: 'row',
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#efeff4"
    },
    backStyle: {
        width: 0.08 * WINDOWS_WIDTH,
        height: 0.08 * WINDOWS_HEIGHT,
        alignItems: "center",
        justifyContent: "center"
    },
    searchBarStyle: {
        width: 0.8 * WINDOWS_WIDTH,
        height: 0.1 * WINDOWS_HEIGHT,
        alignItems: "center",
        justifyContent: "center"
    },
    cityButtonStyle: {
        width: 0.28 * WINDOWS_WIDTH,
        height: 0.05 * WINDOWS_HEIGHT,
        borderRadius: 0.015 * WINDOWS_HEIGHT,
        backgroundColor: "#efeff4",
        alignItems: "center",
        justifyContent: "center",
        margin: 0.01 * WINDOWS_WIDTH
    },
    labelButtonStyle: {
        width: 0.045 * WINDOWS_WIDTH,
        height: 0.045 * WINDOWS_WIDTH,
        borderRadius: 0.0225 * WINDOWS_WIDTH,
        justifyContent: "center",
        alignItems: "center"
    }
})

export default AddressSearchModal;
