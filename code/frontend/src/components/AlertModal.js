import React, {forwardRef, useImperativeHandle, useState} from 'react';
import {Modal, StatusBar, Text, TouchableHighlight, View} from 'react-native';
import {WINDOWS_WIDTH} from '../constants/Constants';
import LinearGradient from 'react-native-linear-gradient';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';

const AlertModal = forwardRef(({}, _ref) => {
    const [visible, setVisible] = useState(false)

    const [content, setContent] = useState(null)

    useImperativeHandle(_ref, ()=>({
        alert: (content)=>{
            setContent(content)
            setVisible(true)
        }
    }))

    return (
        <>
            {visible ? <StatusBar backgroundColor={"rgba(0, 0, 0, 0.5)"}/> : null}
            <Modal visible={visible} animationType={"fade"} transparent={true}>
                <View style={{backgroundColor: "rgba(0, 0, 0, 0.5)", flex: 1}}><></></View>
            </Modal>
            <Modal transparent={true} visible={visible} animationType={"none"} onRequestClose={() => setVisible(false)}>
                <TouchableHighlight style={{backgroundColor: "transparent", flex: 1, alignItems: 'center', justifyContent: "center"}}
                                    underlayColor={"transparent"}
                                    onPress={() => setVisible(false)}>
                    <LinearGradient colors={["white", "#d7e9f7"]}
                                    style={{justifyContent: "center", alignItems: "center", width: 0.65 * WINDOWS_WIDTH, borderRadius: 0.02 * WINDOWS_WIDTH}}>
                        <MaterialCommunityIcons name={"tram-side"} color={"#d7e9f7"} size={0.15 * WINDOWS_WIDTH} style={{position: "absolute", right: 0}}/>
                        <Text style={{fontWeight: "700", fontSize: 0.042 * WINDOWS_WIDTH, marginVertical: 0.05 * WINDOWS_WIDTH}}>温馨提示</Text>
                        <Text style={{color: "#707070"}}>{content}</Text>
                        <TouchableHighlight underlayColor={"#0577f4"} onPress={() => setVisible(false)}
                                            style={{justifyContent: "center", alignItems: "center", backgroundColor: "#4098f5", width: 0.46 * WINDOWS_WIDTH, height: 0.08 * WINDOWS_WIDTH, borderRadius: 0.01 * WINDOWS_WIDTH, marginVertical: 0.05 * WINDOWS_WIDTH}}>
                            <Text style={{color: "white", fontSize: 0.035 * WINDOWS_WIDTH}}>确定</Text>
                        </TouchableHighlight>
                    </LinearGradient>
                </TouchableHighlight>
            </Modal>
        </>

    )
})

export default AlertModal;
