import {View, Text, TouchableHighlight} from 'react-native';
import {Card, List} from '@ant-design/react-native'
import React from "react";

export function SeatSelectTable({seatNum, setSeatNum, start_no, end_no, trainType}){
    return(
        <View>
            {
                trainType === 1 ?
                    <View style={{flexDirection: 'row', backgroundColor: 'white', marginTop: 10}}>
                        <TouchableHighlight style={{width: '25%', backgroundColor: seatNum === 0?'#6495ed': "white"}} onPress={()=>setSeatNum(0)}>
                            <View style={{flexDirection: 'column', alignItems: "center"}}>
                                <Text style={{fontSize: 15, color: seatNum !== 0?'black': "white"}}>一等座</Text>
                                <Text style={{color: seatNum !== 0?'grey': "white"}}>{'¥' + (end_no - start_no) * 98}</Text>
                            </View>
                        </TouchableHighlight>
                        <TouchableHighlight style={{width: '25%', backgroundColor: seatNum === 2?'#6495ed': "white"}} onPress={()=>setSeatNum(2)}>
                            <View style={{flexDirection: 'column', alignItems: "center"}}>
                                <Text style={{fontSize: 15, color: seatNum !== 2?'black': "white"}}>二等座</Text>
                                <Text style={{color: seatNum !== 2?'grey': "white"}}>{'¥' + (end_no - start_no) * 88}</Text>
                            </View>
                        </TouchableHighlight>
                        <TouchableHighlight style={{width: '25%', backgroundColor: seatNum === 5?'#6495ed': "white"}} onPress={()=>setSeatNum(5)}>
                            <View style={{flexDirection: 'column', alignItems: "center"}}>
                                <Text style={{fontSize: 15, color: seatNum !== 5?'black': "white"}}>商务座</Text>
                                <Text style={{color: seatNum !== 5?'grey': "white"}}>{'¥' + (end_no - start_no) * 128}</Text>
                            </View>
                        </TouchableHighlight>
                        <TouchableHighlight style={{width: '25%', backgroundColor: seatNum === 4?'#6495ed': "white"}} onPress={()=>setSeatNum(4)}>
                            <View style={{flexDirection: 'column', alignItems: "center"}}>
                                <Text style={{fontSize: 15, color: seatNum !== 4?'black': "white"}}>站票</Text>
                                <Text style={{color: seatNum !== 4?'grey': "white"}}>{'¥' + (end_no - start_no) * 68}</Text>
                            </View>
                        </TouchableHighlight>
                    </View>
                    :
                    <View style={{flexDirection: 'row', backgroundColor: 'white', marginTop: 10}}>
                        <TouchableHighlight style={{width: '20%', backgroundColor: seatNum === 2?'#6495ed': "white"}} onPress={()=>setSeatNum(2)}>
                            <View style={{flexDirection: 'column', alignItems: "center"}}>
                                <Text style={{fontSize: 15, color: seatNum !== 2?'black': "white"}}>硬座</Text>
                                <Text style={{color: seatNum !== 2?'grey': "white"}}>{'¥' + (end_no - start_no) * 38}</Text>
                            </View>
                        </TouchableHighlight>
                        <TouchableHighlight style={{width: '20%', backgroundColor: seatNum === 0?'#6495ed': "white"}} onPress={()=>setSeatNum(0)}>
                            <View style={{flexDirection: 'column', alignItems: "center"}}>
                                <Text style={{fontSize: 15, color: seatNum !== 0?'black': "white"}}>软座</Text>
                                <Text style={{color: seatNum !== 0?'grey': "white"}}>{'¥' + (end_no - start_no) * 48}</Text>
                            </View>
                        </TouchableHighlight>
                        <TouchableHighlight style={{width: '20%', backgroundColor: seatNum === 1?'#6495ed': "white"}} onPress={()=>setSeatNum(1)}>
                            <View style={{flexDirection: 'column', alignItems: "center"}}>
                                <Text style={{fontSize: 15, color: seatNum !== 1?'black': "white"}}>硬卧</Text>
                                <Text style={{color: seatNum !== 1?'grey': "white"}}>{'¥' + (end_no - start_no) * 68}</Text>
                            </View>
                        </TouchableHighlight>
                        <TouchableHighlight style={{width: '20%', backgroundColor: seatNum === 3?'#6495ed': "white"}} onPress={()=>setSeatNum(3)}>
                            <View style={{flexDirection: 'column', alignItems: "center"}}>
                                <Text style={{fontSize: 15, color: seatNum !== 3?'black': "white"}}>软卧</Text>
                                <Text style={{color: seatNum !== 3?'grey': "white"}}>{'¥' + (end_no - start_no) * 128}</Text>
                            </View>
                        </TouchableHighlight>
                        <TouchableHighlight style={{width: '20%', backgroundColor: seatNum === 4?'#6495ed': "white"}} onPress={()=>setSeatNum(4)}>
                            <View style={{flexDirection: 'column', alignItems: "center"}}>
                                <Text style={{fontSize: 15, color: seatNum !== 4?'black': "white"}}>站票</Text>
                                <Text style={{color: seatNum !== 4?'grey': "white"}}>{'¥' + (end_no - start_no) * 28}</Text>
                            </View>
                        </TouchableHighlight>
                    </View>
            }
        </View>
    )
}
