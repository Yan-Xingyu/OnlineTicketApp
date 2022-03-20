package com.OnlineTickets.backend.service;


import com.OnlineTickets.backend.dao.OrderDao;
import com.OnlineTickets.backend.dao.PassengerDao;
import com.OnlineTickets.backend.dao.SearchDao;
import com.OnlineTickets.backend.entity.Passenger;
import com.OnlineTickets.backend.entity.TrainInfo;
import com.OnlineTickets.backend.entity.TrainStationInfo;
import com.OnlineTickets.backend.entity.UserOrder;
import com.OnlineTickets.backend.serviceimpl.OrderServiceImpl;
import com.OnlineTickets.backend.utils.Message;
import net.sf.json.JSON;
import net.sf.json.JSONArray;
import net.sf.json.JSONException;
import net.sf.json.JSONObject;
import org.hamcrest.Matchers;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Order;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.MockitoAnnotations;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.annotation.Transactional;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;

import static org.mockito.ArgumentMatchers.any;

public class OrderServiceUnitTest {

    long timestamp=1579708800;
    long yearlater=1611331200;
    @Mock
    PlatformTransactionManager transactionManager;
    @Mock
    SearchDao searchDao;

    @Mock
    OrderDao orderDao;

    @Mock
    PassengerDao passengerDao;

    @InjectMocks
    OrderServiceImpl orderService;

