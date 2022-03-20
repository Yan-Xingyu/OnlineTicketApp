package com.OnlineTickets.backend.daoimpl;

import com.OnlineTickets.backend.constant.TrainConstants;
import com.OnlineTickets.backend.dao.SearchDao;
import com.OnlineTickets.backend.entity.MapStation;
import com.OnlineTickets.backend.entity.Station;

import com.OnlineTickets.backend.entity.TrainInfo;
import com.OnlineTickets.backend.repository.MapStationRepository;
import com.OnlineTickets.backend.repository.StationRepository;
import com.OnlineTickets.backend.repository.TrainInfoRepository;
import com.OnlineTickets.backend.repository.TrainStationInfoRepository;
import com.OnlineTickets.backend.utils.MapPath;
import com.OnlineTickets.backend.utils.Message;
import net.sf.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;


import java.util.BitSet;
import java.util.Date;
import java.util.List;
import java.util.Map;

import static com.OnlineTickets.backend.utils.BitSetConvert.bitSet2ByteArray;

@Repository
public class SearchDaoImpl implements SearchDao {
    @Autowired
    StationRepository stationRepository;
    @Autowired
    TrainStationInfoRepository trainStationInfoRepository;
    @Autowired
    TrainInfoRepository trainInfoRepository;

    @Autowired
    MapStationRepository mapStationRepository;

    @Override
    public List<Integer> cityToStations(String city) {
        return stationRepository.cityToStations(city);
    }

    @Override
    public List<String> cityIdToStations(Integer city) {
        return stationRepository.cityIdToStations(city);
    }


    @Override
    public Station getStationById(Integer stationId) {
        return stationRepository.getById(stationId);
    }

    @Override
    public List<Map<String, Object>> getTrains(Date target, Integer startCity, Integer endCity) {
        return trainStationInfoRepository.fuzzyQuery(target,addDate(target),startCity,endCity);
    }

    @Override
    public List<Map<String, Object>> getTrainsCityToStation(Date target, Integer startCity, Integer end) {
        return trainStationInfoRepository.fuzzyQueryCityToStation(target,addDate(target),startCity,end);
    }

    @Override
    public List<Map<String, Object>> getTrainsStationToCity(Date target, Integer start, Integer endCity) {
        return trainStationInfoRepository.fuzzyQueryStationToCity(target,addDate(target),start,endCity);
    }

    @Override
    public List<Map<String, Object>> getTrainsStationToStation(Date target, Integer start, Integer end) {
        return trainStationInfoRepository.fuzzyQueryStationToStation(target,addDate(target),start,end);
    }

    @Override
    public TrainInfo getTrainInfo(Integer trainId) {
        return trainInfoRepository.getById(trainId);
    }

    @Override
    public List<String> getStations(String name) {
        return stationRepository.getStationNameByCity(name);
    }

    @Override
    public Message searchTimeTableInfoByTag(Date date, String trainTag){
        List<Integer> ids = trainInfoRepository.getTrainIdByTagOnly(trainTag);
        if(ids.isEmpty())
            return Message.createMessage(TrainConstants.INVALID_TRAIN_NO, "车次号无效");

        Integer trainId = trainInfoRepository.getTrainIdByTag(date, addDate(date), trainTag);
        if(trainId == null){
            return Message.createMessage(TrainConstants.NO_TRAIN_RUNNING, "该车次未运行");
        }
        else{
            List<JSONObject> data =  trainStationInfoRepository.getTimeTableByTrainId(trainId);
            if(data.isEmpty()){
                return Message.createMessage(TrainConstants.NO_TRAIN_RUNNING, "该车次未运行");
            }
            else{
                JSONObject ret = new JSONObject();
                ret.put("trainId", trainId);
                ret.put("data", data);
                return Message.createMessage(TrainConstants.GET_TIMELINE_SUCCESS, "查询成功", ret);
            }
        }
    }


    @Override
    public void updateBits(Integer type, BitSet bits,Integer id){
        switch (type)
        {
            case 0:
                trainStationInfoRepository.updateFirstSeatBits(bitSet2ByteArray(bits),id);
                break;
            case 1:
                trainStationInfoRepository.updateHardLieBits(bitSet2ByteArray(bits),id);
                break;
            case 2:
                trainStationInfoRepository.updateSecondSeatBits(bitSet2ByteArray(bits),id);
                break;
            case 3:
                trainStationInfoRepository.updateSoftLieBits(bitSet2ByteArray(bits),id);
                break;
            case 4:
                trainStationInfoRepository.updateStandSeatBits(bitSet2ByteArray(bits),id);
                break;
            case 5:
                trainStationInfoRepository.updateVipSeatBits(bitSet2ByteArray(bits),id);
                break;
        };
    }

    @Override
    public Integer getCityByName(String name) {
        return stationRepository.getCityIdByStationName(name);
    }

    @Override
    public List<MapPath> getOneTransitSortByJava(String startStationName, String endStationName,
                                       int minWaitMinute, int maxWaitMinute, int searchNo){
        return MapPath.getOneTransitSortByJava(minWaitMinute, maxWaitMinute, searchNo, mapStationRepository.getOneTransitWithoutOrder(startStationName, endStationName));
    }

    @Override
    public List<MapPath> getOneTransitSortByNeo4j(String startStationName, String endStationName,
                              int minWaitMinute, int maxWaitMinute, int searchNo){
        return MapPath.getOneTransitSortByNeo4j(searchNo, mapStationRepository.getOneTransitWithOrder(
                startStationName, endStationName, minWaitMinute, maxWaitMinute));
    }

    @Override
    public TrainInfo getTrainInfoByTag(String trainTag, Date startDate) {

        return trainInfoRepository.getTrainInfoByTag(trainTag,startDate,addDate(startDate));

    }

    @Override
    public List<TrainInfo> getTrainInfoByTagAndEndDate(String trainTag, Date startDate) {
        return trainInfoRepository.getTrainInfoByTagAndStartDate(trainTag,startDate);
    }

    @Override
    public Integer getCityIdByCity(String name) {
        return stationRepository.getCityIdByCity(name);
    }

    @Override
    public List<Map<String, Object>> getPassByStation(Date date, Integer startCityId, Integer endCityId, Integer maxWaitTime, Integer minWaitTime) {
        return trainStationInfoRepository.getPassByStation(date,addDate(date),startCityId,endCityId,maxWaitTime,minWaitTime);
    }


    public Date addDate(Date nowDate){
        return  new Date(nowDate.getYear(),nowDate.getMonth(),nowDate.getDate()+1);
    }

    public Date addDate(Date nowDate,int dayDif){
        return  new Date(nowDate.getYear(),nowDate.getMonth(),nowDate.getDate()+dayDif);
    }
}
