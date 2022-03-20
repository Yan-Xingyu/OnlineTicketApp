package com.OnlineTickets.backend.repository;

import com.OnlineTickets.backend.entity.TrainInfo;
import net.sf.json.JSONObject;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Date;
import java.util.List;

public interface TrainInfoRepository extends JpaRepository<TrainInfo, Integer> {
    @Query(value = "select train_id from train_info where start_date > ?1 and start_date < ?2 and train_tag = ?3" ,nativeQuery = true)
    Integer getTrainIdByTag(Date date, Date nextDate, String trainTag);

    @Query(value = "select train_id from train_info where train_tag = ?1", nativeQuery = true)
    List<Integer> getTrainIdByTagOnly(String trainTag);

    @Query(value = "select train_tag, min(train_id) as train_id from train_info group by train_tag", nativeQuery = true)
    List<JSONObject> getMinTrainGroupByTrainTag();

    @Query(value = "from TrainInfo where trainTag=?1 and startDate<?3 and startDate>?2")
    TrainInfo getTrainInfoByTag(String trainTag,Date startDate,Date nextDate);

    @Query(value = "from TrainInfo where trainTag=?1 AND endDate>?2")
    List<TrainInfo> getTrainInfoByTagAndStartDate(String trainTag,Date startDate);

}
