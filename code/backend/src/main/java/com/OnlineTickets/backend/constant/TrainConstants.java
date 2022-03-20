package com.OnlineTickets.backend.constant;

import static com.OnlineTickets.backend.utils.BitSetConvert.byteArray2BitSet;

public class TrainConstants {

    public static final int FIRST_SEAT = 0;
    public static final int SECOND_SEAT = 2;
    public static final int VIP_SEAT = 5;
    public static final int STAND_SEAT = 4;
    public static final int SOFT_LIE_SEAT = 3;
    public static final int HARD_LIE_SEAT = 1;

    public static final int HIGH_FIRST_PRICE = 98;
    public static final int HIGH_SECOND_PRICE = 88;
    public static final int HIGH_STAND_PRICE = 68;
    public static final int HIGH_VIP_PRICE = 128;

    public static final int LOW_FIRST_PRICE = 48;
    public static final int LOW_SECOND_PRICE = 38;
    public static final int LOW_SOFT_PRICE = 128;
    public static final int LOW_HARD_PRICE = 68;
    public static final int LOW_STAND_PRICE = 28;

    public static final int HIGH_SPEED = 1;
    public static final int LOW_SPEED = 0;

    public static final int INVALID_TRAIN_NO = -8;
    public static final int NO_TRAIN_RUNNING = -18;
    public static final int GET_TIMELINE_SUCCESS = 10;

    public static int getPrice(Integer trainType, Integer seatType) {
        if (trainType == HIGH_SPEED) {
            switch (seatType) {
                case FIRST_SEAT:
                    return HIGH_FIRST_PRICE;
                case SECOND_SEAT:
                    return HIGH_SECOND_PRICE;
                case VIP_SEAT:
                    return HIGH_VIP_PRICE;
                case STAND_SEAT:
                    return HIGH_STAND_PRICE;
            }
        } else {
            switch (seatType) {
                case FIRST_SEAT:
                    return LOW_FIRST_PRICE;
                case SECOND_SEAT:
                    return LOW_SECOND_PRICE;
                case SOFT_LIE_SEAT:
                    return LOW_SOFT_PRICE;
                case STAND_SEAT:
                    return LOW_STAND_PRICE;
                case HARD_LIE_SEAT:
                    return LOW_HARD_PRICE;
            }

        }
        return 0;
    }

    public static String getSeat(Integer seatType,Integer seatBit){
        int carriage_no,row_no,seat_pos;
        int carriage=4,row=24,seat=5,offset=1;

        switch (seatType){
            case SECOND_SEAT:
                carriage=4;
                row=24;
                seat=5;
                offset=1;
                break;
            case FIRST_SEAT:
                carriage=4;
                row=21;
                seat=4;
                offset=5;
                break;
            case VIP_SEAT:
                carriage=4;
                row=18;
                seat=3;
                offset=9;
                break;
            case HARD_LIE_SEAT:
                carriage=4;
                row=10;
                seat=6;
                offset=9;
                break;
            case SOFT_LIE_SEAT:
                carriage=4;
                row=10;
                seat=4;
                offset=13;
                break;
            case STAND_SEAT:
                carriage=4;
                offset=1;
                break;
        }
        if (seatType!=STAND_SEAT){
            carriage_no=seatBit%carriage+offset;//车厢
            row_no=seatBit%row+1;//排
            seat_pos=seatBit%seat+1;//座
            String c = Integer.toString(carriage_no);
            String r =Integer.toString(row_no);
            String s =((char) (seat_pos % 26 + (int) 'A')) + "";
            return c+"号车厢"+r+"排"+s+"座";
        }
        carriage_no=seatBit%carriage+1;//车厢
        String c = Integer.toString(carriage_no);
        return c+"号车厢站票";
    }



}
