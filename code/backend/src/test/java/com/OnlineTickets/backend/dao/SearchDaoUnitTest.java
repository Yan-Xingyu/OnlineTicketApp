package com.OnlineTickets.backend.dao;

import com.OnlineTickets.backend.constant.TrainConstants;
import com.OnlineTickets.backend.daoimpl.SearchDaoImpl;
import com.OnlineTickets.backend.entity.Station;
import com.OnlineTickets.backend.entity.TrainInfo;
import com.OnlineTickets.backend.repository.MapStationRepository;
import com.OnlineTickets.backend.repository.StationRepository;
import com.OnlineTickets.backend.repository.TrainInfoRepository;
import com.OnlineTickets.backend.repository.TrainStationInfoRepository;
import com.OnlineTickets.backend.utils.Message;
import com.alibaba.fastjson.JSONObject;
import org.junit.Before;
import org.junit.Test;
import org.junit.jupiter.api.Assertions;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.MockitoAnnotations;

import java.util.*;

import static com.OnlineTickets.backend.utils.BitSetConvert.bitSet2ByteArray;


public class SearchDaoUnitTest {
    @Mock
    private TrainInfoRepository trainInfoRepository;

    @Mock
    private TrainStationInfoRepository trainStationInfoRepository;

    @Mock
    private StationRepository stationRepository;

    @Mock
    private MapStationRepository mapStationRepository;

    @InjectMocks
    private SearchDaoImpl searchDao;

    @Before
    public void setUp() throws Exception{
        MockitoAnnotations.initMocks(this);

        //test searchTimeTableInfoByTag
        Mockito.when(trainInfoRepository.getTrainIdByTagOnly("1")).thenReturn(new ArrayList<>());
        Mockito.when(trainInfoRepository.getTrainIdByTagOnly("G11")).thenReturn(Arrays.asList(1, 2, 3));
        Mockito.when(trainInfoRepository.getTrainIdByTag(new Date(2021, 8, 5), new Date(2021, 8, 6), "G11")).thenReturn(null);
        Mockito.when(trainInfoRepository.getTrainIdByTag(new Date(2021, 8, 6), new Date(2021, 8, 7), "G11")).thenReturn(3);
        Mockito.when(trainInfoRepository.getTrainIdByTag(new Date(2021, 8, 4), new Date(2021, 8, 5), "G11")).thenReturn(1);
        Mockito.when(trainStationInfoRepository.getTimeTableByTrainId(3)).thenReturn(new ArrayList<>());
        Mockito.when(trainStationInfoRepository.getTimeTableByTrainId(1)).thenReturn(Arrays.asList(new net.sf.json.JSONObject()));

        //test CityToStations
        Mockito.when(stationRepository.cityToStations("北京")).thenReturn(Arrays.asList(1,2));

        //test cityIdToStations
        Mockito.when(stationRepository.cityIdToStations(1)).thenReturn(Arrays.asList("G123"));

        //test GetStationById
        Mockito.when(stationRepository.getById(1)).thenReturn(new Station());

        //test GetTrains
        Mockito.when(trainStationInfoRepository.fuzzyQuery(new Date(2021,8,5), new Date(2021,8,6),1,2))
                .thenReturn(Arrays.asList(new HashMap<>()));

        //test GetTrainsCityToStation
        Mockito.when(trainStationInfoRepository.fuzzyQueryCityToStation(new Date(2021,8,5), new Date(2021,8,6),1,2))
                .thenReturn(Arrays.asList(new HashMap<>()));

        //test GetTrainsStationToCity
        Mockito.when(trainStationInfoRepository.fuzzyQueryStationToCity(new Date(2021,8,5), new Date(2021,8,6),1,2))
                .thenReturn(Arrays.asList(new HashMap<>()));

        //test GetTrainsStationToStation
        Mockito.when(trainStationInfoRepository.fuzzyQueryStationToStation(new Date(2021,8,5), new Date(2021,8,6),1,2))
                .thenReturn(Arrays.asList(new HashMap<>()));

        //test GetTrainInfo
        Mockito.when(trainInfoRepository.getById(1)).thenReturn(new TrainInfo());

        //test GetStations
        Mockito.when(stationRepository.getStationNameByCity("北京")).thenReturn(Arrays.asList("北京南","北京西"));

        Mockito.when(stationRepository.getCityIdByStationName("北京")).thenReturn(1);

        Mockito.when(mapStationRepository.getOneTransitWithoutOrder("北京", "上海")).thenReturn(new ArrayList<>());

        Mockito.when(mapStationRepository.getOneTransitWithOrder("北京", "上海", 20, 60)).thenReturn(new ArrayList<>());

        Mockito.when(trainInfoRepository.getTrainInfoByTag("G123", new Date(2021,8,5), new Date(2021,8,6))).thenReturn(null);

        Mockito.when(trainInfoRepository.getTrainInfoByTagAndStartDate("G123", new Date(2021,8,5))).thenReturn(new ArrayList<>());

        Mockito.when(stationRepository.getCityIdByCity("北京")).thenReturn(1);

        Mockito.when(trainStationInfoRepository.getPassByStation(new Date(2021,8,5), new Date(2021,8,6), 1, 2, 20, 60)).thenReturn(new ArrayList<>());
    }

