import React, {useState} from 'react'
import LoginForm from "../components/LoginForm";
import {Modal, View} from "react-native";
import RegisterView from "./RegisterView";
import PasswordAskForm from "../components/PasswordAsk";

function LoginModal ({modalVisible, setModalVisible, judge, setCurrentTab}) {
    const [register, setRegister] = useState(false)
    const [ask, setAsk] = useState(false)
    console.log([register, ask])
    return(
        <Modal
            transparent={false}
            onClose={() => setModalVisible(false)}
            visible={modalVisible}
            animationType={'slide'}
        >
            {
                register?<RegisterView setRegister={setRegister} setModalVisible={setModalVisible}/>
                :(ask?<PasswordAskForm setAsk={setAsk}/>
                :<LoginForm setAsk={setAsk} setRegister={setRegister} setModalVisible={setModalVisible} modalVisible={modalVisible} judge={judge} setCurrentTab={setCurrentTab}/>)
            }
        </Modal>
    )
}

export default LoginModal
