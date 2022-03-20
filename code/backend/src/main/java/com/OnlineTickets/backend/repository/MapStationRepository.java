package com.OnlineTickets.backend.repository;

import com.OnlineTickets.backend.entity.MapStation;
import org.neo4j.driver.internal.value.ListValue;
import org.neo4j.driver.internal.value.PathValue;
import org.springframework.data.neo4j.repository.Neo4jRepository;
import org.springframework.data.neo4j.repository.query.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface MapStationRepository extends Neo4jRepository<MapStation, Long> {
    @Query("match (s1:Station {id: $startId}), (s2:Station {id: $endId})\n" +
            "create (s1) -[s3:Line {trainTag: $trainTag, startHour: $startHour, startMinute: $startMinute,\n" +
            "endHour: $endHour, endMinute: $endMinute, dayDif: $dayDif}]-> (s2)")
    void saveLineNode(@Param("startId") int startId, @Param("endId") int endId, @Param("trainTag") String trainTag,
                      @Param("startHour") int startHour, @Param("startMinute") int startMinute,
                      @Param("endHour") int endHour, @Param("endMinute") int endMinute, @Param("dayDif") int dayDif);

    @Query("match ()-[r]->() set r.travelMinute=(r.endHour-r.startHour)*60 + r.endMinute-r.startMinute + r.dayDif*1440")
    void saveTravelMinute();

    @Query("match (s:Station {id: $startId}) -[r:Line {trainTag: $trainTag}]-> () set r.dayDifFromStart = $dayDif")
    void saveDayDifFromStart(@Param("startId") int startId, @Param("trainTag") String trainTag, @Param("dayDif") int dayDif);

    @Query("match p = (startStation:Station) -[firstLine:Line]-> (transitStation:Station) -[secondLine:Line]-> (endStation:Station) " +
            "where startStation.name =~ ('.*' + $startStationName + '.*') and endStation.name =~ ('.*' + $endStationName + '.*') and firstLine.trainTag <> secondLine.trainTag " +
            "with p, (secondLine.startHour - firstLine.endHour) * 60 + secondLine.startMinute - firstLine.endMinute as stopTime, " +
            "firstLine.travelMinute + secondLine.travelMinute as travelTime, firstLine.dayDif - secondLine.dayDifFromStart as dif1, -firstLine.dayDifFromStart as dif2 " +
            "with p, case when stopTime > 0 then {stopTime: stopTime, allTime: stopTime+travelTime, dayDif1: dif2, dayDif2: dif1} else {stopTime: stopTime + 1440, allTime: stopTime+travelTime+1440, dayDif1: dif2, dayDif2: dif1+1} end as a " +
            "where a.stopTime >= $minStopMinute and a.stopTime <= $maxStopMinute " +
            "return [p, a.dayDif1, a.dayDif2] ORDER BY a.allTime ")
    List<ListValue> getOneTransitWithOrder(@Param("startStationName") String startStationName, @Param("endStationName") String endStationName,
                                  @Param("minStopMinute") int minStopMinute, @Param("maxStopMinute") int maxStopMinute);

    @Query("match p = (startStation:Station) -[firstLine:Line]-> (transitStation:Station) -[secondLine:Line]-> (endStation:Station) " +
            "where startStation.name =~ ('.*' + $startStationName + '.*') and endStation.name =~ ('.*' + $endStationName + '.*') " +
            "and firstLine.trainTag <> secondLine.trainTag return p" )
    List<PathValue> getOneTransitWithoutOrder(@Param("startStationName") String startStationName, @Param("endStationName") String endStationName);

}
