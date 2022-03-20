package com.OnlineTickets.backend.entity;

import lombok.Data;
import org.springframework.data.neo4j.core.schema.*;

import java.util.List;
import java.util.Map;


@Data
@Node(value = "Station")
public class MapStation {
    @Id
    @GeneratedValue
    private Long identity;

    @Property(name = "id")
    private int stationId;

    @Property(name = "name")
    private String stationName;

    @Property(name = "shortName")
    private String shortName;

    @Property(name = "cityId")
    private int cityId;

    @Relationship(value = "Line", direction = Relationship.Direction.OUTGOING)
    private List<MapLine> outGoings;

    @Relationship(value = "Line", direction = Relationship.Direction.INCOMING)
    private List<MapLine> inComings;

    private MapLine pathLine;//下一条边

    public MapStation(){}

    public MapStation(Station s){
        stationId = s.getStationId();
        stationName = s.getStationName();
        shortName = s.getShortName();
        cityId = s.getCityId();
    }

    public MapStation(Long identity, Map<String, Object> map){
        this.identity = identity;
        stationId = ((Long) map.get("id")).intValue();
        stationName = (String) map.get("name");
        shortName = (String) map.get("shortName");
        cityId = ((Long) map.get("cityId")).intValue();
    }
}
