package com.OnlineTickets.backend.daoimpl;

import com.OnlineTickets.backend.dao.OrderDao;
import com.OnlineTickets.backend.entity.OrderItem;
import com.OnlineTickets.backend.entity.TrainInfo;
import com.OnlineTickets.backend.entity.TrainStationInfo;
import com.OnlineTickets.backend.entity.UserOrder;
import com.OnlineTickets.backend.repository.OrderRepository;
import com.OnlineTickets.backend.repository.TrainInfoRepository;
import com.OnlineTickets.backend.repository.TrainStationInfoRepository;
import net.sf.json.JSON;
import net.sf.json.JSONArray;
import net.sf.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.math.BigInteger;
import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Repository
public class OrderDaoImpl implements OrderDao {

    @Autowired
    TrainStationInfoRepository trainStationInfoRepository;

    @Autowired
    TrainInfoRepository trainInfoRepository;

    @Autowired
    OrderRepository orderRepository;

    @Override
    public UserOrder findByOrderId(Integer orderId){
        return orderRepository.findById(orderId).orElse(null);
    }
    @Override
    public List<UserOrder> findByUserId(Integer userId) {

        return orderRepository.findByUserId(userId);
    }
    @Override
    public List<UserOrder> findFutureOrder(Integer userId,Date tmpTime) {
        return orderRepository.findFutureOrder(userId,tmpTime);
    }
    @Override
    public List<UserOrder> findHistoryOrder(Integer userId,Date tmpTime) {
        return orderRepository.findHistoryOrder(userId,tmpTime);
    }

    @Override
    public Integer saveUserOrder(UserOrder userOrder) {
        return orderRepository.save(userOrder).getOrderId();
    }

    @Override
    public void changeStatus(Integer orderId,int status) {
        UserOrder order= orderRepository.findById(orderId).orElse(null);
        assert order != null;
        TrainInfo t= trainInfoRepository.findById(order.getTrainId()).orElse(null);
        Integer typeIndex = -1;
        JSONObject seatsToCancel = new JSONObject();
        List<String> seatTypes = Stream.of("first_seat_bits","hard_lie_bits","second_seat_bits","soft_seat_bits","stand_seat_bits","vip_seat_bits").collect(Collectors.toList());
        for( String seatType : seatTypes)
            seatsToCancel.put(seatType,new ArrayList<Integer>());
        Set<OrderItem> orderItems = order.getOrderItems();
        for(OrderItem orderItem : orderItems)
        {
            typeIndex = orderItem.getSeatType();
            JSONArray old = (JSONArray) seatsToCancel.get(seatTypes.get(typeIndex));
            old.add(orderItem.getSeatPosition());
            seatsToCancel.put(seatTypes.get(typeIndex),old);
        }
        assert t != null;
        List<TrainStationInfo> trainStationInfos= new ArrayList<>(t.getTrainStationInfoSet());
        String startStation = order.getStartStation(),endStation = order.getEndStation();
        Collections.sort(trainStationInfos);
        boolean flag = false;
        for(TrainStationInfo trainStationInfo : trainStationInfos)
        {
            if(trainStationInfo.getStationName().equals(startStation))
                flag = true;
            if(trainStationInfo.getStationName().equals(endStation))
                break;
            if(flag)
            {
                JSONArray  l = (JSONArray) seatsToCancel.get(seatTypes.get(typeIndex));
                byte[] bits = new byte[0];
                switch (typeIndex)
                {
                    case 0:
                        bits=trainStationInfo.getFirstSeatBits();
                        break;
                    case 1:
                        bits=trainStationInfo.getHardLieBits();
                        break;
                    case 2:
                        bits=trainStationInfo.getSecondSeatBits();
                        break;
                    case 3:
                        bits=trainStationInfo.getSoftLieBits();
                        break;
                    case 4:
                        bits=trainStationInfo.getStandSeatBits();
                        break;
                    case 5:
                        bits=trainStationInfo.getVipSeatBits();
                        break;
                }

                for( Object i :l){
                    int offset = Integer.parseInt(i.toString());
                    bits[offset/8] &=(byte)~(1<<(offset%8));
                }
                switch (typeIndex)
                {
                    case 0:
                        trainStationInfoRepository.updateFirstSeatBits(bits,trainStationInfo.getId());
                        break;
                    case 1:
                        trainStationInfoRepository.updateHardLieBits(bits,trainStationInfo.getId());
                        break;
                    case 2:
                        trainStationInfoRepository.updateSecondSeatBits(bits,trainStationInfo.getId());
                        break;
                    case 3:
                        trainStationInfoRepository.updateSoftLieBits(bits,trainStationInfo.getId());
                        break;
                    case 4:
                        trainStationInfoRepository.updateStandSeatBits(bits,trainStationInfo.getId());
                        break;
                    case 5:
                        trainStationInfoRepository.updateVipSeatBits(bits,trainStationInfo.getId());
                        break;
                }
            }

        }
        orderRepository.changeStatus(orderId,status);
    }
}
