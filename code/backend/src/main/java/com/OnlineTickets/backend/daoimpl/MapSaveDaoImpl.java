package com.OnlineTickets.backend.daoimpl;

import com.OnlineTickets.backend.dao.MapSaveDao;
import com.OnlineTickets.backend.entity.MapStation;
import com.OnlineTickets.backend.entity.Station;
import com.OnlineTickets.backend.entity.TrainStationInfo;
import com.OnlineTickets.backend.repository.MapStationRepository;
import com.OnlineTickets.backend.repository.StationRepository;
import com.OnlineTickets.backend.repository.TrainInfoRepository;
import com.OnlineTickets.backend.repository.TrainStationInfoRepository;
import net.sf.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;


@Repository
public class MapSaveDaoImpl implements MapSaveDao {
    @Autowired
    MapStationRepository mapStationRepository;

    @Autowired
    StationRepository stationRepository;

    @Autowired
    TrainInfoRepository trainInfoRepository;

    @Autowired
    TrainStationInfoRepository trainStationInfoRepository;

    @Override
    public void saveStationNode(){
        List<Station> stations = stationRepository.findAll();
        List<MapStation> mapStations = new ArrayList<>();

        for (Station station: stations){
            mapStations.add(new MapStation(station));
        }
        mapStationRepository.saveAll(mapStations);
    }

    private int getDayDif(Date pre, Date next){
       int preDay = pre.getDate();
       int nextDay = next.getDate();
       return pre.getMonth() == next.getMonth() ? nextDay - preDay : 31 - preDay + nextDay;
    }

    @Override
    public void saveLineNode(){
        List<JSONObject> trainInfos = trainInfoRepository.getMinTrainGroupByTrainTag();

        for (JSONObject trainInfo : trainInfos){
            List<TrainStationInfo> trainStationInfos = trainStationInfoRepository.getTimeLineByTrainId((int)trainInfo.get("train_id"));
            String trainTag = (String) trainInfo.get("train_tag");
            for(int i = 0; i < trainStationInfos.size(); ++i){
                int startStationId = trainStationInfos.get(i).getArriveSid();
                Date startTime = trainStationInfos.get(i).getLeaveTime();
                int startHour = startTime.getHours();
                int startMinute = startTime.getMinutes();

                for(int j = i + 1; j < trainStationInfos.size(); ++j){
                    int endStationId = trainStationInfos.get(j).getArriveSid();
                    Date endTime = trainStationInfos.get(j).getArriveTime();
                    int endHour = endTime.getHours();
                    int endMinute = endTime.getMinutes();

                    mapStationRepository.saveLineNode(startStationId, endStationId, trainTag, startHour, startMinute, endHour, endMinute, getDayDif(startTime, endTime));
                }
            }
        }
    }

    @Override
    public void saveTravelMinute(){
        mapStationRepository.saveTravelMinute();
    }

    @Override
    public void saveDayDifFromStart(){
        List<JSONObject> trainInfos = trainInfoRepository.getMinTrainGroupByTrainTag();

        for (JSONObject trainInfo : trainInfos){
            List<TrainStationInfo> trainStationInfos = trainStationInfoRepository.getTimeLineByTrainId((int)trainInfo.get("train_id"));
            String trainTag = (String) trainInfo.get("train_tag");

            Date startTime = trainStationInfos.get(0).getLeaveTime();

            for (TrainStationInfo trainStationInfo : trainStationInfos) {
                int startStationId = trainStationInfo.getArriveSid();
                Date leaveTime = trainStationInfo.getLeaveTime();

                mapStationRepository.saveDayDifFromStart(startStationId, trainTag, getDayDif(startTime, leaveTime));
            }
        }
    }
}