    @Before
    public void setUp() throws ParseException {
        // 对所有注解了@Mock的对象进行模拟
        MockitoAnnotations.initMocks(this);
        TrainInfo expectTrainInfo = new TrainInfo();
        Set<TrainStationInfo> trainStationInfoSet = new HashSet<>();
        TrainStationInfo n1 = new TrainStationInfo();
        n1.setStationNo(1);
        n1.setArriveTime(new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").parse(new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(timestamp)));
        n1.setStationName("西安");
        n1.setFirstSeatBits(new byte[60]);
        n1.setHardLieBits(new byte[60]);
        n1.setSecondSeatBits(new byte[60]);
        n1.setSoftLieBits(new byte[60]);
        n1.setVipSeatBits(new byte[60]);
        n1.setStandSeatBits(new byte[60]);
        TrainStationInfo n2 = new TrainStationInfo();
        n2.setStationNo(2);
        n2.setArriveTime(new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").parse(new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(timestamp)));
        n2.setStationName("上海");

        byte [] fullByte = new byte[60];
        for (int i = 0; i < 60; i++) {
            fullByte[i]=-1;
        }
        TrainStationInfo n3 = new TrainStationInfo();
        n3.setStationNo(3);
        n3.setArriveTime(new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").parse(new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(timestamp)));
        n3.setStationName("西安");
        n3.setSecondSeatBits(fullByte);
        TrainStationInfo n4 = new TrainStationInfo();
        n4.setStationNo(4);
        n4.setArriveTime(new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").parse(new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(timestamp)));
        n4.setStationName("上海");
        n4.setSecondSeatBits(fullByte);
        trainStationInfoSet.add(n1);
        trainStationInfoSet.add(n2);
        trainStationInfoSet.add(n3);
        trainStationInfoSet.add(n4);
        expectTrainInfo.setTrainStationInfoSet(trainStationInfoSet);
        expectTrainInfo.setTrainTag("G123");
        expectTrainInfo.setTrainType(1);
        Mockito.when(searchDao.getTrainInfo(1)).thenReturn(expectTrainInfo);

        List<UserOrder> expectListUserOrder = new ArrayList<>();
        for(int i =0;i<2;i++)
        {
            UserOrder userOrder = new UserOrder();
            userOrder.setUserId(1);
            userOrder.setStatus(1);
            userOrder.setTrainTag("G1");
            userOrder.setTrainId(1);
            expectListUserOrder.add(userOrder);
        }
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
        Mockito.when(orderDao.findByOrderId(1)).thenReturn(expectListUserOrder.get(0));
        Mockito.when(orderDao.findByUserId(1)).thenReturn(expectListUserOrder);
        Mockito.when(orderDao.findFutureOrder(1,new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").parse(new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(timestamp)))).thenReturn(expectListUserOrder);
        Mockito.when(orderDao.findHistoryOrder(1,new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").parse(new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(timestamp)))).thenReturn(expectListUserOrder);

        Mockito.when(orderDao.saveUserOrder(any())).thenReturn(1);

        Passenger expectPassenger = new Passenger();
        expectPassenger.setReal_name("策");
        expectPassenger.setTel_number("11111111111");
        Mockito.when(passengerDao.findById(15)).thenReturn(expectPassenger);
    }

    @Test
    public void testFindById(){
        UserOrder testUserOrder = orderService.findById(1);
        Assert.assertThat(testUserOrder.getUserId(),Matchers.is(1));
        Mockito.verify(orderDao).findByOrderId(1);
    }
    @Test
    public void testGetUserOrder(){
        List<UserOrder> testUserOrder = orderService.getUserOrder(1);
        // 检查结果
        Assert.assertThat(testUserOrder.get(1).getTrainTag(), Matchers.is("G1"));
        // 验证调用上面的service 方法后是否 demoDao.getInfo(1) 调用过
        Mockito.verify(orderDao).findByUserId(1);
    }

    @Test
    public void testGetOrderByTime() throws ParseException {
        JSONObject body = new JSONObject();
        body.put("userId",1);
        body.put("method","H");
        body.put("startTime",timestamp);
        body.put("endTime",yearlater);
        List<UserOrder> testUserOrder = orderService.getOrderByTime(body);
        Assert.assertThat(testUserOrder.get(0).getUserId(),Matchers.is(1));
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
        Mockito.verify(orderDao).findHistoryOrder(1,new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").parse(new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(timestamp)));

        body.put("method","F");
        testUserOrder = orderService.getOrderByTime(body);
        Assert.assertThat(testUserOrder.get(0).getStatus(),Matchers.is(1));
        Mockito.verify(orderDao).findFutureOrder(1,new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").parse(new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(timestamp)));

        body.put("method","A");
        testUserOrder = orderService.getOrderByTime(body);
        Assert.assertThat(testUserOrder.get(0).getTrainTag(),Matchers.is("G1"));
        Mockito.verify(orderDao).findByUserId(1);

        body.put("method","ST");
        testUserOrder = orderService.getOrderByTime(body);
        Assert.assertThat(testUserOrder,Matchers.is(new ArrayList<>()));

        body.put("method","F");
        body.put("startTime","asdfasd");
        boolean k = false;
        try{
            testUserOrder = orderService.getOrderByTime(body);
        }
        catch (JSONException e){
            k = true;
        }
        Assert.assertTrue(k);
    }

    @Test
    public void testSaveOrder()
    {
        //Params init
        for (int i = 0; i < 6; i++) {
            JSONObject testObject = new JSONObject();
            testObject.put("user_id",1);
            testObject.put("train_id",1);
            testObject.put("start_no",1);
            testObject.put("end_no",2);
            JSONObject testPassenger = new JSONObject();
            testPassenger.put("passenger_id",15);
            testPassenger.put("seat_type",i);
            JSONArray testPassengers = new JSONArray();
            testPassengers.add(testPassenger);
            testObject.put("passenger_type",testPassengers);

            Message retVal = orderService.saveOrder(testObject,-1);

            Assert.assertThat(retVal.getMessage(),Matchers.is("消费成功"));
            Assert.assertEquals(retVal.getData().get("orderId"),1);
        }
        JSONObject testObject = new JSONObject();
        testObject.put("user_id",1);
        testObject.put("train_id",1);
        testObject.put("start_no",3);
        testObject.put("end_no",4);
        JSONObject testPassenger = new JSONObject();
        testPassenger.put("passenger_id",15);
        testPassenger.put("seat_type",2);
        JSONArray testPassengers = new JSONArray();
        testPassengers.add(testPassenger);
        testObject.put("passenger_type",testPassengers);

        Message retVal = orderService.saveOrder(testObject,-1);
        Assert.assertThat(retVal.getMessage(),Matchers.is("座位已无"));
        Assert.assertEquals(retVal.getStatus(),-200);

        testObject.put("start_no",1);
        testObject.put("end_no",3);
        Boolean k = false;
        try {
            Message newRetVal = orderService.saveOrder(testObject,-1);
        }
        catch (Exception e){
            k = true;
        }
        Assertions.assertTrue(k);

    }

    @Test
    public void testChangeStatus(){
        orderService.changeStatus(1,1);
        Mockito.verify(orderDao).changeStatus(1,1);
    }
    @Test
    public void cancelOrder() {
        orderService.cancelOrder(1);
        Mockito.verify(orderDao).changeStatus(1,0);
    }

}
