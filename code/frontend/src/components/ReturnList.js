import React, {Component} from "react";
import {stampToDate, timeToClock} from "../utils/HandleDate";
import {getTicketsOneWayCallBack} from "../services/TicketService";
import {FlatList, Text, TouchableHighlight, View} from "react-native";
import {Button} from "@ant-design/react-native";
import DateIconCard from "./DateIconCard";
import {DateCard, DateCardHighLight, RailwayCard} from "../component/RailwayInfoList";

export default class ReturnList extends Component{
    constructor(props) {
        super(props);
        this.state={
            trainInfo:[],
            lastTrainInfo:[],
            currentTrainInfo:[],
            dataStatus:false,
            startFilter:[],
            endFilter:[],
            startTimeFilter:[],
            endTimeFilter:[],

        }
    }
    checkTimeRange = (item,option)=>{
        if(option===1){
            let flag =false;
            for (let i=0;i<this.state.startTimeFilter.length;++i){
                let value = this.state.startTimeFilter[i];
                if(value==="08:00 — 14:00"){
                    if(item.startHour<14&&item.startHour>=8){
                        flag=true
                    }

                }
                else if(value==="00:00 — 08:00"){
                    if(item.startHour<=7&&item.startHour>=0){
                        flag=true
                    }

                }
                else if(value==="14:00 — 19:00"){
                    if(item.startHour<19&&item.startHour>=14){
                        flag=true
                    }

                }
                else if(value==="19:00 — 24:00"){
                    if(item.startHour<=23&&item.startHour>=19){
                        flag=true
                    }
                }
            }
            if (flag)
                return 1;
            else return 0
        }
        if (option===2){
            let flag =false
            for (let i=0;i<this.state.endTimeFilter.length;++i){
                let value = this.state.endTimeFilter[i];
                if(value==="08:00 — 14:00"){
                    if(item.arriveHour<14&&item.arriveHour>=8){
                        flag=true;
                    }

                }
                else if(value==="00:00 — 08:00"){
                    if(item.arriveHour<=7&&item.arriveHour>=0){
                        flag=true;
                    }

                }
                else if(value==="14:00 — 19:00"){
                    if(item.arriveHour<19&&item.arriveHour>=14){
                        flag=true;
                    }

                }
                else if(value==="19:00 — 24:00"){
                    if(item.arriveHour<=23&&item.arriveHour>=19){
                        flag=true;
                    }
                    flag=false
                }
            }
            if (flag)
                return 1;
            else return 0;
        }


    }
    onFilter = () =>{
        const {trainInfo,startFilter,endFilter,startTimeFilter,endTimeFilter} = this.state
        let tmp =[]
        for(let j= 0;j<trainInfo.length;++j){
            if(startFilter.length>=1&&!startFilter.includes(trainInfo[j].startStation))
                continue;
            if (endFilter.length>=1&&!endFilter.includes(trainInfo[j].endStation))
                continue;
            if (startTimeFilter.length>=1&&!this.checkTimeRange(trainInfo[j],1)){
                continue;
            }
            if(endTimeFilter.length>=1&&!this.checkTimeRange(trainInfo[j],2))
                continue;
            tmp.push(trainInfo[j])
        }

        this.setState({
            currentTrainInfo:tmp,
        })
    }
    onSort =(option)=>{
        if(option===1){
            let old = this.state.currentTrainInfo.map(item=>item)
            let tmp = this.state.currentTrainInfo;
            tmp.sort((a,b)=>(a.arriveTime-a.startTime-b.arriveTime+b.startTime))
            this.setState({currentTrainInfo:tmp,lastTrainInfo:old})

        }
        if(option===0){
            let old = this.state.lastTrainInfo.map(item=>item)
            this.setState({currentTrainInfo:old})

        }
        if(option===2){
            let old = this.state.currentTrainInfo.map(item=>item)
            let tmp = this.state.currentTrainInfo;
            tmp.sort((a,b)=>(a.startTime-b.startTime))
            this.setState({currentTrainInfo:tmp,lastTrainInfo:old})

        }
        if(option===3){
            let old = this.state.currentTrainInfo.map(item=>item)
            let tmp = this.state.currentTrainInfo;
            tmp.sort((a,b)=>(a.price-b.price))
            this.setState({currentTrainInfo:tmp,lastTrainInfo:old})

        }


    }

