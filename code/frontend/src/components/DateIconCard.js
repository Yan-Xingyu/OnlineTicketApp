import React from 'react';
import {Card} from 'react-native-shadow-cards';
import FontAwesome from "react-native-vector-icons/FontAwesome";


export default function DateIconCard(){
    return(
        <Card style={{width: 50, height: 48}} elevation={600}>

                <FontAwesome name={"calendar"}
                             style={{padding: 11, backgroundColor: 'white'}}
                             size={26}
                />

        </Card>
    )
}
