/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import { SafeAreaView} from 'react-native';

import RailwayInfoListView from "./src/views/RailwayInfoListView";
import 'react-native-gesture-handler';
import {NavigationContainer} from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';


import HomeView from './src/views/HomeView';
import UserView from "./src/views/UserView";
import OrderView from "./src/views/OrderView";
import OrderDetailView from "./src/views/OrderDetailView";
import UserInfoView  from "./src/views/UserInfoView";
import PurchaseView from "./src/views/PurchaseView";
import PassengerSelectView from "./src/views/PassengerSelectView";
import PassengerAddView from "./src/views/PassengerAddView";
import RegisterView from "./src/views/RegisterView";
import TrainNoDetailView from './src/views/TrainNoDetailView';
import TrainNoSearchView from './src/views/TrainNoSearchView';
import PayResultView from "./src/views/PayResultView";
import PasswordModifyForm from "./src/components/PasswordModifyForm";
import TransitBuyView from './src/views/TransitBuyView';
import ReturnListView from "./src/views/ReturnListView";
import PassByView from "./src/views/PassByView";
import OrderStatusView from "./src/views/OrderStatusView";


const App: () => Node = () => {

    const Stack = createStackNavigator()

    return (
        <SafeAreaView style={{flex: 1}}>
            <NavigationContainer>
                <Stack.Navigator initialRouteName={"Home"}>
                    <Stack.Screen name={"Home"} component={HomeView} options={{header : _ => null}}/>
                    <Stack.Screen name={"RailInfoList"} component={RailwayInfoListView} options={{header : _ => null}}/>
                    <Stack.Screen name={"ReturnList"} component={ReturnListView} options={{header : _ => null}}/>
                    <Stack.Screen name={"PassBy"} component={PassByView} options={{header : _ => null}}/>
                    <Stack.Screen name={"User"} component={UserView} options={{header : _ => null}}/>
                    <Stack.Screen name={"UserInformation"} component={UserInfoView} options={{header : _ => null}}/>
                    <Stack.Screen name={"Order"} component={OrderView} options={{header : _ => null}}/>
                    <Stack.Screen name={"OrderDetail"} component={OrderDetailView} options={{header : _ => null}}/>
                    <Stack.Screen name={"OrderStatus"} component={OrderStatusView} options={{header : _ => null}}/>
                    <Stack.Screen name={"Purchase"} component={PurchaseView} options={{header : _ => null}}/>
                    <Stack.Screen name={"PassengerSelection"} component={PassengerSelectView} options={{header : _ => null}}/>
                    <Stack.Screen name={"PassengerAdd"} component={PassengerAddView} options={{header : _ => null}}/>
                    <Stack.Screen name={"Register"} component={RegisterView} options={{header : _ => null}}/>
                    <Stack.Screen name={"TrainNoDetail"} component={TrainNoDetailView} options={{header : _ => null}}/>
                    <Stack.Screen name={"TrainNoSearch"} component={TrainNoSearchView} options={{header : _ => null}}/>
                    <Stack.Screen name={"PayResult"} component={PayResultView} options={{header : _ => null}}/>
                    <Stack.Screen name={"PasswordModify"} component={PasswordModifyForm} options={{header : _ => null}}/>
                    <Stack.Screen name={"Transit"} component={TransitBuyView} options={{header : _ => null}}/>
                </Stack.Navigator>
            </NavigationContainer>
        </SafeAreaView>
    );
};

export default App;
