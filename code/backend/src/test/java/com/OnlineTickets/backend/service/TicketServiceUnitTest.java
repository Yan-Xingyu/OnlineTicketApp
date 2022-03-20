package com.OnlineTickets.backend.service;

import com.OnlineTickets.backend.dao.SearchDao;
import com.OnlineTickets.backend.entity.*;
import com.OnlineTickets.backend.serviceimpl.TicketServiceImpl;
import com.OnlineTickets.backend.utils.BitSetConvert;
import com.OnlineTickets.backend.utils.MapPath;
import com.OnlineTickets.backend.utils.Message;
import net.sf.json.JSONArray;
import net.sf.json.JSONObject;
import org.hamcrest.Matchers;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.MockitoAnnotations;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;

public class TicketServiceUnitTest {
    @Mock
    private SearchDao searchDao;

    @InjectMocks
    private TicketServiceImpl ticketService;

    @Before
    public void setUp() throws Exception{
        // 对所有注解了@Mock的对象进行模拟
        MockitoAnnotations.initMocks(this);
        Mockito.when(searchDao.cityToStations("火星")).thenReturn(new ArrayList<>());
        Mockito.when(searchDao.cityToStations("月球")).thenReturn(new ArrayList<>());
        Mockito.when(searchDao.cityToStations("上海")).thenReturn(Arrays.asList(13,15));
        Mockito.when(searchDao.cityToStations("北京")).thenReturn(Arrays.asList(4,5));
        Mockito.when(searchDao.cityToStations("上海虹桥")).thenReturn(Arrays.asList(15));
        Mockito.when(searchDao.cityToStations("北京南")).thenReturn(Arrays.asList(5));
        Mockito.when(searchDao.cityIdToStations(1)).thenReturn(Arrays.asList("北京","北京南"));
        Mockito.when(searchDao.cityIdToStations(4)).thenReturn(Arrays.asList("上海","上海虹桥"));
        Mockito.when(searchDao.getStationById(13)).thenReturn(new Station(13,"上海","sha",4));
        Mockito.when(searchDao.getStationById(15)).thenReturn(new Station(15,"上海虹桥","shq",4));
        Mockito.when(searchDao.getStationById(4)).thenReturn(new Station(4,"北京","bji",1));
        Mockito.when(searchDao.getStationById(5)).thenReturn(new Station(5,"北京南","bjn",1));
        Mockito.when(searchDao.getCityByName("上海虹桥")).thenReturn(4);
        Mockito.when(searchDao.getCityByName("北京南")).thenReturn(1);
        Date date = new Date(51,7,3);
        List<Map<String,Object>> ret1 = new ArrayList<>();
        Map<String,Object> tmp =  new HashMap<String, Object>() {
            {
                put("train_id",68688);// 上海虹桥北京
                put("start_no",1);
                put("end_no",2);
            }
        };
        ret1.add(tmp);
        tmp = new HashMap<String, Object>() {
            {
                put("train_id",69027);//上海北京南
                put("start_no",1);
                put("end_no",2);
            }
        };
        ret1.add(tmp);
        tmp = new HashMap<String, Object>() {
            {
                put("train_id",44444); // 上海虹桥北京南
                put("start_no",1);
                put("end_no",2);
            }
        };
        ret1.add(tmp);
        List<Map<String,Object>> ret2 = new ArrayList<>();
        tmp = new HashMap<String, Object>() {
            {
                put("train_id",69027);//上海 到北京南
                put("start_no",1);
                put("end_no",2);
            }
        };
        ret2.add(tmp);
        tmp = new HashMap<String, Object>() {
            {
                put("train_id",44444); // 上海虹桥北京南
                put("start_no",1);
                put("end_no",2);
            }
        };
        ret2.add(tmp);
        List<Map<String,Object>> ret3 = new ArrayList<>();

        tmp = new HashMap<String, Object>() {
            {
                put("train_id",68688); // 上海虹桥北京
                put("start_no",1);
                put("end_no",2);
            }
        };
        ret3.add(tmp);
        tmp = new HashMap<String, Object>() {
            {
                put("train_id",44444); // 上海虹桥北京南
                put("start_no",1);
                put("end_no",2);
            }
        };
        ret3.add(tmp);
        List<Map<String,Object>> ret4 = new ArrayList<>();

        tmp = new HashMap<String, Object>() {
            {
                put("train_id",44444); // 上海虹桥北京南
                put("start_no",1);
                put("end_no",2);
            }
        };
        ret4.add(tmp);
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        Set<TrainStationInfo> trainStationInfoSet = new HashSet<>();
        TrainStationInfo trainStationInfo = new TrainStationInfo();
        trainStationInfo.setStationNo(1);
        trainStationInfo.setStationName("上海虹桥");
        trainStationInfo.setArriveCid(4);
        trainStationInfo.setArriveSid(15);
        trainStationInfo.setId(1);
        trainStationInfo.setArriveTime(sdf.parse("2021-08-03 07:00:00"));
        trainStationInfo.setTrainId(68688);
        trainStationInfo.setFirstSeatBits(new BitSet(480).toByteArray());
        trainStationInfo.setSecondSeatBits(new BitSet(336).toByteArray());
        trainStationInfo.setVipSeatBits(new BitSet(216).toByteArray());
        trainStationInfo.setStandSeatBits(new BitSet(80).toByteArray());
        trainStationInfoSet.add(trainStationInfo);


        TrainStationInfo trainStationInfo2 = new TrainStationInfo();

        trainStationInfo2.setStationNo(2);
        trainStationInfo2.setStationName("北京");
        trainStationInfo2.setArriveCid(1);
        trainStationInfo2.setArriveSid(4);
        trainStationInfo2.setId(2);
        trainStationInfo2.setArriveTime(sdf.parse("2021-08-03 08:00:00"));
        trainStationInfo2.setTrainId(68688);
        trainStationInfo2.setFirstSeatBits(new BitSet(480).toByteArray());
        trainStationInfo2.setSecondSeatBits(new BitSet(336).toByteArray());
        trainStationInfo2.setVipSeatBits(new BitSet(216).toByteArray());
        trainStationInfo2.setStandSeatBits(new BitSet(80).toByteArray());
        trainStationInfoSet.add(trainStationInfo2);



        TrainInfo expectTrainInfo = new TrainInfo();
        expectTrainInfo.setTrainId(68688);
        expectTrainInfo.setTrainTag("G123");
        expectTrainInfo.setTrainType(1);
        expectTrainInfo.setStartDate(date);
        expectTrainInfo.setTrainStationInfoSet(trainStationInfoSet);

        Set<TrainStationInfo> lowSet = new HashSet<>();

        TrainStationInfo shangHai = new TrainStationInfo();
        shangHai.setTrainId(69027);
        shangHai.setStationNo(1);
        shangHai.setArriveTime(sdf.parse("2021-08-03 07:00:00"));
        shangHai.setId(3);
        shangHai.setArriveSid(13);
        shangHai.setStationName("上海");
        shangHai.setArriveCid(4);
        shangHai.setFirstSeatBits(new BitSet(480).toByteArray());
        shangHai.setSecondSeatBits(new BitSet(336).toByteArray());
        shangHai.setSoftLieBits(new BitSet(240).toByteArray());
        shangHai.setHardLieBits(new BitSet(160).toByteArray());
        shangHai.setStandSeatBits(new BitSet(120).toByteArray());
        lowSet.add(shangHai);


        TrainStationInfo BJN = new TrainStationInfo();
        BJN.setTrainId(69027);
        BJN.setStationNo(2);
        BJN.setArriveTime(sdf.parse("2021-08-03 07:00:00"));
        BJN.setId(4);
        BJN.setArriveSid(5);
        BJN.setStationName("北京南");
        BJN.setArriveCid(1);
        BJN.setFirstSeatBits(new BitSet(480).toByteArray());
        BJN.setSecondSeatBits(new BitSet(336).toByteArray());
        BJN.setSoftLieBits(new BitSet(240).toByteArray());
        BJN.setHardLieBits(new BitSet(160).toByteArray());
        BJN.setStandSeatBits(new BitSet(120).toByteArray());
        lowSet.add(BJN);


        TrainInfo expectTrainInfo2 = new TrainInfo();
        expectTrainInfo2.setTrainId(69027);
        expectTrainInfo2.setTrainTag("R1");
        expectTrainInfo2.setTrainType(0);
        expectTrainInfo2.setStartDate(date);
        expectTrainInfo2.setTrainStationInfoSet(lowSet);

//        TrainInfo expectTrainInfo3 = new TrainInfo();
//        expectTrainInfo2.setTrainId(44444);

        Set<TrainStationInfo> stationInfoSet = new HashSet<>();
        TrainStationInfo stationInfo = new TrainStationInfo();
        trainStationInfo.setStationNo(1);
        trainStationInfo.setStationName("上海虹桥");
        trainStationInfo.setArriveCid(4);
        trainStationInfo.setArriveSid(15);
        trainStationInfo.setId(1);
        trainStationInfo.setArriveTime(sdf.parse("2021-08-03 07:00:00"));
        trainStationInfo.setTrainId(44444);
        trainStationInfo.setFirstSeatBits(new BitSet(480).toByteArray());
        trainStationInfo.setSecondSeatBits(new BitSet(336).toByteArray());
        trainStationInfo.setVipSeatBits(new BitSet(216).toByteArray());
        trainStationInfo.setStandSeatBits(new BitSet(80).toByteArray());
        stationInfoSet.add(trainStationInfo);

        trainStationInfo = new TrainStationInfo();
        trainStationInfo.setStationNo(2);
        trainStationInfo.setStationName("北京南");
        trainStationInfo.setArriveCid(1);
        trainStationInfo.setArriveSid(5);
        trainStationInfo.setId(2);
        trainStationInfo.setArriveTime(sdf.parse("2021-08-03 08:00:00"));
        trainStationInfo.setTrainId(44444);
        trainStationInfo.setFirstSeatBits(new BitSet(480).toByteArray());
        trainStationInfo.setSecondSeatBits(new BitSet(336).toByteArray());
        trainStationInfo.setVipSeatBits(new BitSet(216).toByteArray());
        trainStationInfo.setStandSeatBits(new BitSet(80).toByteArray());
        stationInfoSet.add(trainStationInfo);



        TrainInfo expectTrainInfo3= new TrainInfo();
        expectTrainInfo3.setTrainId(44444);
        expectTrainInfo3.setTrainTag("G123");
        expectTrainInfo3.setTrainType(1);
        expectTrainInfo3.setStartDate(date);
        expectTrainInfo3.setTrainStationInfoSet(stationInfoSet);



        //一共两列车 上海到北京南(0)--69027      上海虹桥北京(1)--68688
        Mockito.when(searchDao.getTrains(date,4,1)).thenReturn(ret1); //上海到北京
        Mockito.when(searchDao.getTrainsCityToStation(date,4,5)).thenReturn(ret2);//上海到北京南
        Mockito.when(searchDao.getTrainsStationToCity(date,15,1)).thenReturn(ret3);//上海虹桥到北京
        Mockito.when(searchDao.getTrainsStationToStation(date,15,5)).thenReturn(ret4);//上海虹桥到北京南


        Mockito.when(searchDao.getTrainInfo(68688)).thenReturn(expectTrainInfo);//上海虹桥北京
        Mockito.when(searchDao.getTrainInfo(69027)).thenReturn(expectTrainInfo2);//上海北京南
        Mockito.when(searchDao.getTrainInfo(44444)).thenReturn(expectTrainInfo3);//上海虹桥北京南

        Mockito.when(searchDao.getStations("上海")).thenReturn(Arrays.asList("上海","上海虹桥"));
        Mockito.when(searchDao.getStations("北京")).thenReturn(Arrays.asList("北京","北京南"));


        Mockito.when(searchDao.searchTimeTableInfoByTag(date,"G123")).thenReturn(Message.createMessage(200,"yes"));


        MapStation stationK = new MapStation();
        stationK.setStationId(50);
        stationK.setStationName("昆明");
        stationK.setCityId(9);

        MapStation stationS = new MapStation();
        stationS.setStationId(60);
        stationS.setStationName("沈阳");
        stationS.setCityId(10);

        MapStation stationC = new MapStation();
        stationC.setStationId(70);
        stationC.setStationName("赤峰");
        stationC.setCityId(11);

        MapLine line1 = new MapLine();
        line1.setTrainTag("G1");
        line1.setDayDif(0);
        line1.setEndStation(stationS);


        MapLine line2 = new MapLine();
        line2.setTrainTag("G2");
        line2.setDayDif(0);
        line2.setEndStation(stationC);
        stationS.setPathLine(line2);
        stationK.setPathLine(line1);


        TrainInfo firstTrainInfo  = new TrainInfo();
        firstTrainInfo.setTrainTag("G1");
        firstTrainInfo.setTrainId(111);
        firstTrainInfo.setTrainType(1);

        TrainInfo secondTrainInfo = new TrainInfo();
        secondTrainInfo.setTrainTag("G2");
        secondTrainInfo.setTrainId(222);
        secondTrainInfo.setTrainType(1);


        TrainStationInfo k = new TrainStationInfo();
        k.setArriveCid(9);
        k.setStationName("昆明");
        k.setArriveSid(50);
        k.setStationNo(1);
        String time1 = "2021-08-03 07:00:00";
        SimpleDateFormat hms = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        Date date1 = hms.parse(time1);
        k.setArriveTime(date1);
        k.setTrainId(111);
        k.setFirstSeatBits(new BitSet(480).toByteArray());
        k.setSecondSeatBits(new BitSet(336).toByteArray());
        k.setVipSeatBits(new BitSet(216).toByteArray());
        k.setStandSeatBits(new BitSet(80).toByteArray());


        TrainStationInfo s = new TrainStationInfo();
        s.setArriveCid(10);
        s.setStationName("沈阳");
        s.setStationNo(2);
        s.setArriveSid(60);
        String time2 = "2021-08-03 08:00:00";
        Date date2 = hms.parse(time2);
        s.setArriveTime(date2);
        s.setTrainId(111);
        s.setFirstSeatBits(new BitSet(480).toByteArray());
        s.setSecondSeatBits(new BitSet(336).toByteArray());
        s.setVipSeatBits(new BitSet(216).toByteArray());
        s.setStandSeatBits(new BitSet(80).toByteArray());



        Set<TrainStationInfo> firstSet = new HashSet<>();
        firstSet.add(k);
        firstSet.add(s);

        firstTrainInfo.setTrainStationInfoSet(firstSet);

        TrainStationInfo ss = new TrainStationInfo();
        ss.setArriveCid(10);
        ss.setStationName("沈阳");
        ss.setStationNo(1);
        ss.setArriveSid(60);
        String time3 = "2021-08-03 09:00:00";
        Date date3 = hms.parse(time3);
        ss.setArriveTime(date3);
        ss.setTrainId(222);
        ss.setFirstSeatBits(new BitSet(480).toByteArray());
        ss.setSecondSeatBits(new BitSet(336).toByteArray());
        ss.setVipSeatBits(new BitSet(216).toByteArray());
        ss.setStandSeatBits(new BitSet(80).toByteArray());


        TrainStationInfo c = new TrainStationInfo();
        c.setArriveCid(11);
        c.setStationName("赤峰");
        c.setStationNo(2);
        c.setArriveSid(70);
        c.setTrainId(222);
        String time4 = "2021-08-03 10:00:00";
        Date date4 = hms.parse(time4);
        c.setArriveTime(date4);
        c.setFirstSeatBits(new BitSet(480).toByteArray());
        c.setSecondSeatBits(new BitSet(336).toByteArray());
        c.setVipSeatBits(new BitSet(216).toByteArray());
        c.setStandSeatBits(new BitSet(80).toByteArray());



        Set<TrainStationInfo> secondSet = new HashSet<>();
        secondSet.add(ss);
        secondSet.add(c);

        secondTrainInfo.setTrainStationInfoSet(secondSet);



        MapPath path1 = new MapPath(0,0,stationK);

        //====

        MapStation stationT = new MapStation();
        stationT.setStationId(500);
        stationT.setStationName("天津");
        stationT.setCityId(90);

        MapStation stationN = new MapStation();
        stationN.setStationId(600);
        stationN.setStationName("南京");
        stationN.setCityId(100);

        MapStation stationF = new MapStation();
        stationF.setStationId(700);
        stationF.setStationName("福建");
        stationF.setCityId(110);

        MapLine line3 = new MapLine();
        line3.setTrainTag("H1");
        line3.setDayDif(0);
        line3.setEndStation(stationN);


        MapLine line4 = new MapLine();
        line4.setTrainTag("H2");
        line4.setDayDif(0);
        line4.setEndStation(stationF);
        stationN.setPathLine(line4);
        stationT.setPathLine(line3);


        TrainInfo thirdTrainInfo  = new TrainInfo();
        thirdTrainInfo.setTrainTag("H1");
        thirdTrainInfo.setTrainId(333);
        thirdTrainInfo.setTrainType(0);

        TrainInfo fourthTrainInfo = new TrainInfo();
        fourthTrainInfo.setTrainTag("H2");
        fourthTrainInfo.setTrainId(444);
        fourthTrainInfo.setTrainType(0);


        TrainStationInfo t = new TrainStationInfo();
        t.setArriveCid(90);
        t.setStationName("天津");
        t.setArriveSid(500);
        t.setStationNo(1);

        t.setArriveTime(date1);
        t.setTrainId(333);
        t.setFirstSeatBits(new BitSet(480).toByteArray());
        t.setSecondSeatBits(new BitSet(336).toByteArray());
        t.setSoftLieBits(new BitSet(240).toByteArray());
        t.setHardLieBits(new BitSet(160).toByteArray());
        t.setStandSeatBits(new BitSet(120).toByteArray());


        TrainStationInfo n = new TrainStationInfo();
        n.setArriveCid(100);
        n.setStationName("南京");
        n.setStationNo(2);
        n.setArriveSid(600);

        n.setArriveTime(date2);
        n.setTrainId(333);
        n.setFirstSeatBits(new BitSet(480).toByteArray());
        n.setSecondSeatBits(new BitSet(336).toByteArray());
        n.setSoftLieBits(new BitSet(240).toByteArray());
        n.setHardLieBits(new BitSet(160).toByteArray());
        n.setStandSeatBits(new BitSet(120).toByteArray());



        Set<TrainStationInfo> thirdSet = new HashSet<>();
        thirdSet.add(t);
        thirdSet.add(n);

        thirdTrainInfo.setTrainStationInfoSet(thirdSet);

        TrainStationInfo nn = new TrainStationInfo();
        nn.setArriveCid(100);
        nn.setStationName("南京");
        nn.setStationNo(1);
        nn.setArriveSid(600);

        nn.setArriveTime(date3);
        nn.setTrainId(444);
        nn.setFirstSeatBits(new BitSet(480).toByteArray());
        nn.setSecondSeatBits(new BitSet(336).toByteArray());
        nn.setSoftLieBits(new BitSet(240).toByteArray());
        nn.setHardLieBits(new BitSet(160).toByteArray());
        nn.setStandSeatBits(new BitSet(120).toByteArray());


        TrainStationInfo f = new TrainStationInfo();
        f.setArriveCid(110);
        f.setStationName("福建");
        f.setStationNo(2);
        f.setArriveSid(700);
        f.setTrainId(444);

        f.setArriveTime(date4);
        f.setFirstSeatBits(new BitSet(480).toByteArray());
        f.setSecondSeatBits(new BitSet(336).toByteArray());
        f.setSoftLieBits(new BitSet(240).toByteArray());
        f.setHardLieBits(new BitSet(160).toByteArray());
        f.setStandSeatBits(new BitSet(120).toByteArray());



        Set<TrainStationInfo> fourthSet = new HashSet<>();
        fourthSet.add(nn);
        fourthSet.add(f);

        fourthTrainInfo.setTrainStationInfoSet(fourthSet);


        MapPath path2 = new MapPath(0,0,stationT);


        //======


        //===考虑第一个continue
        MapStation stationKK = new MapStation();
        stationKK.setStationId(50);
        stationKK.setStationName("昆明");
        stationKK.setCityId(9);

        MapStation stationSS = new MapStation();
        stationSS.setStationId(60);
        stationSS.setStationName("沈阳");
        stationSS.setCityId(10);

        MapStation stationCC = new MapStation();
        stationCC.setStationId(70);
        stationCC.setStationName("赤峰");
        stationCC.setCityId(11);

        MapLine line5 = new MapLine();
        line5.setTrainTag("G1");
        line5.setDayDif(1);
        line5.setEndStation(stationSS);


        MapLine line6 = new MapLine();
        line6.setTrainTag("G2");
        line6.setDayDif(0);
        line6.setEndStation(stationCC);
        stationSS.setPathLine(line6);
        stationKK.setPathLine(line5);

        MapPath path3 = new MapPath(3,1,stationKK);
        //


        //=====  考虑第二个continue====
        MapStation stationTT = new MapStation();
        stationTT.setStationId(500);
        stationTT.setStationName("天津");
        stationTT.setCityId(90);

        MapStation stationNN = new MapStation();
        stationNN.setStationId(600);
        stationNN.setStationName("南京");
        stationNN.setCityId(100);

        MapStation stationFF = new MapStation();
        stationFF.setStationId(700);
        stationFF.setStationName("福建");
        stationFF.setCityId(110);

        MapLine line9 = new MapLine();
        line9.setTrainTag("F1");
        line9.setDayDif(0);
        line9.setEndStation(stationNN);


        MapLine line10 = new MapLine();
        line10.setTrainTag("F2");
        line10.setDayDif(0);
        line10.setEndStation(stationFF);
        stationNN.setPathLine(line10);
        stationTT.setPathLine(line9);


        TrainInfo firstInfo = new TrainInfo();
        firstInfo.setTrainTag("F1");
        firstInfo.setTrainId(555);
        firstInfo.setTrainType(0);

        TrainInfo secondInfo = new TrainInfo();
        secondInfo.setTrainTag("F2");
        secondInfo.setTrainId(666);
        secondInfo.setTrainType(0);


        TrainStationInfo T = new TrainStationInfo();
        T.setArriveCid(90);
        T.setStationName("天津");
        T.setArriveSid(500);
        T.setStationNo(1);

        T.setArriveTime(date3);
        T.setTrainId(333);
        T.setFirstSeatBits(new BitSet(480).toByteArray());
        T.setSecondSeatBits(new BitSet(336).toByteArray());
        T.setSoftLieBits(new BitSet(240).toByteArray());
        T.setHardLieBits(new BitSet(160).toByteArray());
        T.setStandSeatBits(new BitSet(120).toByteArray());


        TrainStationInfo N = new TrainStationInfo();
        N.setArriveCid(100);
        N.setStationName("南京");
        N.setStationNo(2);
        N.setArriveSid(600);

        N.setArriveTime(date4);
        N.setTrainId(333);
        N.setFirstSeatBits(new BitSet(480).toByteArray());
        N.setSecondSeatBits(new BitSet(336).toByteArray());
        N.setSoftLieBits(new BitSet(240).toByteArray());
        N.setHardLieBits(new BitSet(160).toByteArray());
        N.setStandSeatBits(new BitSet(120).toByteArray());



        Set<TrainStationInfo> noSet1 = new HashSet<>();
        noSet1.add(T);
        noSet1.add(N);

        firstInfo.setTrainStationInfoSet(noSet1);

        TrainStationInfo NN = new TrainStationInfo();
        NN.setArriveCid(100);
        NN.setStationName("南京");
        NN.setStationNo(1);
        NN.setArriveSid(600);

        NN.setArriveTime(date1);
        NN.setTrainId(444);
        NN.setFirstSeatBits(new BitSet(480).toByteArray());
        NN.setSecondSeatBits(new BitSet(336).toByteArray());
        NN.setSoftLieBits(new BitSet(240).toByteArray());
        NN.setHardLieBits(new BitSet(160).toByteArray());
        NN.setStandSeatBits(new BitSet(120).toByteArray());


        TrainStationInfo F = new TrainStationInfo();
        F.setArriveCid(110);
        F.setStationName("福建");
        F.setStationNo(2);
        F.setArriveSid(700);
        F.setTrainId(444);

        F.setArriveTime(date2);
        F.setFirstSeatBits(new BitSet(480).toByteArray());
        F.setSecondSeatBits(new BitSet(336).toByteArray());
        F.setSoftLieBits(new BitSet(240).toByteArray());
        F.setHardLieBits(new BitSet(160).toByteArray());
        F.setStandSeatBits(new BitSet(120).toByteArray());



        Set<TrainStationInfo> noSet = new HashSet<>();
        noSet.add(NN);
        noSet.add(F);

        secondInfo.setTrainStationInfoSet(noSet);


        MapPath path4 = new MapPath(0,0,stationTT);
        //=======end============

        List<MapPath> pathList = new ArrayList<>();
        List<MapPath> commonPath = new ArrayList<>();
        commonPath.add(path2);
        commonPath.add(path4);
        pathList.add(path1);
        pathList.add(path3);
        SimpleDateFormat ymd = new SimpleDateFormat("yyyy-MM-dd");
        String passStartDate = "2021-08-03";
        Date targetDate =ymd.parse(passStartDate);
        Mockito.when(searchDao.getOneTransitSortByJava("昆明","赤峰",60,1440,20)).thenReturn(pathList);
        Mockito.when(searchDao.getTrainInfoByTag("G1",targetDate)).thenReturn(firstTrainInfo);
        Mockito.when(searchDao.getTrainInfoByTag("G2",targetDate)).thenReturn(secondTrainInfo);
            //火车
        Mockito.when(searchDao.getOneTransitSortByJava("天津","福建",60,1440,20)).thenReturn(commonPath);
        Mockito.when(searchDao.getTrainInfoByTag("H1",targetDate)).thenReturn(thirdTrainInfo);
        Mockito.when(searchDao.getTrainInfoByTag("H2",targetDate)).thenReturn(fourthTrainInfo);
        Mockito.when(searchDao.getTrainInfoByTag("F1",targetDate)).thenReturn(firstInfo);
        Mockito.when(searchDao.getTrainInfoByTag("F2",targetDate)).thenReturn(secondInfo);


       // Mockito.when(searchDao.getOneTransitSortByJava("上海","赤峰",60,1440,20))
    }


