import {View, Text} from "react-native"
import {Card, List} from '@ant-design/react-native'
import React from "react";

export function PriceTable({start_no, end_no, trainType}){
    return(
        <View>
        {
            trainType === 1 ?
                        <View style={{flexDirection: 'row', backgroundColor: 'white', marginTop: 10}}>
                            <View style={{flexDirection: 'column', width: '25%', alignItems: "center"}}>
                                <Text style={{fontSize: 15}}>一等座</Text>
                                <Text style={{color: 'grey'}}>{'¥' + (end_no - start_no) * 98}</Text>
                            </View>
                            <View style={{flexDirection: 'column', width: '25%', alignItems: "center"}}>
                                <Text style={{fontSize: 15}}>二等座</Text>
                                <Text style={{color: 'grey'}}>{'¥' + (end_no - start_no) * 88}</Text>
                            </View>
                            <View style={{flexDirection: 'column', width: '25%', alignItems: "center"}}>
                                <Text style={{fontSize: 15}}>商务座</Text>
                                <Text style={{color: 'grey'}}>{'¥' + (end_no - start_no) * 128}</Text>
                            </View>
                            <View style={{flexDirection: 'column', width: '25%', alignItems: "center"}}>
                                <Text style={{fontSize: 15}}>站票</Text>
                                <Text style={{color: 'grey'}}>{'¥' + (end_no - start_no) * 68}</Text>
                            </View>
                        </View>
            :
                        <View style={{flexDirection: 'row', backgroundColor: 'white', marginTop: 10}}>
                            <View style={{flexDirection: 'column', width: '20%', alignItems: "center"}}>
                                <Text style={{fontSize: 15}}>硬座</Text>
                                <Text style={{color: 'grey'}}>{'¥' + (end_no - start_no) * 38}</Text>
                            </View>
                            <View style={{flexDirection: 'column', width: '20%', alignItems: "center"}}>
                                <Text style={{fontSize: 15}}>软座</Text>
                                <Text style={{color: 'grey'}}>{'¥' + (end_no - start_no) * 48}</Text>
                            </View>
                            <View style={{flexDirection: 'column', width: '20%', alignItems: "center"}}>
                                <Text style={{fontSize: 15}}>硬卧</Text>
                                <Text style={{color: 'grey'}}>{'¥' + (end_no - start_no) * 68}</Text>
                            </View>
                            <View style={{flexDirection: 'column', width: '20%', alignItems: "center"}}>
                                <Text style={{fontSize: 15}}>软卧</Text>
                                <Text style={{color: 'grey'}}>{'¥' + (end_no - start_no) * 128}</Text>
                            </View>
                            <View style={{flexDirection: 'column', width: '20%', alignItems: "center"}}>
                                <Text style={{fontSize: 15}}>站票</Text>
                                <Text style={{color: 'grey'}}>{'¥' + (end_no - start_no) * 28}</Text>
                            </View>
                        </View>
            }
    </View>
    )
}
