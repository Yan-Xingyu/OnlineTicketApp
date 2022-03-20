package com.OnlineTickets.backend.repository;

import com.OnlineTickets.backend.entity.TrainInfo;
import com.OnlineTickets.backend.entity.TrainStationInfo;


import net.sf.json.JSONObject;
import org.springframework.data.jpa.repository.EntityGraph;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import javax.persistence.criteria.CriteriaBuilder;
import java.util.Date;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;

public interface TrainStationInfoRepository extends JpaRepository<TrainStationInfo, Integer> {


    @Query(value = "SELECT tab1.train_id as train_id,tab1.arrive_time as start_time,tab2.arrive_time as end_time  FROM (SELECT *  FROM train_stationinfo WHERE arrive_sid=?3 AND arrive_time>?1 AND arrive_time<?2" +
            "\n" +
            ") AS tab1 INNER JOIN (SELECT * FROM train_stationinfo WHERE arrive_sid=?4 AND arrive_time>?1 ) AS  tab2 on tab1.train_id=tab2.train_id ",nativeQuery = true)
    List<Map<String, Object>> searchByStation(Date date,Date nextDate,Integer start,Integer end);

    @Query(value = "SELECT *  FROM train_stationinfo WHERE arrive_sid=?3 AND arrive_time>?1 AND arrive_time<?2",nativeQuery = true)
    List<Map<String, Object>> testAddDate(Date date,Date nextDate,Integer start,Integer end);

    @Query(value = "FROM TrainInfo ti WHERE ti.trainId in ?1")
    @EntityGraph(value = "TrainInfo.Graph", type = EntityGraph.EntityGraphType.FETCH)
    List<TrainInfo> getTrain(List<Integer> trainId);

    @Query(value="(SELECT tab1.train_id FROM" +
            "(SELECT train_id,station_no FROM train_stationinfo WHERE arrive_sid in ?3 AND arrive_time>?1 AND arrive_time<?2) AS tab1 JOIN"+
            "(SELECT train_id,station_no FROM train_stationinfo WHERE arrive_sid in ?4 AND arrive_time>?1 ) AS  tab2 on (tab1.train_id=tab2.train_id and tab1.station_no<tab2.station_no))",
            nativeQuery = true)
    List<Integer> getTrainId(Date date, Date nextDate, List<Integer> start, List<Integer> end);

    @Query(value = " SELECT tab1.train_id as train_id,tab1.station_no as start_no ,tab2.station_no as end_no FROM (SELECT train_id,arrive_time,station_no  FROM train_stationinfo WHERE arrive_cid=?3 AND arrive_time>?1 AND arrive_time<?2\n" +
            ") AS tab1  JOIN (SELECT train_id,arrive_time,station_no FROM train_stationinfo WHERE arrive_cid=?4 AND arrive_time>?1 ) AS  tab2 on tab1.train_id=tab2.train_id AND tab1.station_no<tab2.station_no;" ,
            nativeQuery = true)
    List<Map<String, Object>> fuzzyQuery(Date date,Date nextDate,Integer start,Integer end);


    @Query(value = " SELECT tab1.train_id as train_id,tab1.station_no as start_no ,tab2.station_no as end_no FROM (SELECT train_id,arrive_time,station_no FROM train_stationinfo WHERE arrive_cid=?3 AND arrive_time>?1 AND arrive_time<?2\n" +
            ") AS tab1  JOIN (SELECT train_id,arrive_time,station_no FROM train_stationinfo WHERE arrive_sid = ?4 AND arrive_time>?1 ) AS  tab2 on tab1.train_id=tab2.train_id AND tab1.station_no<tab2.station_no;" ,
            nativeQuery = true)
    List<Map<String, Object>> fuzzyQueryCityToStation(Date date,Date nextDate,Integer start,Integer end);

    @Query(value = " SELECT tab1.train_id as train_id,tab1.station_no as start_no ,tab2.station_no as end_no FROM (SELECT train_id,arrive_time,station_no FROM train_stationinfo WHERE arrive_sid = ?3 AND arrive_time>?1 AND arrive_time<?2\n" +
            ") AS tab1  JOIN (SELECT train_id,arrive_time,station_no FROM train_stationinfo WHERE arrive_cid = ?4 AND arrive_time>?1 ) AS  tab2 on tab1.train_id=tab2.train_id AND tab1.station_no<tab2.station_no;" ,
            nativeQuery = true)
    List<Map<String, Object>> fuzzyQueryStationToCity(Date date,Date nextDate,Integer start,Integer end);

