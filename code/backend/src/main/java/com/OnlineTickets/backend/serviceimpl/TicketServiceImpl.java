package com.OnlineTickets.backend.serviceimpl;

import com.OnlineTickets.backend.config.JsonDateValueProcessor;
import com.OnlineTickets.backend.dao.SearchDao;
import com.OnlineTickets.backend.entity.MapStation;
import com.OnlineTickets.backend.entity.TrainInfo;
import com.OnlineTickets.backend.entity.TrainStationInfo;
import com.OnlineTickets.backend.service.TicketService;
import com.OnlineTickets.backend.utils.BitSetConvert;
import com.OnlineTickets.backend.utils.MapPath;
import com.OnlineTickets.backend.utils.Message;
import net.sf.json.JSONArray;
import net.sf.json.JSONObject;
import net.sf.json.JsonConfig;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class TicketServiceImpl implements TicketService {
    @Autowired
    SearchDao searchDao;
    @Override
    public JSONArray PtoPSearch(Date target, String startCity, String endCity) {

        List<Integer> start= searchDao.cityToStations(startCity);
        List<Integer> end= searchDao.cityToStations(endCity);
        JSONArray ret = new JSONArray();
        List<Map<String,Object>> trains = new ArrayList<>();
       // long time1 = new Date().getTime();
        //双向模糊搜索
       if(start.size()>1&&end.size()>1){
            Integer startCityId = searchDao.getStationById(start.get(0)).getCityId();
            Integer endCityId = searchDao.getStationById(end.get(0)).getCityId();
            trains = searchDao.getTrains(target,startCityId,endCityId);
        }
       if(start.size()>1&&end.size()==1){
           Integer startCityId = searchDao.getStationById(start.get(0)).getCityId();
            trains = searchDao.getTrainsCityToStation(target,startCityId,end.get(0));
       }
        if(start.size()==1&&end.size()>1){
            Integer endCityId = searchDao.getStationById(end.get(0)).getCityId();
            trains = searchDao.getTrainsStationToCity(target,start.get(0),endCityId);
        }
        if(start.size()==1&&end.size()==1){
            trains = searchDao.getTrainsStationToStation(target,start.get(0),end.get(0));
        }
        if(start.size()==0||end.size()==0){
            return null;
        }
       // long time2 = new Date().getTime();
       // System.out.println(time2-time1);
       // long time3 = new Date().getTime();
        if(trains.size()>=1){
            for (Map<String, Object> train : trains) {
                JSONObject item = new JSONObject();
                Integer trainId = (Integer) train.get("train_id");
                Integer start_no = (Integer) train.get("start_no");
                Integer end_no = (Integer) train.get("end_no");
                TrainInfo trainInfo = searchDao.getTrainInfo(trainId);
                item.put("train_tag",trainInfo.getTrainTag());
                item.put("train_type",trainInfo.getTrainType());
                item.put("train_id", train.get("train_id"));
                item.put("start_no",start_no);
                item.put("end_no",end_no);
                Set<TrainStationInfo> stationInfoSet =trainInfo.getTrainStationInfoSet();

                if(trainInfo.getTrainType()>0){
                    BitSet first = new BitSet(336);
                    BitSet second = new BitSet(480);
                    BitSet vip = new BitSet(216);
                    BitSet stand = new BitSet(80);
                    for (TrainStationInfo stationInfo : stationInfoSet) {

                        if(stationInfo.getStationNo()>=start_no&&stationInfo.getStationNo()<=end_no){
                            if(stationInfo.getStationNo()==start_no){
                                item.put("start_station",stationInfo.getStationName());
                                item.put("start_time",stationInfo.getArriveTime());
                            }
                            if(stationInfo.getStationNo()!=end_no){
                                first.or(BitSetConvert.byteArray2BitSet(stationInfo.getFirstSeatBits()));
                                second.or(BitSetConvert.byteArray2BitSet(stationInfo.getSecondSeatBits()));
                                vip.or(BitSetConvert.byteArray2BitSet(stationInfo.getVipSeatBits()));
                                stand.or(BitSetConvert.byteArray2BitSet(stationInfo.getStandSeatBits()));
                            }
                            else{
                                item.put("end_station",stationInfo.getStationName());
                                item.put("end_time",stationInfo.getArriveTime());
                            }
                        }
                    }
                    item.put("first_seat",336-first.cardinality());
                    item.put("second_seat",480-second.cardinality());
                    item.put("vip_seat",216-vip.cardinality());
                    item.put("stand_seat",80-stand.cardinality());
                    item.put("price",(end_no-start_no)*88);
                }
                if(trainInfo.getTrainType()==0){
                    BitSet first = new BitSet(336);
                    BitSet second = new BitSet(480);
                    BitSet softLie = new BitSet(160);
                    BitSet hardLie = new BitSet(240);
                    BitSet stand = new BitSet(120);
                    for (TrainStationInfo stationInfo : stationInfoSet) {
                        if(stationInfo.getStationNo()>=start_no&&stationInfo.getStationNo()<=end_no){
                            if(stationInfo.getStationNo()==start_no){
                                item.put("start_station",stationInfo.getStationName());
                                item.put("start_time",stationInfo.getArriveTime());
                            }
                            if(stationInfo.getStationNo()!=end_no){
                                first.or(BitSetConvert.byteArray2BitSet(stationInfo.getFirstSeatBits()));
                                second.or(BitSetConvert.byteArray2BitSet(stationInfo.getSecondSeatBits()));
                                softLie.or(BitSetConvert.byteArray2BitSet(stationInfo.getSoftLieBits()));
                                stand.or(BitSetConvert.byteArray2BitSet(stationInfo.getStandSeatBits()));
                                hardLie.or(BitSetConvert.byteArray2BitSet(stationInfo.getHardLieBits()));
                            }
                            else{
                                item.put("end_station",stationInfo.getStationName());
                                item.put("end_time",stationInfo.getArriveTime());
                            }
                        }
                    }
                    item.put("first_seat",336-first.cardinality());
                    item.put("second_seat",480-second.cardinality());
                    item.put("softLie_seat",160-softLie.cardinality());
                    item.put("hardLie_seat",240-hardLie.cardinality());
                    item.put("stand_seat",120-stand.cardinality());
                    item.put("price",(end_no-start_no)*66);
                }
                ret.add(item);
            }
        }
        return ret;
    }

    @Override
    public JSONArray ChangeTicketSearch(Date target, String start, String end) {
        List<Integer> startCity= searchDao.cityToStations(start);
        List<Integer> endCity= searchDao.cityToStations(end);


        JSONArray ret = new JSONArray();
        List<Map<String,Object>> trains =new ArrayList<>();
        long time1 = new Date().getTime();
        //双向模糊搜索

        Integer startCityId = searchDao.getStationById(startCity.get(0)).getCityId();
        Integer endCityId = searchDao.getStationById(endCity.get(0)).getCityId();
        trains = searchDao.getTrains(target,startCityId,endCityId);


        long time2 = new Date().getTime();
        System.out.println(time2-time1);
        long time3 = new Date().getTime();
        for (Map<String, Object> train : trains) {
            JSONObject item = new JSONObject();
            Integer trainId = (Integer) train.get("train_id");
            Integer start_no = (Integer) train.get("start_no");
            Integer end_no = (Integer) train.get("end_no");
            TrainInfo trainInfo = searchDao.getTrainInfo(trainId);
            item.put("train_tag",trainInfo.getTrainTag());
            item.put("train_type",trainInfo.getTrainType());
            item.put("train_id", train.get("train_id"));
            item.put("start_no",start_no);
            item.put("end_no",end_no);
            Set<TrainStationInfo> stationInfoSet =trainInfo.getTrainStationInfoSet();

            if(trainInfo.getTrainType()>0){
                BitSet first = new BitSet(336);
                BitSet second = new BitSet(480);
                BitSet vip = new BitSet(216);
                BitSet stand = new BitSet(80);
                for (TrainStationInfo stationInfo : stationInfoSet) {

                    if(stationInfo.getStationNo()>=start_no&&stationInfo.getStationNo()<=end_no){
                        if(stationInfo.getStationNo()==start_no){
                            item.put("start_station",stationInfo.getStationName());
                            item.put("start_time",stationInfo.getArriveTime());
                        }
                        if(stationInfo.getStationNo()!=end_no){
                            first.or(BitSetConvert.byteArray2BitSet(stationInfo.getFirstSeatBits()));
                            second.or(BitSetConvert.byteArray2BitSet(stationInfo.getSecondSeatBits()));
                            vip.or(BitSetConvert.byteArray2BitSet(stationInfo.getVipSeatBits()));
                            stand.or(BitSetConvert.byteArray2BitSet(stationInfo.getStandSeatBits()));
                        }
                        else{
                            item.put("end_station",stationInfo.getStationName());
                            item.put("end_time",stationInfo.getArriveTime());
                        }
                    }
                }
                item.put("first_seat",336-first.cardinality());
                item.put("second_seat",480-second.cardinality());
                item.put("vip_seat",216-vip.cardinality());
                item.put("stand_seat",80-stand.cardinality());
                item.put("price",(end_no-start_no)*88);
            }
            if(trainInfo.getTrainType()==0){
                BitSet first = new BitSet(336);
                BitSet second = new BitSet(480);
                BitSet softLie = new BitSet(160);
                BitSet hardLie = new BitSet(240);
                BitSet stand = new BitSet(120);
                for (TrainStationInfo stationInfo : stationInfoSet) {
                    if(stationInfo.getStationNo()>=start_no&&stationInfo.getStationNo()<=end_no){
                        if(stationInfo.getStationNo()==start_no){
                            item.put("start_station",stationInfo.getStationName());
                            item.put("start_time",stationInfo.getArriveTime());
                        }
                        if(stationInfo.getStationNo()!=end_no){
                            first.or(BitSetConvert.byteArray2BitSet(stationInfo.getFirstSeatBits()));
                            second.or(BitSetConvert.byteArray2BitSet(stationInfo.getSecondSeatBits()));
                            softLie.or(BitSetConvert.byteArray2BitSet(stationInfo.getSoftLieBits()));
                            stand.or(BitSetConvert.byteArray2BitSet(stationInfo.getStandSeatBits()));
                            hardLie.or(BitSetConvert.byteArray2BitSet(stationInfo.getHardLieBits()));
                        }
                        else{
                            item.put("end_station",stationInfo.getStationName());
                            item.put("end_time",stationInfo.getArriveTime());
                        }
                    }
                }
                item.put("first_seat",336-first.cardinality());
                item.put("second_seat",480-second.cardinality());
                item.put("softLie_seat",160-softLie.cardinality());
                item.put("hardLie_seat",240-hardLie.cardinality());
                item.put("stand_seat",120-stand.cardinality());
                item.put("price",(end_no-start_no)*66);
            }
            ret.add(item);
        }
        long time4 = new Date().getTime();
        System.out.println(time4-time3);
        return ret;
    }

   /* @Override
    public List<Map<String, Object>> testPerformance(Date target,Integer startCity, Integer endCity) {
        return searchDao.getTrains(target,startCity,startCity);
    }*/

    @Override
    public JSONObject searchStation(String start, String end) {
        List<String> startStations = searchDao.getStations(start);
        List<String> endStations =searchDao.getStations(end);
        JSONObject obj = new JSONObject();
        obj.put("startStation",startStations);
        obj.put("endStation",endStations);
        return obj;
    }

    @Override
    public JSONObject getTicketInfo(Integer trainId, Integer start_no, Integer end_no) {

        TrainInfo trainInfo = searchDao.getTrainInfo(trainId);
        JSONObject item = new JSONObject();
        item.put("train_tag",trainInfo.getTrainTag());
        item.put("train_type",trainInfo.getTrainType());
        item.put("train_id", trainId);
        item.put("start_no",start_no);
        item.put("end_no",end_no);
        Set<TrainStationInfo> stationInfoSet =trainInfo.getTrainStationInfoSet();
        if(trainInfo.getTrainType()>0){
            BitSet first = new BitSet(336);
            BitSet second = new BitSet(480);
            BitSet vip = new BitSet(216);
            BitSet stand = new BitSet(80);
            for (TrainStationInfo stationInfo : stationInfoSet) {

                if(stationInfo.getStationNo()>=start_no&&stationInfo.getStationNo()<=end_no){
                    if(stationInfo.getStationNo()==start_no){
                        item.put("start_station",stationInfo.getStationName());
                        item.put("start_time",stationInfo.getArriveTime());
                    }
                    if(stationInfo.getStationNo()!=end_no){
                        first.or(BitSetConvert.byteArray2BitSet(stationInfo.getFirstSeatBits()));
                        second.or(BitSetConvert.byteArray2BitSet(stationInfo.getSecondSeatBits()));
                        vip.or(BitSetConvert.byteArray2BitSet(stationInfo.getVipSeatBits()));
                        stand.or(BitSetConvert.byteArray2BitSet(stationInfo.getStandSeatBits()));
                    }
                    else{
                        item.put("end_station",stationInfo.getStationName());
                        item.put("end_time",stationInfo.getArriveTime());
                    }
                }
            }
            item.put("first_seat",336-first.cardinality());
            item.put("second_seat",480-second.cardinality());
            item.put("vip_seat",216-vip.cardinality());
            item.put("stand_seat",80-stand.cardinality());

        }
        if(trainInfo.getTrainType()==0){
            BitSet first = new BitSet(336);
            BitSet second = new BitSet(480);
            BitSet softLie = new BitSet(160);
            BitSet hardLie = new BitSet(240);
            BitSet stand = new BitSet(120);
            for (TrainStationInfo stationInfo : stationInfoSet) {
                if(stationInfo.getStationNo()>=start_no&&stationInfo.getStationNo()<=end_no){
                    if(stationInfo.getStationNo()==start_no){
                        item.put("start_station",stationInfo.getStationName());
                        item.put("start_time",stationInfo.getArriveTime());
                    }
                    if(stationInfo.getStationNo()!=end_no){
                        first.or(BitSetConvert.byteArray2BitSet(stationInfo.getFirstSeatBits()));
                        second.or(BitSetConvert.byteArray2BitSet(stationInfo.getSecondSeatBits()));
                        softLie.or(BitSetConvert.byteArray2BitSet(stationInfo.getSoftLieBits()));
                        stand.or(BitSetConvert.byteArray2BitSet(stationInfo.getStandSeatBits()));
                        hardLie.or(BitSetConvert.byteArray2BitSet(stationInfo.getHardLieBits()));
                    }
                    else{
                        item.put("end_station",stationInfo.getStationName());
                        item.put("end_time",stationInfo.getArriveTime());
                    }
                }
            }
            item.put("first_seat",336-first.cardinality());
            item.put("second_seat",480-second.cardinality());
            item.put("softLie_seat",160-softLie.cardinality());
            item.put("hardLie_seat",240-hardLie.cardinality());
            item.put("stand_seat",120-stand.cardinality());

        }
        return item;
    }

    @Override
    public JSONObject searchStationChange(String start, String end) {
        Integer startCity = searchDao.getCityByName(start);
        Integer endCity =searchDao.getCityByName(end);
        List<String> startStations = searchDao.cityIdToStations(startCity);
        List<String> endStations =searchDao.cityIdToStations(endCity);
        JSONObject obj = new JSONObject();
        obj.put("startStation",startStations);
        obj.put("endStation",endStations);
        return obj;


    }

    @Override
    public Message searchTimeTableInfoByTag(Date date, String trainTag){
        return searchDao.searchTimeTableInfoByTag(date, trainTag);
    }

    @Override
    public JSONArray neo4jPassBy(Date target, String startCity, String endCity) {
      JSONArray ret = new JSONArray();

        List<MapPath> tmp = searchDao.getOneTransitSortByJava(startCity,endCity,60,1440,20);
        for (MapPath path : tmp) {
            MapStation startStation= path.getStartStation();
            MapStation passStation=startStation.getPathLine().getEndStation();
            MapStation endStation=passStation.getPathLine().getEndStation();
            Date firstStartDate = new Date(target.getYear(),target.getMonth(),target.getDate()+path.getDayDifOfFirstLine());
            Date secondStartDate = new Date(target.getYear(),target.getMonth(),target.getDate()+path.getDayDifOfSecondLine());
            if(firstStartDate.after(secondStartDate))
                continue;
            TrainInfo firstTrainInfo = searchDao.getTrainInfoByTag(startStation.getPathLine().getTrainTag(),firstStartDate);
            if (firstTrainInfo==null) continue;
            TrainInfo secondTrainInfo=searchDao.getTrainInfoByTag(passStation.getPathLine().getTrainTag(),secondStartDate);
            if (secondTrainInfo==null) continue;
            Set<TrainStationInfo> firstSet = firstTrainInfo.getTrainStationInfoSet();
            if (firstSet==null) continue;
            Set<TrainStationInfo> secondSet = secondTrainInfo.getTrainStationInfoSet();
            if (secondSet==null) continue;
            int firstStartNo=-1,secondStartNo=-1,firstEndNo=-1,secondEndNo=-1;
            Date firstStartTime = new Date();
            Date firstEndTime = new Date();
            Date secondStartTime = new Date();
            Date secondEndTime = new Date();
            for (TrainStationInfo trainStationInfo : firstSet) {
                if(trainStationInfo.getStationName().equals(startStation.getStationName())){
                    firstStartTime=trainStationInfo.getArriveTime();
                    firstStartNo=trainStationInfo.getStationNo();
                }
                if (trainStationInfo.getStationName().equals(passStation.getStationName())){
                    firstEndTime=trainStationInfo.getArriveTime();
                    firstEndNo=trainStationInfo.getStationNo();
                }
            }
            for (TrainStationInfo trainStationInfo : secondSet) {
                if(trainStationInfo.getStationName().equals(endStation.getStationName())){
                    secondEndTime=trainStationInfo.getArriveTime();
                    secondEndNo=trainStationInfo.getStationNo();
                }
                if (trainStationInfo.getStationName().equals(passStation.getStationName())){
                    secondStartTime=trainStationInfo.getArriveTime();
                    secondStartNo=trainStationInfo.getStationNo();
                }
            }
            if (secondStartTime.before(firstEndTime))
                continue;
            JSONObject firstRail = new JSONObject();
            JSONObject secondRail = new JSONObject();
            firstRail.put("train_tag",firstTrainInfo.getTrainTag());
            firstRail.put("train_id",firstTrainInfo.getTrainId());
            secondRail.put("train_tag",secondTrainInfo.getTrainTag());
            secondRail.put("train_id",secondTrainInfo.getTrainId());
            firstRail.put("start_no",firstStartNo);
            firstRail.put("end_no",firstEndNo);
            secondRail.put("start_no",secondStartNo);
            secondRail.put("end_no",secondEndNo);
            if(firstTrainInfo.getTrainType()>0){
                firstRail.put("train_type",1);
                BitSet first = new BitSet(336);
                BitSet second = new BitSet(480);
                BitSet vip = new BitSet(216);
                BitSet stand = new BitSet(80);
                for (TrainStationInfo stationInfo : firstSet) {
                    if(stationInfo.getStationNo()>=firstStartNo&&stationInfo.getStationNo()<=firstEndNo){
                        if(stationInfo.getStationNo()==firstStartNo){
                            firstRail.put("start_station",stationInfo.getStationName());
                            firstRail.put("start_time",stationInfo.getArriveTime());

                        }
                        if(stationInfo.getStationNo()!=firstEndNo){
                            first.or(BitSetConvert.byteArray2BitSet(stationInfo.getFirstSeatBits()));
                            second.or(BitSetConvert.byteArray2BitSet(stationInfo.getSecondSeatBits()));
                            vip.or(BitSetConvert.byteArray2BitSet(stationInfo.getVipSeatBits()));
                            stand.or(BitSetConvert.byteArray2BitSet(stationInfo.getStandSeatBits()));
                        }
                        else{
                            firstRail.put("end_station",stationInfo.getStationName());
                            firstRail.put("end_time",stationInfo.getArriveTime());
                        }
                    }
                }
                firstRail.put("first_seat",336-first.cardinality());
                firstRail.put("second_seat",480-second.cardinality());
                firstRail.put("vip_seat",216-vip.cardinality());
                firstRail.put("stand_seat",80-stand.cardinality());

            }
            if(firstTrainInfo.getTrainType()==0){
                firstRail.put("train_type",0);
                BitSet first = new BitSet(336);
                BitSet second = new BitSet(480);
                BitSet softLie = new BitSet(160);
                BitSet hardLie = new BitSet(240);
                BitSet stand = new BitSet(120);
                for (TrainStationInfo stationInfo : firstSet) {
                    if(stationInfo.getStationNo()>=firstStartNo&&stationInfo.getStationNo()<=firstEndNo){
                        if(stationInfo.getStationNo()==firstStartNo){
                            firstRail.put("start_station",stationInfo.getStationName());
                            firstRail.put("start_time",stationInfo.getArriveTime());
                        }
                        if(stationInfo.getStationNo()!=firstEndNo){
                            first.or(BitSetConvert.byteArray2BitSet(stationInfo.getFirstSeatBits()));
                            second.or(BitSetConvert.byteArray2BitSet(stationInfo.getSecondSeatBits()));
                            softLie.or(BitSetConvert.byteArray2BitSet(stationInfo.getSoftLieBits()));
                            stand.or(BitSetConvert.byteArray2BitSet(stationInfo.getStandSeatBits()));
                            hardLie.or(BitSetConvert.byteArray2BitSet(stationInfo.getHardLieBits()));
                        }
                        else{
                            firstRail.put("end_station",stationInfo.getStationName());
                            firstRail.put("end_time",stationInfo.getArriveTime());
                        }
                    }
                }
                firstRail.put("first_seat",336-first.cardinality());
                firstRail.put("second_seat",480-second.cardinality());
                firstRail.put("softLie_seat",160-softLie.cardinality());
                firstRail.put("hardLie_seat",240-hardLie.cardinality());
                firstRail.put("stand_seat",120-stand.cardinality());

            }
            if(secondTrainInfo.getTrainType()>0){
                secondRail.put("train_type",1);
                BitSet first = new BitSet(336);
                BitSet second = new BitSet(480);
                BitSet vip = new BitSet(216);
                BitSet stand = new BitSet(80);
                for (TrainStationInfo stationInfo : secondSet) {

                    if(stationInfo.getStationNo()>=secondStartNo&&stationInfo.getStationNo()<=secondEndNo){
                        if(stationInfo.getStationNo()==secondStartNo){
                            secondRail.put("start_station",stationInfo.getStationName());
                            secondRail.put("start_time",stationInfo.getArriveTime());
                        }
                        if(stationInfo.getStationNo()!=secondEndNo){
                            first.or(BitSetConvert.byteArray2BitSet(stationInfo.getFirstSeatBits()));
                            second.or(BitSetConvert.byteArray2BitSet(stationInfo.getSecondSeatBits()));
                            vip.or(BitSetConvert.byteArray2BitSet(stationInfo.getVipSeatBits()));
                            stand.or(BitSetConvert.byteArray2BitSet(stationInfo.getStandSeatBits()));
                        }
                        else{
                            secondRail.put("end_station",stationInfo.getStationName());
                            secondRail.put("end_time",stationInfo.getArriveTime());
                        }
                    }
                }
                secondRail.put("first_seat",336-first.cardinality());
                secondRail.put("second_seat",480-second.cardinality());
                secondRail.put("vip_seat",216-vip.cardinality());
                secondRail.put("stand_seat",80-stand.cardinality());

            }
            if(secondTrainInfo.getTrainType()==0){
                secondRail.put("train_type",0);
                BitSet first = new BitSet(336);
                BitSet second = new BitSet(480);
                BitSet softLie = new BitSet(160);
                BitSet hardLie = new BitSet(240);
                BitSet stand = new BitSet(120);
                for (TrainStationInfo stationInfo : secondSet) {
                    if(stationInfo.getStationNo()>=secondStartNo&&stationInfo.getStationNo()<=secondEndNo){
                        if(stationInfo.getStationNo()==secondStartNo){
                            secondRail.put("start_station",stationInfo.getStationName());
                            secondRail.put("start_time",stationInfo.getArriveTime());
                        }
                        if(stationInfo.getStationNo()!=secondEndNo){
                            first.or(BitSetConvert.byteArray2BitSet(stationInfo.getFirstSeatBits()));
                            second.or(BitSetConvert.byteArray2BitSet(stationInfo.getSecondSeatBits()));
                            softLie.or(BitSetConvert.byteArray2BitSet(stationInfo.getSoftLieBits()));
                            stand.or(BitSetConvert.byteArray2BitSet(stationInfo.getStandSeatBits()));
                            hardLie.or(BitSetConvert.byteArray2BitSet(stationInfo.getHardLieBits()));
                        }
                        else{
                            secondRail.put("end_station",stationInfo.getStationName());
                            secondRail.put("end_time",stationInfo.getArriveTime());
                        }
                    }
                }
                secondRail.put("first_seat",336-first.cardinality());
                secondRail.put("second_seat",480-second.cardinality());
                secondRail.put("softLie_seat",160-softLie.cardinality());
                secondRail.put("hardLie_seat",240-hardLie.cardinality());
                secondRail.put("stand_seat",120-stand.cardinality());

            }

            JSONObject item =new JSONObject();
            item.put("first_rail",firstRail);
            item.put("second_rail",secondRail);
            ret.add(item);

        }
        return ret;
    }

}
