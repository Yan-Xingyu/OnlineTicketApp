package com.OnlineTickets.backend.repository;
import org.hamcrest.Matchers;
import org.junit.Assert;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;
import java.util.List;
import java.util.Map;

@DataJpaTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)

@Transactional
public class TrainStationInfoRepositoryUnitTest {

    @Autowired
    private  TrainStationInfoRepository trainStationInfoRepository;

    @Test
    public void testFuzzyQuery(){
        Date start = new Date(2021,8,4);
        Date next = new Date(2021,8,5);
        List<Map<String, Object>> ret =  trainStationInfoRepository.fuzzyQuery(start,next,1,15);
        ret=trainStationInfoRepository.fuzzyQueryCityToStation(start,next,1,15);
    }




}
