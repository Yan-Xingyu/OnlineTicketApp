import React, {useEffect, useRef, useState} from "react";
import {Animated, FlatList, Image, PanResponder, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import location from "../img/location.png";
import TicketCard from "./TicketCard";
import {WINDOWS_WIDTH} from "../constants/Constants";
import {useNavigation} from "@react-navigation/native";
const Icon = ()=><Image source={location} style={styles.icon}/>;
const Line = ()=><View style={styles.line}/>
const Footer =()=>{
    const navigation = useNavigation();
    return(
        <View style={{flexDirection:"row"}}>
            <Line/>
            <TouchableOpacity
                style={{
                    flexGrow:1
                }}
                onPress={()=>{
                    navigation.navigate("OrderStatus");
                }}
            >
                <Text style={{flex:1,fontSize:14,color:'#dcdcdc',textAlign:'center',marginVertical:20}}>
                    查看所有订单>
                </Text>
            </TouchableOpacity>
        </View>
    )
}

const MyTimeLine= ({data})=>{


    const renderItem= (item,index)=>{
        return(
            <View key={item+index} style={{flexDirection:'column'}}>
                <Line/>
                <View style={{flexDirection:"row",alignItems:'center'}}>
                    <Icon/>
                    <Text  style={{fontSize:22,fontWeight:"bold"}}>
                        {item.item.startTime.substring(6,11).replace('-',"月").replace(" ","日")}
                    </Text>
                </View>
                <View style={{flexDirection:"row"}}>
                    <Line/>
                    <TicketCard order={item.item}/>
                </View>
            </View>
        );};
    return(
            <>
                <FlatList data={[...data]} renderItem={renderItem}
                          keyExtractor={(item,index)=>(item+index)}
                          ListFooterComponent={Footer}

                 />
                <View
                    style={{height:10,width:WINDOWS_WIDTH}}/>
            </>
    )
}
export default MyTimeLine;

const styles = StyleSheet.create({
    line:{
        width:0,
        minHeight:20,
        borderLeftWidth:1,
        marginLeft:20,
        marginRight:30,
        borderColor: '#dcdcdc',
        opacity: 1,
        position:"relative",
        left:8,
    },
    icon:{
        resizeMode: "stretch",
        height: 20,
        width: 20,
        marginVertical:3,
        marginLeft:20,
        marginRight:10,
    },
})
