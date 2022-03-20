package com.OnlineTickets.backend.utils;

import com.OnlineTickets.backend.entity.MapLine;
import com.OnlineTickets.backend.entity.MapStation;
import lombok.Data;
import org.neo4j.driver.internal.value.ListValue;
import org.neo4j.driver.internal.value.PathValue;
import org.neo4j.driver.types.Entity;
import org.neo4j.driver.types.Node;
import org.neo4j.driver.types.Path;
import org.neo4j.driver.types.Relationship;

import java.util.*;

@Data
public class MapPath {

    private int dayDifOfFirstLine;
    private int dayDifOfSecondLine;
    private MapStation startStation;

    public MapPath(int dayDifOfFirstLine, int dayDifOfSecondLine, MapStation mapStation){
        this.dayDifOfFirstLine = dayDifOfFirstLine;
        this.dayDifOfSecondLine = dayDifOfSecondLine;
        startStation = mapStation;
    }

    public String toString(){
        MapLine firstLine = startStation.getPathLine();
        MapStation transitStation = firstLine.getEndStation();
        MapLine secondLine = transitStation.getPathLine();
        MapStation endStation = secondLine.getEndStation();

        return startStation.getStationName() + firstLine + transitStation.getStationName() + secondLine + endStation.getStationName();
    }

    static private MapStation parsePathValue(Path segments){
        Iterable<Node> nodes = segments.nodes();
        Iterable<Relationship> relationships = segments.relationships();

        List<MapStation> mapStations = new ArrayList<>();
        List<MapLine> mapLines = new ArrayList<>();

        nodes.forEach(node -> mapStations.add(new MapStation(node.id(), node.asMap())));

        relationships.forEach(relationship -> mapLines.add(new MapLine(relationship.id(), relationship.asMap())));

        for(int i = mapLines.size() - 1; i >= 0; --i){
            mapLines.get(i).setEndStation(mapStations.get(i + 1));
            mapStations.get(i).setPathLine(mapLines.get(i));
        }

        return mapStations.get(0);
    }

    static public List<MapPath> getOneTransitSortByNeo4j(int searchNo, List<ListValue> results){
        if(results.isEmpty())
            return null;

        List<MapPath> mapPathList = new ArrayList<>();

        for (ListValue result: results){
            mapPathList.add(new MapPath(result.get(1).asInt(), result.get(2).asInt(), parsePathValue(result.get(0).asPath())));
            --searchNo;
            if(searchNo == 0)
                break;
        }

        return mapPathList;
    }


    static public List<MapPath> getOneTransitSortByJava(int minStopTime, int maxStopTime, int searchNo, List<PathValue> results){
        if (results.isEmpty()){
            return null;
        }

        Map<Integer, List<List<Object>>> orderedPath = new TreeMap<>();

        for (PathValue pathValue: results) {
            Path segments = pathValue.asPath();
            Iterator<Relationship> relationships = segments.relationships().iterator();

            MapLine firstLine = new MapLine(relationships.next().asMap());
            MapLine secondLine = new MapLine(relationships.next().asMap());

            int stopTime = (secondLine.getStartHour() - firstLine.getEndHour()) * 60 + secondLine.getStartMinute() - firstLine.getEndMinute();
            int dayDif = 0;

            if(stopTime < 0) {
                stopTime += 1440;
                dayDif = 1;
            }

            if (stopTime >= minStopTime && stopTime <= maxStopTime) {

                int dayDifOfFirstLine = -firstLine.getDayDifFromStart();
                int dayDifOfSecondLine =  dayDif + firstLine.getDayDif() - secondLine.getDayDifFromStart();
                List<Object> objects = Arrays.asList(dayDifOfFirstLine, dayDifOfSecondLine, segments);
                Integer key = firstLine.getTravelMinute() + stopTime + secondLine.getTravelMinute();

                if(orderedPath.containsKey(key)){
                    orderedPath.get(key).add(objects);
                }
                else {
                    List<List<Object>> list = new ArrayList<>();
                    list.add(objects);
                    orderedPath.put(key, list);
                }
            }
        }

        Iterator<Map.Entry<Integer, List<List<Object>>>> iterator = orderedPath.entrySet().iterator();

        List<MapPath> mapPathList = new ArrayList<>();

        while(searchNo > 0 && iterator.hasNext()){
            List<List<Object>> objs = iterator.next().getValue();

            for(List<Object> obj: objs){
                mapPathList.add(new MapPath((Integer) obj.get(0), (Integer) obj.get(1), parsePathValue((Path) obj.get(2))));
                --searchNo;
                if (searchNo == 0){
                    break;
                }
            }
        }

        return mapPathList;
    }
}
