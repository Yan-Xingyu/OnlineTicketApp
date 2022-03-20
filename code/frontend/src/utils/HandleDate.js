
function add0(m){return m<10?'0'+m:m }
export function stampToFullTime(needTime)
{
    let time = new Date(needTime);
    let y = time.getFullYear();
    let m = time.getMonth()+1;
    let d = time.getDate();
    let h = time.getHours();
    let mm = time.getMinutes();
    let s = time.getSeconds();
    return y+'-'+add0(m)+'-'+add0(d)+' '+add0(h)+':'+add0(mm)+':'+add0(s);
}

//时间戳转 MM-DD
export function stampToMonthDay(timeStamp){
    let date = new Date(timeStamp);
    let month = date.getMonth()+1;

    let day = date.getDate();
    let weekDay =date.getDay();
    month = month < 10 ? "0"+month:month;
    day = day < 10 ? "0"+day:day;
    let week="";
    if(weekDay == 0) week = "周日"
    if(weekDay == 1) week = "周一"
    if(weekDay == 2) week = "周二"
    if(weekDay==3) week = "周三"
    if(weekDay==4) week = "周四"
    if(weekDay==5) week = "周五"
    if(weekDay == 6) week = "周六"

    return[month,day,week];
}
//时间戳转日期(YMD)
export function stampToDate(timestamp){
    let date = new Date(timestamp);
    let year =date.getFullYear();
    let month = date.getMonth()+1;
    let day = date.getDate();
    month = month < 10 ? "0"+month:month;
    day = day < 10 ? "0"+day:day;
    return year+'-'+month+'-'+day
}
//calculate sub date a - date b
export function subDate(a,b){
    let res = new Date(a).getTime() - new Date(b).getTime()
    let hour =  Math.floor(res/3600000)

    let second = (res%3600000)/60000
    return hour+'时'+second+'分';
}
//日期转时间戳（YMD -> 13位）
export function datetime_to_stamp(datetime){
    let tmp_datetime = datetime.replace(/:/g,'-');
    tmp_datetime = tmp_datetime.replace(/ /g,'-');
    let arr = tmp_datetime.split("-");
    let now = new Date(Date.UTC(arr[0],arr[1]-1,arr[2],arr[3]-8,arr[4],arr[5]));
    return parseInt(now.getTime());
}
//JSON Date 转 HH:MM
export function timeToClock(hour,minute){
    let h = hour < 10 ? "0"+hour:hour;
    let m =minute < 10 ? "0"+minute:minute;
    return h+':'+m;
}
//计算相差几天
export function getDayDif(start,end){


    return Math.abs(parseInt((start - end)/1000/3600/24));

}
