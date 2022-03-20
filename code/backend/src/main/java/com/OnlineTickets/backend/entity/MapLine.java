package com.OnlineTickets.backend.entity;

import lombok.Data;
import org.springframework.data.neo4j.core.schema.*;

import java.util.Map;

@Data
@RelationshipProperties
public class MapLine {
    @Id
    @GeneratedValue
    private Long identity;

    @Property(name = "trainTag")
    private String trainTag;

    @Property(name = "startHour")
    private int startHour;

    @Property(name = "startMinute")
    private int startMinute;

    @Property(name = "endHour")
    private int endHour;

    @Property(name = "endMinute")
    private int endMinute;

    @Property(name = "dayDif")
    private int dayDif;

    @Property(name = "dayDifFromStart")
    private int dayDifFromStart;

    @Property(name = "travelMinute")
    private int travelMinute;

    @TargetNode
    private MapStation endStation;

    public MapLine(){}

    public MapLine(String trainTag, int startHour, int startMinute, int endHour, int endMinute, int dayDif, int travelMinute){
        this.trainTag = trainTag;
        this.startHour = startHour;
        this.startMinute = startMinute;
        this.endHour = endHour;
        this.endMinute = endMinute;
        this.dayDif = dayDif;
        this.travelMinute = travelMinute;
    }

    public MapLine(Long identity, Map<String, Object> map){
        this.identity = identity;
        trainTag = (String) map.get("trainTag");
        startHour = ((Long) map.get("startHour")).intValue();
        startMinute = ((Long) map.get("startMinute")).intValue();
        endHour = ((Long) map.get("endHour")).intValue();
        endMinute = ((Long) map.get("endHour")).intValue();
        dayDif = ((Long) map.get("dayDif")).intValue();
        travelMinute = ((Long) map.get("travelMinute")).intValue();
        dayDifFromStart = ((Long) map.get("dayDifFromStart")).intValue();
    }

    public MapLine(Map<String, Object> map){
        trainTag = (String) map.get("trainTag");
        startHour = ((Long) map.get("startHour")).intValue();
        startMinute = ((Long) map.get("startMinute")).intValue();
        endHour = ((Long) map.get("endHour")).intValue();
        endMinute = ((Long) map.get("endMinute")).intValue();
        dayDif = ((Long) map.get("dayDif")).intValue();
        travelMinute = ((Long) map.get("travelMinute")).intValue();
        dayDifFromStart = ((Long) map.get("dayDifFromStart")).intValue();
    }

    public String toString(){
        return "--[" + startHour + ':' + startMinute + '-' + trainTag + '-' + endHour + ':' + endMinute + "]--";
    }
}