    @Test
    public void testPtoPSearch(){


        JSONArray ret = ticketService.PtoPSearch(new Date(51,7,3),"上海","北京");
        JSONArray ret2 = ticketService.PtoPSearch(new Date(51,7,3),"上海","北京南");
        JSONArray ret3 = ticketService.PtoPSearch(new Date(51,7,3),"上海虹桥","北京");
        JSONArray ret4 = ticketService.PtoPSearch(new Date(51,7,3),"上海虹桥","北京南");
        JSONArray ret5 = ticketService.PtoPSearch(new Date(51,7,3),"火星","月球");

        Assert.assertThat(JSONObject.fromObject(ret.get(0)).getInt("train_id"), Matchers.oneOf(68688,69027));
        Assert.assertThat(JSONObject.fromObject(ret2.get(0)).getInt("train_id"), Matchers.oneOf(69027,44444));
        Assert.assertThat(JSONObject.fromObject(ret3.get(0)).getInt("train_id"), Matchers.oneOf(68688,44444));
        Assert.assertThat(JSONObject.fromObject(ret4.get(0)).getInt("train_id"),Matchers.is(44444));
        Assert.assertThat(ret5,Matchers.nullValue());

        Mockito.verify(searchDao).getTrains(new Date(51,7,3),4,1);
        Mockito.verify(searchDao).getTrainsCityToStation(new Date(51,7,3),4,5);
        Mockito.verify(searchDao).getTrainsStationToStation(new Date(51,7,3),15,5);
    }
    @Test
    public  void testPtoPChange(){

        JSONArray ret = ticketService. ChangeTicketSearch(new Date(51,7,3),"上海虹桥","北京南");
        Assert.assertThat(JSONObject.fromObject(ret.get(0)).getInt("train_id"),Matchers.oneOf(68688,69027,44444));
        Mockito.verify(searchDao).getTrains(new Date(51,7,3),4,1);

    }
    @Test
    public void testSearchStation(){
        JSONObject ret =ticketService.searchStation("上海","北京");
        JSONObject ans = new JSONObject();
        List<String> start = Arrays.asList("上海","上海虹桥");
        ans.put("startStation",start);
        List<String> end = Arrays.asList("北京","北京南");
        ans.put("endStation",end);

        Assert.assertThat(ret,Matchers.is(ans));
    }

