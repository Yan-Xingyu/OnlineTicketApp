package com.OnlineTickets.backend.dao;

import com.OnlineTickets.backend.entity.MapStation;
import com.OnlineTickets.backend.entity.Station;
import com.OnlineTickets.backend.entity.TrainInfo;
import com.OnlineTickets.backend.utils.MapPath;
import com.OnlineTickets.backend.utils.Message;
import net.sf.json.JSONObject;

import java.util.BitSet;
import java.util.Date;
import java.util.List;
import java.util.Map;

public interface SearchDao {
    Message searchTimeTableInfoByTag(Date date, String trainTag);
    List<Integer> cityToStations(String city);
    List<String> cityIdToStations(Integer city);
    Station getStationById(Integer stationId);
    List<Map<String, Object>> getTrains(Date target, Integer startCity, Integer endCity);
    List<Map<String, Object>> getTrainsCityToStation(Date target, Integer startCity, Integer end);
    List<Map<String, Object>> getTrainsStationToCity(Date target,Integer startCity, Integer end);
    List<Map<String, Object>> getTrainsStationToStation(Date target,Integer start, Integer end);
    TrainInfo getTrainInfo(Integer trainId);
    List<String> getStations(String name);
    void updateBits(Integer type, BitSet bits,Integer id);
    Integer getCityByName(String name);


    List<MapPath> getOneTransitSortByJava(String startStationName, String endStationName,
                                int minWaitMinute, int maxWaitMinute, int searchNo);
    List<MapPath> getOneTransitSortByNeo4j(String startStationName, String endStationName,
                       int minWaitMinute, int maxWaitMinute, int searchNo);
    TrainInfo getTrainInfoByTag(String trainTag,Date startDate);
    List<TrainInfo> getTrainInfoByTagAndEndDate(String trainTag,Date startDate);
    Integer getCityIdByCity(String name);
    List<Map<String, Object>> getPassByStation(Date date,Integer startCityId,Integer endCityId,Integer maxWaitTime,Integer minWaitTime);

}