    @Test
    public void testSearchTimeTableInfoByTag() throws Exception{
        Message expect1 = Message.createMessage(TrainConstants.INVALID_TRAIN_NO, "车次号无效");
        Assertions.assertEquals(JSONObject.toJSON(expect1), JSONObject.toJSON(searchDao.searchTimeTableInfoByTag(new Date(2021, 8, 5), "1")));

        Message expect2 = Message.createMessage(TrainConstants.NO_TRAIN_RUNNING, "该车次未运行");
        Assertions.assertEquals(JSONObject.toJSON(expect2), JSONObject.toJSON(searchDao.searchTimeTableInfoByTag(new Date(2021, 8, 5), "G11")));

        Assertions.assertEquals(JSONObject.toJSON(expect2), JSONObject.toJSON(searchDao.searchTimeTableInfoByTag(new Date(2021, 8, 6), "G11")));

        net.sf.json.JSONObject obj = new net.sf.json.JSONObject();
        obj.put("trainId", 1);
        obj.put("data", Arrays.asList(new net.sf.json.JSONObject()));
        Message expect3 = Message.createMessage(TrainConstants.GET_TIMELINE_SUCCESS, "查询成功", obj);
        Assertions.assertEquals(JSONObject.toJSON(expect3), JSONObject.toJSON(searchDao.searchTimeTableInfoByTag(new Date(2021, 8, 4), "G11")));
    }

    @Test
    public void testCityToStations(){
        Assertions.assertEquals(Arrays.asList(1,2), searchDao.cityToStations("北京"));
    }

    @Test
    public void testCityIdToStations(){
        Assertions.assertEquals(Arrays.asList("G123"), searchDao.cityIdToStations(1));
    }

    @Test
    public void testGetStationById(){
        Station station = new Station();
        Assertions.assertEquals(JSONObject.toJSON(station), JSONObject.toJSON(searchDao.getStationById(1)));
    }

    @Test
    public void testGetTrains(){
        Assertions.assertEquals(Arrays.asList(new HashMap<>()),
                searchDao.getTrains(new Date(2021,8,5),1,2));
    }

    @Test
    public void testGetTrainsCityToStation(){
        Assertions.assertEquals(Arrays.asList(new HashMap<>()),
                searchDao.getTrainsCityToStation(new Date(2021,8,5),1,2));
    }

    @Test
    public void testGetTrainsStationToCity(){
        Assertions.assertEquals(Arrays.asList(new HashMap<>()),
                searchDao.getTrainsStationToCity(new Date(2021,8,5),1,2));
    }

    @Test
    public void testGetTrainsStationToStation(){
        Assertions.assertEquals(Arrays.asList(new HashMap<>()),
                searchDao.getTrainsStationToStation(new Date(2021,8,5),1,2));
    }

    @Test
    public void testGetTrainInfo(){
        Assertions.assertEquals(JSONObject.toJSON(new TrainInfo()),
                JSONObject.toJSON(searchDao.getTrainInfo(1)));
    }

    @Test
    public void testGetStations(){
        Assertions.assertEquals(Arrays.asList("北京南","北京西"),
                searchDao.getStations("北京"));
    }

    @Test
    public void testUpdateBits(){
        searchDao.updateBits(0, new BitSet(480), 1);
        Mockito.verify(trainStationInfoRepository).updateFirstSeatBits(bitSet2ByteArray(new BitSet(480)), 1);

        searchDao.updateBits(1, new BitSet(480), 1);
        Mockito.verify(trainStationInfoRepository).updateHardLieBits(bitSet2ByteArray(new BitSet(480)), 1);

        searchDao.updateBits(2, new BitSet(480), 1);
        Mockito.verify(trainStationInfoRepository).updateSecondSeatBits(bitSet2ByteArray(new BitSet(480)), 1);

        searchDao.updateBits(3, new BitSet(480), 1);
        Mockito.verify(trainStationInfoRepository).updateSoftLieBits(bitSet2ByteArray(new BitSet(480)), 1);

        searchDao.updateBits(4, new BitSet(480), 1);
        Mockito.verify(trainStationInfoRepository).updateStandSeatBits(bitSet2ByteArray(new BitSet(480)), 1);

        searchDao.updateBits(5, new BitSet(480), 1);
        Mockito.verify(trainStationInfoRepository).updateVipSeatBits(bitSet2ByteArray(new BitSet(480)), 1);
    }

    @Test
    public void testGetCityByName(){
        Assertions.assertEquals(1, searchDao.getCityByName("北京"));
    }

    @Test
    public void testGetOneTransitSortByJava(){
        Assertions.assertNull(searchDao.getOneTransitSortByJava("北京", "上海", 20, 60, 15));
    }

    @Test
    public void testGetOneTransitSortByNeo4j(){
        Assertions.assertNull(searchDao.getOneTransitSortByNeo4j("北京", "上海", 20, 60, 15));
    }

    @Test
    public void testGetTrainInfoByTag(){
        Assertions.assertNull(searchDao.getTrainInfoByTag("G123", new Date(2021,8,5)));
    }

    @Test
    public void testGetTrainInfoByTagAndEndDate(){
        Assertions.assertEquals(new ArrayList<>(), searchDao.getTrainInfoByTagAndEndDate("G123", new Date(2021,8,5)));
    }

    @Test
    public void testGetCityIdByCity(){
        Assertions.assertEquals(1, searchDao.getCityIdByCity("北京"));
    }

    @Test
    public void testGetPassByStation(){
        Assertions.assertEquals(new ArrayList<>(), searchDao.getPassByStation(new Date(2021,8,5), 1, 2, 20, 60));
    }

    @Test
    public void testAddDate(){
        Assertions.assertEquals(new Date(2021,8,6), searchDao.addDate(new Date(2021,8,5)));
        Assertions.assertEquals(new Date(2021,8,6), searchDao.addDate(new Date(2021,8,5), 1));
    }
}

