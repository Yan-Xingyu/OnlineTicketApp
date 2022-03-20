import {TimeTableInputPress, CalenderPage, CalenderDaySelect} from './helpers';

export default function (spec){
    spec.describe("TimeTable", function (){
        spec.it(" is asked", async function (){
            await spec.press("Tab.Home.TimeTableIcon")
            const input = await spec.findComponent("TimeTable.Input")
            await TimeTableInputPress(input)
            await spec.exists("TimeTable.KeyboardG")
            await spec.press("TimeTable.KeyboardG")
            await spec.press("TimeTable.Keyboard4")
            await spec.press("TimeTable.Keyboard0")
            await spec.press("TimeTable.Keyboard确认")
            await spec.press("TimeTable.Calender")
            const Calender = await spec.findComponent("DateSelect")
            await CalenderDaySelect(Calender, {"dateString": "2021-07-28", "day": 28, "month": 7, "timestamp": 1627430400000, "year": 2021})
            await spec.press("TimeTable.confirm")
            await spec.press("TimeTable.gotoOrder")
            await spec.pause(1000)
            await spec.press("TimeTable.Modal.GoBack")
            await spec.pause(1000)
            await spec.press("TimeTable.GoBack")
            await spec.pause(1000)
            await spec.press("TimeTable.GoHome")
        })
    })
}
