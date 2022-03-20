import {View, Text} from 'react-native'
import React, { Component } from 'react';
import { InputItem } from '@ant-design/react-native';

const cls = 'trust-mobile-input';

class MobileInputItem extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        const {type = 'text', labelNumber = 5, error = false, children = '', onErrorClick = '', tipStyle = {}, ...other} = this.props;
        const errorTipStyle = {
            color: '#f5222d',
            textAlign: 'left',
            position: 'relative',
            fontSize: 12,
            ...tipStyle
        }
        let result = []
        if(error === true)
            result.push(
                <View key={this.props.symbol} className="am-list-item" style={{height: 'auto', minHeight: 0}}>
                    <View className="am-input-control">
                        <View style={{errorTipStyle}}>
                            <Text style={{color: '#f5222d', marginLeft: '26%'}}>{onErrorClick}</Text>
                        </View>
                    </View>
                </View>
            )
        return(
            <View className={cls}>
                <InputItem  type={type} {...other} error={false}>{children}</InputItem>
                {
                   result
                }
            </View>
        )
    }
}

export default MobileInputItem;