    componentDidMount() {
        const {startCity,endCity,date} = this.props;
        const callback=(trainData)=>{
            let tmp =[]

            console.log("yes",trainData.length)

            trainData.map((item)=>{
                let a={ startTime:item.start_time.time,
                    arriveTime:item.end_time.time,
                    trainId:item.train_id,
                    trainTag:item.train_tag,
                    trainType:item.train_type,
                    startClock:timeToClock(item.start_time.hours,item.start_time.minutes),
                    arriveClock:timeToClock(item.end_time.hours,item.end_time.minutes),
                    startStation:item.start_station,
                    endStation:item.end_station,
                    startHour:item.start_time.hours,
                    arriveHour:item.end_time.hours,
                    startMinute:item.start_time.minutes,
                    arriveMinute:item.end_time.minutes,
                    firstSeat:item.first_seat,
                    secondSeat:item.second_seat,
                    price:item.price,
                    standSeat:item.stand_seat,
                    softLieSeat:item.softLie_seat?item.softLie_seat:null,
                    hardLieSeat:item.hardLie_seat?item.hardLie_seat:null,
                    vipSeat:item.vip_seat?item.vip_seat:null,
                    start_no:item.start_no,
                    end_no:item.end_no

                }
                tmp.push(a)
            })


            this.setState({trainInfo:tmp,lastTrainInfo:tmp,currentTrainInfo:tmp},()=>{
                this.setState({dataStatus:true},()=>{
                    console.log(this.state.dataStatus)
                })
            })
        }
        if(this.props.route.params.isChange){
            getTicketsOneWayCallBack(startCity,endCity, stampToDate(date),callback,0)
        }
        else {
            getTicketsOneWayCallBack(startCity,endCity, stampToDate(date),callback,1)
        }
        this.props.onRef && this.props.onRef(this);

    }
    componentWillReceiveProps(nextProps) {
        nextProps.onRef && nextProps.onRef(this);
    }
    setCondition =(s,e,st,et)=>{
        this.setState({
            startFilter:s,
            endFilter:e,
            startTimeFilter:st,
            endTimeFilter:et
        },()=>{
            this.onFilter()
        })
    }
    componentDidUpdate(prevProps: Readonly<P>, prevState: Readonly<S>, snapshot: SS) {
        if(prevState.dataStatus!==this.state.dataStatus){
            const {startCity,endCity,date} = this.props;
            const callback=(trainData)=>{
                let tmp =[]
                trainData.map((item)=>{
                    let a={ startTime:item.start_time.time,
                        arriveTime:item.end_time.time,
                        trainId:item.train_id,
                        trainTag:item.train_tag,
                        trainType:item.train_type,
                        startClock:timeToClock(item.start_time.hours,item.start_time.minutes),
                        arriveClock:timeToClock(item.end_time.hours,item.end_time.minutes),
                        startStation:item.start_station,
                        endStation:item.end_station,
                        startHour:item.start_time.hours,
                        arriveHour:item.end_time.hours,
                        startMinute:item.start_time.minutes,
                        arriveMinute:item.end_time.minutes,
                        firstSeat:item.first_seat,
                        secondSeat:item.second_seat,
                        price:item.price,
                        standSeat:item.stand_seat,
                        softLieSeat:item.softLie_seat?item.softLie_seat:null,
                        hardLieSeat:item.hardLie_seat?item.hardLie_seat:null,
                        vipSeat:item.vip_seat?item.vip_seat:null,
                        start_no:item.start_no,
                        end_no:item.end_no

                    }
                    tmp.push(a)
                })
                this.setState({trainInfo:tmp},()=>{
                    this.setState({dataStatus:true})
                })
            }
            if(this.props.route.params.isChange){
                getTicketsOneWayCallBack(startCity,endCity, stampToDate(date),callback,0)
            }
            else {
                getTicketsOneWayCallBack(startCity,endCity, stampToDate(date),callback,1)
            }
        }

    }

    render(){
        console.log(this.state.trainInfo.length)
        const {startCity,endCity,date,isOneWay,selectDay} = this.props;
        let dateList=[]
        for(let i=-7;i<=7;++i){
            dateList.push(this.props.date+i*3600*1000*24)
        }


        return(

            <View style={{flex: 1}}>{

                (this.state.trainInfo.length===0&&this.state.dataStatus)?<View style={{flex:1,justifyContent:'center'}}>
                    <Text style={{textAlign:'center'}}> 无直达方案</Text>
                    <Button onPress={
                        ()=>{
                            this.props.navigation.navigate('PassBy',{
                                isOneWay:this.props.isOneWay,
                                start:this.props.startCity,
                                end:this.props.endCity,
                                date:this.props.date,
                                returnDate:this.props.route.params.returnDate,
                                isChange:this.props.route.params.isChange,
                                passengers:this.props.route.params.passengers
                            })
                        }

                    } >
                        中转查询
                    </Button></View> :   <FlatList data={this.state.currentTrainInfo} renderItem={(item) => <RailwayCard railInfo={item.item} date={date} start={startCity}
                                                                                                                         end={endCity} isOneWay={isOneWay} />}
                                                   keyExtractor={(item, index) => index}
                                                   style={{backgroundColor: "#DDDDDD"}}
                                                   showsVerticalScrollIndicator={false}
                                                   refreshing={!this.state.dataStatus}
                                                   extraData={this.state}
                                                   onRefresh={()=>{this.setState({dataStatus:false})}}
                                                   ListHeaderComponent={
                                                       <View style={{width: '100%', flexDirection: "row", flex: 1}}>
                                                           <FlatList data={dateList}
                                                                     keyExtractor={(item, index) => index}
                                                                     renderItem={(item, index) => (item.index === 7 ? <DateCardHighLight date={date}/> :
                                                                         <DateCard date={item.item} selectDay={selectDay} changeDay={()=>{this.setState({dataStatus:false})}}/>)}
                                                                     showsHorizontalScrollIndicator={false}
                                                                     initialScrollIndex={10}
                                                                     horizontal={true}
                                                                     style={{flex: 1}}
                                                           />

                                                           <TouchableHighlight onPress={() => {
                                                               this.props.changeVisible()
                                                           }}>
                                                               <DateIconCard style={{width: 50}}/>
                                                           </TouchableHighlight>
                                                       </View>
                                                   }
                />

            }



            </View>



        )


    }


}
