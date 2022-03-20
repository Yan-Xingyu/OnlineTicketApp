import React, { Component } from 'react';
import { AppRegistry } from 'react-native';
import { Tester, TestHookStore } from 'cavy';
import UserInfoGetSpec from './specs/UserInfoGetSpec';
import LoginSpec from './specs/LoginSpec';
import TimeTableSpec from './specs/TimeTableSpec';
import RegisterSpec from './specs/RegisterSpec';
import ModifyPasswordSpec from './specs/ModifyPasswordSpec';
import PasswordAskSpec from './specs/PasswordAskSpec';
import OneWayPurchaseSpec from './specs/OneWayPurchaseSpec';
import App from './App';

const testHookStore = new TestHookStore();

class AppWrapper extends Component {
    render() {
        return (
            <Tester specs={[RegisterSpec, OneWayPurchaseSpec]} store={testHookStore}>
                <App/>
            </Tester>
        );
    }
}

AppRegistry.registerComponent('frontend', () => AppWrapper);
