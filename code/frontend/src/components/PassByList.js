import React, {Component} from "react";
import {stampToDate, timeToClock} from "../utils/HandleDate";
import {getTicketsOneWayCallBack, getTicketsPassByOneWayCallBack} from "../services/TicketService";
import {FlatList, TouchableHighlight, View} from "react-native";
import DateIconCard from "./DateIconCard";
import {DateCard, DateCardHighLight, RailwayCard} from "../component/RailwayInfoList";
import {PassByCard} from "./PassByCard";



export default class PassByList extends Component{
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
            if(startFilter.length>=1&&!startFilter.includes(trainInfo[j].firstRail.startStation))
                continue;
            if (endFilter.length>=1&&!endFilter.includes(trainInfo[j].secondRail.endStation))
                continue;
            if (startTimeFilter.length>=1&&!this.checkTimeRange(trainInfo[j].firstRail,1)){
                continue;
            }
            if(endTimeFilter.length>=1&&!this.checkTimeRange(trainInfo[j].secondRail,2))
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
            tmp.sort((a,b)=>(a.secondRail.arriveTime-a.firstRail.startTime-b.secondRail.sarriveTime+b.firstRail.startTime))
            this.setState({currentTrainInfo:tmp,lastTrainInfo:old})

        }
        if(option===0){
            let old = this.state.lastTrainInfo.map(item=>item)
            this.setState({currentTrainInfo:old})

        }
        if(option===2){
            let old = this.state.currentTrainInfo.map(item=>item)
            let tmp = this.state.currentTrainInfo;
            tmp.sort((a,b)=>(a.firstRail.startTime-b.firstRail.startTime))
            this.setState({currentTrainInfo:tmp,lastTrainInfo:old})

        }
        if(option===3){
            let old = this.state.currentTrainInfo.map(item=>item)
            let tmp = this.state.currentTrainInfo;
            tmp.sort((a,b)=>(a.secondRail.startTime-a.firstRail.arriveTime-b.secondRail.startTime+b.firstRail.arriveTime))
            this.setState({currentTrainInfo:tmp,lastTrainInfo:old})

        }


    }



    componentDidMount() {
        const {startCity,endCity,date} = this.props;
        const callback=(trainData)=>{
            let tmp =[]

            trainData.map((item)=>{
                let firstRail = item.first_rail;
                let secondRail=item.second_rail
                let a={ startTime:firstRail.start_time.time,
                    arriveTime:firstRail.end_time.time,
                    trainId:firstRail.train_id,
                    trainTag:firstRail.train_tag,
                    trainType:firstRail.train_type,
                    startClock:timeToClock(firstRail.start_time.hours,firstRail.start_time.minutes),
                    arriveClock:timeToClock(firstRail.end_time.hours,firstRail.end_time.minutes),
                    startStation:firstRail.start_station,
                    endStation:firstRail.end_station,
                    startHour:firstRail.start_time.hours,
                    arriveHour:firstRail.end_time.hours,
                    startMinute:firstRail.start_time.minutes,
                    arriveMinute:firstRail.end_time.minutes,
                    firstSeat:firstRail.first_seat,
                    secondSeat:firstRail.second_seat,
                    price:firstRail.price,
                    standSeat:firstRail.stand_seat,
                    softLieSeat:firstRail.softLie_seat?firstRail.softLie_seat:null,
                    hardLieSeat:firstRail.hardLie_seat?firstRail.hardLie_seat:null,
                    vipSeat:firstRail.vip_seat?firstRail.vip_seat:null,
                    start_no:firstRail.start_no,
                    end_no:firstRail.end_no,
                    startDate:new Date(firstRail.start_time.year,firstRail.start_time.month,firstRail.start_time.date),
                    endDate:new Date(firstRail.end_time.year,firstRail.end_time.month,firstRail.end_time.date)
                }
                let b={ startTime:secondRail.start_time.time,
                    arriveTime:secondRail.end_time.time,
                    trainId:secondRail.train_id,
                    trainTag:secondRail.train_tag,
                    trainType:secondRail.train_type,
                    startClock:timeToClock(secondRail.start_time.hours,secondRail.start_time.minutes),
                    arriveClock:timeToClock(secondRail.end_time.hours,secondRail.end_time.minutes),
                    startStation:secondRail.start_station,
                    endStation:secondRail.end_station,
                    startHour:secondRail.start_time.hours,
                    arriveHour:secondRail.end_time.hours,
                    startMinute:secondRail.start_time.minutes,
                    arriveMinute:secondRail.end_time.minutes,
                    firstSeat:secondRail.first_seat,
                    secondSeat:secondRail.second_seat,
                    price:secondRail.price,
                    standSeat:secondRail.stand_seat,
                    softLieSeat:secondRail.softLie_seat?secondRail.softLie_seat:null,
                    hardLieSeat:secondRail.hardLie_seat?secondRail.hardLie_seat:null,
                    vipSeat:secondRail.vip_seat?secondRail.vip_seat:null,
                    start_no:secondRail.start_no,
                    end_no:secondRail.end_no,
                    startDate:new Date(secondRail.start_time.year,secondRail.start_time.month,secondRail.start_time.date),
                    endDate:new Date(secondRail.end_time.year,secondRail.end_time.month,secondRail.end_time.date)

                }
                let railInfo=
                    {firstRail:a,
                    secondRail:b}
                tmp.push(railInfo)
            })


            this.setState({trainInfo:tmp,lastTrainInfo:tmp,currentTrainInfo:tmp},()=>{
                this.setState({dataStatus:true})
            })
        }

        getTicketsPassByOneWayCallBack(startCity,endCity, stampToDate(date),callback)
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

    setStatus = ()=>{
        this.setState({dataStatus:false})
    }
    componentDidUpdate(prevProps: Readonly<P>, prevState: Readonly<S>, snapshot: SS) {
        if(prevState.dataStatus!==this.state.dataStatus){

            const {startCity,endCity,date} = this.props;
            const callback=(trainData)=>{
                let tmp =[]

                trainData.map((item)=>{
                    let firstRail = item.first_rail;
                    let secondRail=item.second_rail
                    let a={ startTime:firstRail.start_time.time,
                        arriveTime:firstRail.end_time.time,
                        trainId:firstRail.train_id,
                        trainTag:firstRail.train_tag,
                        trainType:firstRail.train_type,
                        startClock:timeToClock(firstRail.start_time.hours,firstRail.start_time.minutes),
                        arriveClock:timeToClock(firstRail.end_time.hours,firstRail.end_time.minutes),
                        startStation:firstRail.start_station,
                        endStation:firstRail.end_station,
                        startHour:firstRail.start_time.hours,
                        arriveHour:firstRail.end_time.hours,
                        startMinute:firstRail.start_time.minutes,
                        arriveMinute:firstRail.end_time.minutes,
                        firstSeat:firstRail.first_seat,
                        secondSeat:firstRail.second_seat,
                        price:firstRail.price,
                        standSeat:firstRail.stand_seat,
                        softLieSeat:firstRail.softLie_seat?firstRail.softLie_seat:null,
                        hardLieSeat:firstRail.hardLie_seat?firstRail.hardLie_seat:null,
                        vipSeat:firstRail.vip_seat?firstRail.vip_seat:null,
                        start_no:firstRail.start_no,
                        end_no:firstRail.end_no,
                        startDate:new Date(firstRail.start_time.year,firstRail.start_time.month,firstRail.start_time.date),
                        endDate:new Date(firstRail.end_time.year,firstRail.end_time.month,firstRail.end_time.date)
                    }
                    let b={ startTime:secondRail.start_time.time,
                        arriveTime:secondRail.end_time.time,
                        trainId:secondRail.train_id,
                        trainTag:secondRail.train_tag,
                        trainType:secondRail.train_type,
                        startClock:timeToClock(secondRail.start_time.hours,secondRail.start_time.minutes),
                        arriveClock:timeToClock(secondRail.end_time.hours,secondRail.end_time.minutes),
                        startStation:secondRail.start_station,
                        endStation:secondRail.end_station,
                        startHour:secondRail.start_time.hours,
                        arriveHour:secondRail.end_time.hours,
                        startMinute:secondRail.start_time.minutes,
                        arriveMinute:secondRail.end_time.minutes,
                        firstSeat:secondRail.first_seat,
                        secondSeat:secondRail.second_seat,
                        price:secondRail.price,
                        standSeat:secondRail.stand_seat,
                        softLieSeat:secondRail.softLie_seat?secondRail.softLie_seat:null,
                        hardLieSeat:secondRail.hardLie_seat?secondRail.hardLie_seat:null,
                        vipSeat:secondRail.vip_seat?secondRail.vip_seat:null,
                        start_no:secondRail.start_no,
                        end_no:secondRail.end_no,
                        startDate:new Date(secondRail.start_time.year,secondRail.start_time.month,secondRail.start_time.date),
                        endDate:new Date(secondRail.end_time.year,secondRail.end_time.month,secondRail.end_time.date)

                    }
                    let railInfo=
                        {firstRail:a,
                            secondRail:b}
                    tmp.push(railInfo)
                })


                this.setState({trainInfo:tmp,lastTrainInfo:tmp,currentTrainInfo:tmp},()=>{
                    this.setState({dataStatus:true})
                })
            }

            getTicketsPassByOneWayCallBack(startCity,endCity, stampToDate(date),callback)
        }

    }

    render(){
        const {startCity,endCity,date,isOneWay,selectDay} = this.props;
        let dateList=[]
        for(let i=-7;i<=7;++i){
            dateList.push(this.props.date+i*3600*1000*24)
        }

        return(

            <View style={{flex: 1}}>
                <FlatList data={this.state.currentTrainInfo} renderItem={(item) => <PassByCard railInfo={item.item} date={date} start={startCity}
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

            </View>



        )


    }


}
