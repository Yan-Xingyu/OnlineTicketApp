export function calUseTime(startTime,endTime){
    let ms = (Date.parse(endTime.replace(/-/g,"/"))-Date.parse(startTime.replace(/-/g,"/")))/60000;
    let d=Math.floor(ms/1440),h = Math.floor(ms/60%24),m=Math.floor(ms%60);
    let time = "";
    if(d>0) time +=d+"天"+h+"小时"+m+"分钟";
    else if(h>0) time+=h+"小时"+m+"分钟";
    else time+=m+"分钟";
    return time;
}
export function calCrossDay(startTime,endTime){
    return(endTime.substring(8, 10)) - parseInt(startTime.substring(8, 10))
}
export function calPrice(orderItems){
    let i = 0, len = orderItems.length,price=0;
    for (; i<len; i++){
        price+=orderItems[i].seatPrice;
    }
    return price;
}
export function seat2str(type,trainType){
    if(type === 0) return (trainType===1)?"一等座":"硬座";
    else if(type === 1) return "硬卧";
    else if(type === 2) return (trainType===1)?"二等座":"软座";
    else if(type === 3) return "软卧";
    else if(type === 4) return "站票";
    else if(type === 5) return "商务座";
}
export function calSeat(seatType,seatBit){
    let carriage_no,row_no,seat_pos;
    let carriage=4,row=24,seat=5,offset=1;

    switch (seatType){
        case 0:
            carriage=4;
            row=24;
            seat=5;
            offset=1;
            break;
        case 1:
            carriage=4;
            row=21;
            seat=4;
            offset=5;
            break;
        case 2:
            carriage=4;
            row=18;
            seat=3;
            offset=9;
            break;
        case 3:
            carriage=4;
            row=10;
            seat=6;
            offset=9;
            break;
        case 4:
            carriage=4;
            row=10;
            seat=4;
            offset=13;
            break;
        case 5:
            carriage=4;
            offset=1;
            break;
    }
    if (seatType!==4){
        carriage_no=seatBit%carriage+offset;//车厢
        row_no=seatBit%row+1;//排
        seat_pos=seatBit%seat+1;//座
        let c = carriage_no.toString();
        let r = row_no.toString();
        let s =String.fromCharCode((seat_pos % 26)+65)+"";//((seat_pos % 26 + 'A')) + "";
        return c+"号车厢"+r+"排"+s+"座";
    }
    carriage_no=seatBit%carriage+1;//车厢
    let c = carriage_no.toString();
    return c+"号车厢站票";
}