    @Query(value = "SELECT tab1.train_id as train_id,tab1.station_no as start_no ,tab2.station_no as end_no FROM (SELECT train_id,arrive_time,station_no FROM train_stationinfo WHERE arrive_sid = ?3 AND arrive_time>?1 AND arrive_time<?2\n" +
            ") AS tab1  JOIN (SELECT train_id,arrive_time,station_no FROM train_stationinfo WHERE arrive_sid = ?4 AND arrive_time>?1 ) AS  tab2 on tab1.train_id=tab2.train_id AND tab1.station_no<tab2.station_no;" ,
            nativeQuery = true)
    List<Map<String, Object>> fuzzyQueryStationToStation(Date date,Date nextDate,Integer start,Integer end);


    @Query(value="(SELECT tab1.train_id FROM" +
            "(SELECT train_id,station_no FROM train_stationinfo WHERE arrive_cid = ?3 AND arrive_time>?1 AND arrive_time<?2) AS tab1 inner JOIN"+
            "(SELECT train_id,station_no FROM train_stationinfo WHERE arrive_cid = ?4 AND arrive_time>?1 ) AS  tab2 on (tab1.train_id=tab2.train_id and tab1.station_no<tab2.station_no))",
            nativeQuery = true)
    List<Integer> getTrainIdByCity(Date date, Date nextDate, Integer start, Integer end);

    @Modifying
    @Query(value = "UPDATE TrainStationInfo t SET t.firstSeatBits =?1 WHERE t.id=?2")
    void updateFirstSeatBits(byte[] bits,Integer id);

    @Modifying
    @Query(value = "UPDATE TrainStationInfo t SET t.hardLieBits =?1 WHERE t.id=?2")
    void updateHardLieBits(byte[] bits,Integer id);

    @Modifying
    @Query(value = "UPDATE TrainStationInfo t SET t.secondSeatBits =?1 WHERE t.id=?2")
    void updateSecondSeatBits(byte[] bits,Integer id);

    @Modifying
    @Query(value = "UPDATE TrainStationInfo t SET t.softLieBits =?1 WHERE t.id=?2")
    void updateSoftLieBits(byte[] bits,Integer id);

    @Modifying
    @Query(value = "UPDATE TrainStationInfo t SET t.standSeatBits =?1 WHERE t.id=?2")
    void updateStandSeatBits(byte[] bits,Integer id);

    @Modifying
    @Query(value = "UPDATE TrainStationInfo t SET t.vipSeatBits =?1 WHERE t.id=?2")
    void updateVipSeatBits(byte[] bits,Integer id);

    @Query(value = "select arrive_time, leave_time, stop_time, station_name, station_no from train_stationinfo where train_id = ?1 order by station_no", nativeQuery = true)
    List<JSONObject> getTimeTableByTrainId(Integer trainId);

    @Query(value = "select * from train_stationinfo where train_id = ?1 order by station_no", nativeQuery = true)
    List<TrainStationInfo> getTimeLineByTrainId(int trainId);

    @Query(value = "select tab1.train_id as start_train_id,tab2.train_id as end_train_id,tab1.arrive_sid as pass_station from\n" +
            "(select train_id,arrive_time,arrive_sid from train_stationinfo where( train_id in (select train_id from train_stationinfo where  (arrive_cid = ?3 AND arrive_time>?1 AND arrive_time<?2)))) AS tab1  JOIN\n" +
            "(select train_id,arrive_time,arrive_sid from train_stationinfo where( train_id in (select train_id from train_stationinfo where  arrive_cid = ?4 AND arrive_time>?1))) AS tab2 " +
            "on(tab1.arrive_sid=tab2.arrive_sid and tab1.arrive_sid!=1 " +
            "AND timestampdiff(minute,tab1.arrive_time,tab2.arrive_time)>?6 AND timestampdiff(minute,tab1.arrive_time,tab2.arrive_time)<?5 AND tab1.arrive_time>?1 AND tab2.arrive_time>?1) " +
            ";\n",nativeQuery = true)
    List<Map<String, Object>> getPassByStation(Date date,Date nextDate,Integer startCityId,Integer endCityId,Integer maxWaitTime,Integer minWaitTime);
}
