import React, {useCallback, useEffect, useRef,useState,Component} from 'react';
import {Modal, Text, StyleSheet, TouchableHighlight, View, SectionList, FlatList, ScrollView} from 'react-native';
import {SearchBar, WingBlank, WhiteSpace, Button} from '@ant-design/react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {WINDOWS_HEIGHT, WINDOWS_WIDTH} from '../constants/Constants';
import item from "react-native-calendars/src/calendar-list/item";
import {getStationNameCallBack,getStationNameCallBackChange} from "../services/TicketService";



const timeTable =["00:00 — 08:00","08:00 — 14:00","14:00 — 19:00","19:00 — 24:00"]

const StartStationButton = ({StartStation,onFinish,setStart}) => {
    return (
        <TouchableHighlight style={styles.cityButtonStyle}
                            onPress={() => {
                          //      onFinish(1, StartStation);
                                setStart()
                            }
                            } underlayColor={"white"}>
            <Text style={{fontSize: 0.02 * WINDOWS_HEIGHT}}>{StartStation}</Text>
        </TouchableHighlight>
    )
}
const StartBlueButton = ({StartStation,onFinish,setStart}) => {
    return (
        <TouchableHighlight style={styles.cityButtonBlueStyle}
                            onPress={() => {
                               // onFinish(-1, StartStation)
                                setStart()

                            }
                            } underlayColor={"white"}>
            <Text style={{fontSize: 0.02 * WINDOWS_HEIGHT}}>{StartStation}</Text>
        </TouchableHighlight>
    )
}
const EndStationButton = ({EndStation,setEnd}) => {

    return (
        <TouchableHighlight style={styles.cityButtonStyle}
                            onPress={() => {
                                  //  onFinish(2, EndStation)
                                    setEnd()
                            }} underlayColor={"white"}>
            <Text style={{fontSize: 0.02 * WINDOWS_HEIGHT}}>{EndStation}</Text>
        </TouchableHighlight>
    )
}
const EndBlueButton = ({EndStation,setEnd}) => {
    return (
        <TouchableHighlight style={styles.cityButtonBlueStyle}
                            onPress={() => {
                             //   onFinish(-2, EndStation)
                                setEnd()
                            }} underlayColor={"white"}>
            <Text style={{fontSize: 0.02 * WINDOWS_HEIGHT}}>{EndStation}</Text>
        </TouchableHighlight>
    )
}
const StartTimeButton = ({StartTime,setStartTime}) => {
    return (
        <TouchableHighlight style={styles.timeButtonStyle}
                            onPress={() => {
                                  //  onFinish(3, StartTime)
                                    setStartTime()
                            }} underlayColor={"white"}>
            <Text style={{fontSize: 0.02 * WINDOWS_HEIGHT}}>{StartTime}</Text>
        </TouchableHighlight>
    )
}
const StartTimeBlueButton = ({StartTime,setStartTime}) => {
    return (
        <TouchableHighlight style={styles.timeButtonBlueStyle}
                            onPress={() => {
                              //  onFinish(-3, StartTime)
                                setStartTime()
                            }} underlayColor={"white"}>
            <Text style={{fontSize: 0.02 * WINDOWS_HEIGHT}}>{StartTime}</Text>
        </TouchableHighlight>
    )
}
const EndTimeButton = ({EndTime,setEndTime}) => {
    return (
        <TouchableHighlight style={styles.timeButtonStyle}
                            onPress={() => {
                          //      onFinish(4, EndTime)
                                console.log(EndTime)
                                setEndTime(EndTime)
                            }} underlayColor={"white"}>
            <Text style={{fontSize: 0.02 * WINDOWS_HEIGHT}}>{EndTime}</Text>
        </TouchableHighlight>
    )
}
const EndTimeBlueButton = ({EndTime,setEndTime}) => {
    return (
        <TouchableHighlight style={styles.timeButtonBlueStyle}
                            onPress={() => {
                               setEndTime()
                            }} underlayColor={"white"}>
            <Text style={{fontSize: 0.02 * WINDOWS_HEIGHT}}>{EndTime}</Text>
        </TouchableHighlight>
    )
}

export default class RailFilterModal extends Component{
    constructor(props) {
        super(props);
        this.state={
            start:[],//index
            end:[],
            startTime:[],
            endTime:[],

            startStation: [],
            endStation:[],

            tmpStart:[],
            tmpEnd:[],
            tmpStartTime:[],
            tmpEndTime:[]


        }
    }


