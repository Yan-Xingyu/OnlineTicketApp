package com.OnlineTickets.backend.repository;

import org.junit.Test;
import org.junit.jupiter.api.Assertions;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import java.util.Date;

@DataJpaTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
public class TrainInfoRepositoryUnitTest {
    @Autowired
    private TrainInfoRepository trainInfoRepository;

    @Test
    public void testGetTrainIdByTag(){
        Assertions.assertEquals(1,
                trainInfoRepository.getTrainIdByTag(new Date(2021,8,5), new Date(2021,8,6), "G1"));
    }
}
