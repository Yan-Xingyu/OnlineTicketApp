import React from 'react';
import {Text, View, StyleSheet, StatusBar, TouchableOpacity} from 'react-native';
import {WINDOWS_WIDTH, WINDOWS_HEIGHT, OTA_COLOR} from '../constants/Constants';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useCavy, wrap} from 'cavy';
import PToPSearchTabs from './PToPSearchTabs';

const HomeSearchBox = ({navigation}) => {
    const generateTestHook = useCavy()

    const HomeIcon = ({title, icon, onPress}) => {
        return (
            <TouchableOpacity style={{justifyContent: 'center', alignItems: 'center', width: 0.2 * WINDOWS_WIDTH}}
                              onPress={onPress}>
                <Ionicons name= {icon}
                          size={0.1 * WINDOWS_WIDTH}
                          color={OTA_COLOR.themeColor} />
                <Text style={{fontSize: 0.03 * WINDOWS_WIDTH}}>{title}</Text>
            </TouchableOpacity>
        )
    }

    const HomeIconTest = wrap(HomeIcon)

    return(
        <View style={styles.contentStyle}>
            <StatusBar backgroundColor={OTA_COLOR.themeColor} barStyle={ 'dark-content'}/>

            <View style={{flexDirection: 'column', backgroundColor: OTA_COLOR.themeColor, height: 200, width: WINDOWS_WIDTH}}>
                <View style={{flexDirection: 'row-reverse', marginTop: 0.03 * WINDOWS_HEIGHT, paddingLeft: 0.05 * WINDOWS_WIDTH, paddingRight: 0.05 * WINDOWS_WIDTH, justifyContent: "space-between", alignItems: "center"}}>
                    <MaterialCommunityIcons name={"qrcode-scan"} size={0.04 * WINDOWS_HEIGHT} color={"white"}/>
                    <Ionicons name={"add-circle-outline"} size={0.05 * WINDOWS_HEIGHT} color={"white"}/>
                </View>
            </View>

            <PToPSearchTabs style={{position: "relative", top: -0.1 * WINDOWS_HEIGHT}}/>

            <View style={{width: 0.9 * WINDOWS_WIDTH, flexDirection: 'row', justifyContent: 'space-around'}}>
                <HomeIconTest ref={generateTestHook("Tab.Home.TimeTableIcon")} icon={'calendar-outline'} title={'时刻表'} onPress={()=>navigation.navigate('TrainNoSearch')}/>
                <HomeIcon icon={'card-outline'} title={'银行卡绑定'}/>
                <HomeIcon icon={'car-outline'} title={'呼叫快车'}/>
                <HomeIcon icon={'fast-food-outline'} title={'餐饮服务'}/>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    contentStyle: {
        alignItems: "center",
        width: WINDOWS_WIDTH,
        height: WINDOWS_HEIGHT,
    }
})

export default HomeSearchBox;
