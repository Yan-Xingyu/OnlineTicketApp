package com.OnlineTickets.backend.dao;

import com.OnlineTickets.backend.daoimpl.OrderDaoImpl;
import com.OnlineTickets.backend.entity.OrderItem;
import com.OnlineTickets.backend.entity.TrainInfo;
import com.OnlineTickets.backend.entity.TrainStationInfo;
import com.OnlineTickets.backend.entity.UserOrder;
import com.OnlineTickets.backend.repository.OrderRepository;
import com.OnlineTickets.backend.repository.TrainInfoRepository;
import com.OnlineTickets.backend.repository.TrainStationInfoRepository;
import org.junit.Before;
import org.junit.Test;
import org.junit.jupiter.api.Assertions;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.MockitoAnnotations;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;

import static org.mockito.ArgumentMatchers.any;
public class OrderDaoUnitTest {

    @Mock
    TrainStationInfoRepository trainStationInfoRepository;

    @Mock
    TrainInfoRepository trainInfoRepository;

    @Mock
    OrderRepository orderRepository;

    @InjectMocks
    OrderDaoImpl orderDao;

    @Before
    public void setUp() throws ParseException {
        MockitoAnnotations.initMocks(this);

        UserOrder newRet = new UserOrder();
        newRet.setOrderId(2);
        for (int i = 0; i < 6; i++) {
            UserOrder ret = new UserOrder();
            ret.setOrderId(i);
            ret.setTrainId(i);
            ret.setStartStation("西安");
            ret.setEndStation("上海");
            Set<OrderItem> orderItemSet = new HashSet<>();
            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(ret);
            orderItem.setSeatPosition(0);
            orderItem.setSeatType(i);
            orderItemSet.add(orderItem);
            ret.setOrderItems(orderItemSet);
            Mockito.when(orderRepository.findById(i)).thenReturn(Optional.of(ret));
            TrainInfo expectTrainInfo = new TrainInfo();
            expectTrainInfo.setTrainId(1);
            Set<TrainStationInfo> trainStationInfoSet = new HashSet<>();
            TrainStationInfo n1 = new TrainStationInfo();
            n1.setId(2*i);
            n1.setStationNo(1);
            n1.setArriveTime(new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").parse(new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(0)));
            n1.setStationName("西安");
            n1.setFirstSeatBits(new byte[60]);
            n1.setHardLieBits(new byte[60]);
            n1.setSecondSeatBits(new byte[60]);
            n1.setSoftLieBits(new byte[60]);
            n1.setVipSeatBits(new byte[60]);
            n1.setStandSeatBits(new byte[60]);
            TrainStationInfo n2 = new TrainStationInfo();
            n2.setId(2*i+1);
            n2.setStationNo(2);
            n2.setArriveTime(new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").parse(new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(0)));
            n2.setStationName("上海");
            Mockito.when(trainInfoRepository.findById(i)).thenReturn(Optional.of(expectTrainInfo));
            trainStationInfoSet.add(n1);
            trainStationInfoSet.add(n2);
            expectTrainInfo.setTrainStationInfoSet(trainStationInfoSet);
        }
        Mockito.when(orderRepository.findById(6)).thenReturn(Optional.of(newRet));
        List<UserOrder> retList = new ArrayList<>();
        retList.add(newRet);
        Mockito.when(orderRepository.findByUserId(1)).thenReturn(retList);

        Mockito.when(orderRepository.findFutureOrder(1,new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").parse(new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(0))))
                .thenReturn(retList);
        Mockito.when(orderRepository.findHistoryOrder(1,new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").parse(new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(0))))
                .thenReturn(retList);
        Mockito.when(orderRepository.save(any())).thenReturn(newRet);




    }
    @Test
    public void TestFindByOrderId(){
        UserOrder result = orderDao.findByOrderId(6);
        Mockito.verify(orderRepository).findById(6);
        Assertions.assertEquals(result.getOrderId(),2);
    }
    @Test
    public void TestGetUserOrder(){
        List<UserOrder> result = orderDao.findByUserId(1);
        Mockito.verify(orderRepository).findByUserId(1);
        Assertions.assertEquals(result.get(0).getOrderId(),2);
    }
    @Test
    public void TestFindFutureOrder() throws ParseException {
        List<UserOrder> result = orderDao.findFutureOrder(1,new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").parse(new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(0)));
        Mockito.verify(orderRepository).findFutureOrder(1,new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").parse(new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(0)));
        Assertions.assertEquals(result.get(0).getOrderId(),2);
    }
    @Test
    public void TestHistoryOrder() throws ParseException{
        List<UserOrder> result = orderDao.findHistoryOrder(1,new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").parse(new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(0)));
        Mockito.verify(orderRepository).findHistoryOrder(1,new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").parse(new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(0)));
        Assertions.assertEquals(result.get(0).getOrderId(),2);
    }
    @Test
    public void TestSave(){
        UserOrder ret = new UserOrder();
        ret.setOrderId(2);
        Integer result = orderDao.saveUserOrder(ret);
        Assertions.assertEquals(result,2);
        Mockito.verify(orderRepository).save(ret);
    }
    @Test
    public void TestChangeStatus(){
        for (int i = 0; i < 6; i++) {
            orderDao.changeStatus(i,0);
            Mockito.verify(orderRepository).changeStatus(i,0);
        }
    }
}
