package com.OnlineTickets.backend.repository;

import com.OnlineTickets.backend.entity.Station;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface StationRepository extends JpaRepository<Station, Integer> {

    @Query(value="SELECT station_id from station WHERE  station_name like concat('%',?1,'%')",nativeQuery = true)
    List<Integer> cityToStations(String keyWord);

    @Query(value="SELECT station_name from station WHERE  city_id=?1",nativeQuery = true)
    List<String> cityIdToStations(Integer keyWord);

    @Query(value="SELECT station_name from station WHERE  station_name like concat('%',?1,'%')",nativeQuery = true)
    List<String> getStationNameByCity(String keyWord);

    @Query(value="SELECT city_id from station WHERE  station_name =?1",nativeQuery = true)
    Integer getCityIdByStationName(String station);

    @Query(value="SELECT city_id from station  WHERE  station_name like concat('%',?1,'%') group by city_id",nativeQuery = true)
    Integer getCityIdByCity(String station);
}