    componentDidMount() {
        const callback =(stations)=>{
            this.setState({startStation:stations.startStation,endStation:stations.endStation})
        }


        if(this.props.route.params.isChange)
        getStationNameCallBackChange(this.props.startCity,this.props.endCity,callback)
        else
        getStationNameCallBack(this.props.startCity,this.props.endCity,callback)

    }


    render() {
        let start =this.state.start.map((item)=>item);
        let end=this.state.end.map((item)=>item);
        let startTime = this.state.startTime.map((item)=>item);
        let endTime =this.state.endTime.map((item)=>item);
        return (
            <>
                <Modal animationType={'slide'} visible={this.props.visible}  onShow={()=>{


                    this.setState({
                        tmpStart:start,
                        tmpEnd:end,
                        tmpStartTime:startTime,
                        tmpEndTime:endTime
                    })

                } } >
                    <ScrollView>
                        <View style={{flexDirection: "row"}}>
                            <Text style={{flex: 1, marginTop: 0.02 * WINDOWS_HEIGHT, textAlign: 'center'}}
                                  onPress={()=>{
                                      this.setState({
                                          tmpStart:[],
                                          tmpEnd:[],
                                          tmpStartTime:[],
                                          tmpEndTime:[]
                                      })
                                  }}
                            >重置</Text>
                            <Text style={{
                                flex: 1,
                                marginTop: 0.04 * WINDOWS_HEIGHT,
                                textAlign: 'center',
                                fontSize: 22
                            }}>条件筛选</Text>
                            <Text style={{flex: 1, marginTop: 0.02 * WINDOWS_HEIGHT, textAlign: 'center'}}
                                  onPress={()=>{
                                    console.log("close",this.state.start)
                                      this.props.setVisible();
                                  }}>取消</Text>
                        </View>
                        <Text style={styles.titleStyle}>出发站点</Text>
                       <View style={styles.buttonAlignStyle}>

                           {this.state.startStation.map((item,index)=>this.state.tmpStart.includes(index)?<StartBlueButton StartStation={item} index={index}
                                                                                                                        key={index}
                                                                                                                           //  onFinish={this.props.onFinish}
                                                                                                                             setStart={()=>{
                                                                                                                                 let old = this.state.tmpStart;
                                                                                                                                 let pos =old.indexOf(index)
                                                                                                                                 old.splice(pos,1)
                                                                                                                                 this.setState({tmpStart:old},()=>{
                                                                                                                                     console.log(this.state.start)
                                                                                                                                 })
                                                                                                                             }}
                               />:
                               <StartStationButton  StartStation={item} index={index}
                                                    key={index}
                                                 //   onFinish={this.props.onFinish}
                                                    setStart={()=>{
                                                        let old = this.state.tmpStart;
                                                        old.push(index)
                                                        this.setState({tmpStart:old},()=>{
                                                            console.log("start",start)
                                                        })
                                                    }}/>)}
                        </View>
                        <Text style={styles.titleStyle}>到达站点</Text>
                        <View style={styles.buttonAlignStyle}>

                            {this.state.endStation.map( (item,index)=>this.state.tmpEnd.includes(index)?<EndBlueButton EndStation={item} index={index}
                                                                                                                    key={index}
                                                                                                                    // onFinish={this.props.onFinish}
                                                                                                                     setEnd={()=>{
                                                                                                                         let old = this.state.tmpEnd;
                                                                                                                         let pos =old.indexOf(index)
                                                                                                                         old.splice(pos,1)
                                                                                                                         this.setState({tmpEnd:old},()=>console.log(this.state.tmpEnd))
                                                                                                                     }}
                                />:
                                <EndStationButton  EndStation={item} index={index}
                                                   key={index}
                                                   //onFinish={this.props.onFinish}
                                                   setEnd={()=>{
                                                       let old = this.state.tmpEnd;
                                                       old.push(index)
                                                       this.setState({tmpEnd:old},()=>console.log(this.state.tmpEnd))
                                                   }}/>)}
                        </View>
                        <Text style={styles.titleStyle}>出发时间</Text>
                        <View style={styles.buttonAlignStyle}>

                            {timeTable.map(
                                (item,index)=>this.state.tmpStartTime.includes(index)?<StartTimeBlueButton StartTime={item} index={index}
                                                                                                        key={index}
                                                                                                     //  onFinish={this.props.onFinish}
                                                                                                       setStartTime={()=>{
                                                                                                           let old = this.state.tmpStartTime;
                                                                                                           let pos =old.indexOf(index)
                                                                                                           old.splice(pos,1)
                                                                                                           this.setState({tmpStartTime:old})}}
                                    />:
                                    <StartTimeButton StartTime={item} index={index}
                                                     key={index}
                                                     //onFinish={this.props.onFinish}
                                                     setStartTime={()=>{
                                                         let old = this.state.tmpStartTime;
                                                         old.push(index)
                                                         this.setState({tmpStartTime:old})
                                                     }}/>

                            )}
                        </View>
                        <Text style={styles.titleStyle}>到达时间</Text>
                       <View style={styles.buttonAlignStyle}>
                           {timeTable.map(
                               (item,index)=>this.state.tmpEndTime.includes(index)?<EndTimeBlueButton EndTime={item} index={index}
                                                                                                   key={index}
                                                                                                       // onFinish={this.props.onFinish}
                                                                                                        setEndTime={()=>{
                                                                                                            let old = this.state.tmpEndTime;
                                                                                                            let pos =old.indexOf(index)
                                                                                                            old.splice(pos,1)
                                                                                                            this.setState({tmpEndTime:old})
                                                                                                        }}
                                   />:
                                   <EndTimeButton EndTime={item} index={index}
                                                  key={index}
                                                //  onFinish={this.props.onFinish}
                                                  setEndTime={()=>{
                                                      let old = this.state.tmpEndTime;
                                                      old.push(index)
                                                      this.setState({tmpEndTime:old})
                                                  }}/>


                           )}
                        </View>

                        <Button type="ghost" style={{
                            width:0.88*WINDOWS_WIDTH,
                            height:0.06*WINDOWS_HEIGHT,
                            marginTop:0.06 *WINDOWS_HEIGHT,
                            alignSelf:'center'
                        }} onPress={()=>{
                            this.setState({
                                start:this.state.tmpStart.map(item=>item),
                                end:this.state.tmpEnd.map(item=>item),
                                startTime:this.state.tmpStartTime.map(item=>item),
                                endTime:this.state.tmpEndTime.map(item=>item)
                            },()=>{

                                this.props.setCondition(this.state.start.map(item=>this.state.startStation[item]),this.state.end.map(item=>this.state.endStation[item]),this.state.startTime.map(item=>timeTable[item]),this.state.endTime.map(item=>timeTable[item]));
                                this.props.setVisible();
                            })

                        }}>确认</Button>
                    </ScrollView>

                </Modal>
            </>

        )
    }


}
const styles = StyleSheet.create({
    headerStyle: {
        flexDirection: 'row',
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#efeff4"
    },
    buttonAlignStyle:{
        alignItems:'center',
        marginTop:0.01 *WINDOWS_HEIGHT,
        marginLeft: 0.05*WINDOWS_WIDTH,
        flexDirection: 'row',
        flexWrap: "wrap"

    },
    timeButtonAlignStyle:{
        flexDirection:"row",
        flexWrap: "wrap",
        justifyContent:'center'
    },
    titleStyle:{
        marginLeft:0.08*WINDOWS_WIDTH,
        fontSize:18,
        marginTop: 0.05*WINDOWS_HEIGHT,

    },
    backStyle: {
        width: 0.08 * WINDOWS_WIDTH,
        height: 0.08 * WINDOWS_HEIGHT,
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
    cityButtonBlueStyle: {
        width: 0.28 * WINDOWS_WIDTH,
        height: 0.05 * WINDOWS_HEIGHT,
        borderRadius: 0.015 * WINDOWS_HEIGHT,
        backgroundColor: "rgba(2,116,255,0.22)",
        alignItems: "center",
        justifyContent: "center",
        margin: 0.01 * WINDOWS_WIDTH
    },
    timeButtonStyle: {
        width: 0.40 * WINDOWS_WIDTH,
        height: 0.05 * WINDOWS_HEIGHT,
        borderRadius: 0.015 * WINDOWS_HEIGHT,
        backgroundColor: "#efeff4",
        alignItems: "center",
        justifyContent: "center",
        margin: 0.01 * WINDOWS_WIDTH
    },
    timeButtonBlueStyle: {
        width: 0.40 * WINDOWS_WIDTH,
        height: 0.05 * WINDOWS_HEIGHT,
        borderRadius: 0.015 * WINDOWS_HEIGHT,
        backgroundColor: "rgba(2,116,255,0.22)",
        alignItems: "center",
        justifyContent: "center",
        margin: 0.01 * WINDOWS_WIDTH
    }
})