    @Test
    public void testGetTicketInfo(){
        JSONObject ret1 = ticketService.getTicketInfo(68688,1,2);
        JSONObject ret2 =ticketService.getTicketInfo(69027,1,2);
        Assert.assertThat(ret1.getInt("train_id"),Matchers.is(68688));
        Assert.assertThat(ret2.getInt("train_id"),Matchers.is(69027));
    }

    @Test
    public void testSearchStationChange(){
        JSONObject ret1 = ticketService.searchStationChange("上海虹桥","北京南");
        JSONObject ans = new JSONObject();
        List<String> start = Arrays.asList("上海","上海虹桥");
        List<String> end = Arrays.asList("北京","北京南");
        ans.put("startStation",start);
        ans.put("endStation",end);
        Assert.assertThat(ret1,Matchers.is(ans));
    }

    @Test
    public void testSearchTimeTableInfoByTag(){
        Message ret = ticketService.searchTimeTableInfoByTag(new Date(51,7,3),"G123");
        Assert.assertThat(ret.getStatus(),Matchers.is(200));
    }

    @Test
    public void testNeo4jPassBy() throws ParseException {
        String dateTime = "2021-08-03";
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
        Date targetDate = sdf.parse(dateTime);
        JSONArray ret = ticketService.neo4jPassBy(targetDate,"昆明","赤峰");
        JSONArray ret2 = ticketService.neo4jPassBy(targetDate,"天津","福建");
        String type1 = ret.getJSONObject(0).getJSONObject("first_rail").getString("train_tag");
        String type2 = ret2.getJSONObject(0).getJSONObject("first_rail").getString("train_tag");
        Assert.assertThat(type1,Matchers.oneOf("G1","G2"));
        Assert.assertThat(type2,Matchers.oneOf("H1","H2"));
    }

}
