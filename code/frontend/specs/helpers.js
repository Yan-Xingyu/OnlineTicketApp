export async function InputItemInput(InputItem, str){
    InputItem.props.onChange(str)
}

export async function TimeTableInputPress(TouchableHighlight){
    TouchableHighlight.props.onPressOut()
}

export async function CalenderDaySelect(Calender, day){
    Calender.props.onDayPress(day)
}

export async function InputBlur(Input){
    Input.props.onBlur()
}

export async function PickerSelect(Picker, value){
    Picker.props.onChange(value)
}

export async function CheckSelect(CheckBox){
    CheckBox.props.onClick()
}

export async function RadioSelect(Radio, index, value){
    Radio.props.onSelect(index, value)
}
