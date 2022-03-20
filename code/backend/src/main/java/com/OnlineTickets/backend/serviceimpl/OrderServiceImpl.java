package com.OnlineTickets.backend.serviceimpl;

import com.OnlineTickets.backend.constant.TrainConstants;
import com.OnlineTickets.backend.dao.OrderDao;
import com.OnlineTickets.backend.dao.PassengerDao;
import com.OnlineTickets.backend.dao.SearchDao;
import com.OnlineTickets.backend.entity.*;
import com.OnlineTickets.backend.service.OrderService;
import com.OnlineTickets.backend.utils.Message;
import net.sf.json.JSON;
import net.sf.json.JSONArray;
import net.sf.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.TransactionDefinition;
import org.springframework.transaction.TransactionStatus;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.support.DefaultTransactionDefinition;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;
import java.util.concurrent.locks.Lock;
import java.util.concurrent.locks.ReentrantLock;

import static com.OnlineTickets.backend.utils.BitSetConvert.byteArray2BitSet;


@Service
public class OrderServiceImpl implements OrderService {

    @Autowired
    PlatformTransactionManager transactionManager;
    private static final Lock lock = new ReentrantLock();
    @Autowired
    SearchDao searchDao;
    @Autowired
    OrderDao orderDao;
    @Autowired
    PassengerDao passengerDao;
    @Override
    public UserOrder findById(Integer orderId){
        return orderDao.findByOrderId(orderId);
    }

    @Override
    public List<UserOrder> getUserOrder(Integer userId) {
        return orderDao.findByUserId(userId);
    }

    @Override
    public List<UserOrder> getOrderByTime(JSONObject requestBody) throws ParseException {
        Integer userId = requestBody.getInt("userId");
        String filter = requestBody.get("method").toString();
        Long lstartTime = requestBody.getLong("startTime");
        Date startTime= new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").parse(new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(lstartTime));
        switch (filter) {
            case "H": {
                return orderDao.findHistoryOrder(userId, startTime);
            }
            case "F": {
                return orderDao.findFutureOrder(userId, startTime);
            }
            case "A": {
                return orderDao.findByUserId(userId);
            }
        }
        return new ArrayList<>();
    }


    @Override
    //@Transactional(isolation = Isolation.SERIALIZABLE,propagation = Propagation.REQUIRES_NEW)
    public Message saveOrder(JSONObject order,Integer modify_id) {
        UserOrder  userOrder = new UserOrder();
        Integer userId = Integer.parseInt(order.get("user_id").toString());
        Integer trainId = Integer.parseInt(order.get("train_id").toString());
        Integer startNo = Integer.parseInt(order.get("start_no").toString());
        Integer endNo = Integer.parseInt(order.get("end_no").toString());
        JSONArray passengers = (JSONArray) order.get("passenger_type");
        JSONArray passengerToSeat = new JSONArray();
        userOrder.setModifyId(modify_id);
        userOrder.setUserId(userId);
        userOrder.setOrderTime(new Date());
        userOrder.setTrainId(trainId);
        userOrder.setStatus(1);

        DefaultTransactionDefinition defaultTransactionDefinition = new DefaultTransactionDefinition();
        defaultTransactionDefinition.setReadOnly(false);
        defaultTransactionDefinition.setIsolationLevel(TransactionDefinition.ISOLATION_DEFAULT);
        defaultTransactionDefinition.setPropagationBehavior(TransactionDefinition.PROPAGATION_REQUIRED);
        TransactionStatus status = transactionManager.getTransaction(defaultTransactionDefinition);
        //config transaction manually
        JSONObject ret =new JSONObject();
        try{

            lock.lock();
            TrainInfo  trainInfo= searchDao.getTrainInfo(trainId);
            Integer trainType = trainInfo.getTrainType();
            userOrder.setTrainType(trainInfo.getTrainType());

            userOrder.setTrainTag(trainInfo.getTrainTag());
            Set<TrainStationInfo> trainStationInfos = trainInfo.getTrainStationInfoSet();
            for(TrainStationInfo trainStationInfo :trainStationInfos)
            {
                if(trainStationInfo.getStationNo().equals(startNo))
                {
                    userOrder.setStartStation(trainStationInfo.getStationName());
                    userOrder.setStartTime(trainStationInfo.getArriveTime());
                }
                if(trainStationInfo.getStationNo().equals(endNo))
                {
                    userOrder.setEndStation(trainStationInfo.getStationName());
                    userOrder.setEndTime(trainStationInfo.getArriveTime());
                }
            }
            //fill the UserOrder self

            int price =0;

            Set<OrderItem> orderItems = new HashSet<>();
            for(Object passengerObject :passengers)
            {
                OrderItem orderItem = new OrderItem();
                JSONObject passenger = (JSONObject) passengerObject;
                Integer passengerId = passenger.getInt("passenger_id");
                Integer seatType = passenger.getInt("seat_type");

                int singlePrice =TrainConstants.getPrice(trainType,seatType)*(endNo-startNo);
                price+=singlePrice;
                orderItem.setSeatPrice(singlePrice);

                Passenger  pas= passengerDao.findById(passengerId);
                orderItem.setPassengerId(pas);
                orderItem.setSeatType(seatType);
                orderItem.setOrder(userOrder);
                BitSet bits;
                List<Integer> nums  = Arrays.asList(336,240,480,160,80,216);
                int num = nums.get(seatType);
                if(seatType == 4) num=(trainType == 1)?80:120;
                bits = new BitSet(num);
                List<BitSet> bitSets = new ArrayList<>();
                for(TrainStationInfo trainStationInfo :trainStationInfos) {
                    BitSet tmp =null;
                    Integer tmpStationNo = trainStationInfo.getStationNo();
                    if(tmpStationNo>=startNo && tmpStationNo<endNo) {
                        switch (seatType) {
                            case TrainConstants.FIRST_SEAT:
                                tmp = byteArray2BitSet(trainStationInfo.getFirstSeatBits());
                                break;
                            case TrainConstants.HARD_LIE_SEAT:
                                tmp = byteArray2BitSet(trainStationInfo.getHardLieBits());
                                break;
                            case TrainConstants.SECOND_SEAT:
                                tmp = byteArray2BitSet(trainStationInfo.getSecondSeatBits());
                                break;
                            case TrainConstants.SOFT_LIE_SEAT:
                                tmp = byteArray2BitSet(trainStationInfo.getSoftLieBits());
                                break;
                            case TrainConstants.STAND_SEAT:
                                tmp = byteArray2BitSet(trainStationInfo.getStandSeatBits());
                                break;
                            case TrainConstants.VIP_SEAT:
                                tmp = byteArray2BitSet(trainStationInfo.getVipSeatBits());
                                break;
                            case 6:
                                break;
                        }
                        bitSets.add(tmp);
                        bits.or(tmp);
                    }
                }
                int i = 0;
                for(;i<num;i++)
                {
                    if(!bits.get(i))
                    {
                        orderItem.setSeatPosition(i);
                        int k = 0;
                        for(TrainStationInfo trainStationInfo :trainStationInfos) {
                            Integer tmpStationNo = trainStationInfo.getStationNo();
                            if(tmpStationNo>=startNo && tmpStationNo<endNo) {
                                bitSets.get(k).set(i);
                                searchDao.updateBits(seatType, bitSets.get(k), trainStationInfo.getId());
                                k++;
                            }
                        }
                        break;
                    }
                }
                if(i==num)
                {
                    transactionManager.commit(status);//commit transaction
                    lock.unlock();
                    return Message.createMessage(-200,"座位已无");
                }
                orderItems.add(orderItem);
                JSONObject seat = new JSONObject();
                seat.put("seat",TrainConstants.getSeat(seatType,i));
                seat.put("name",orderItem.getPassengerId().getReal_name());
                passengerToSeat.add(seat);

            }
            ret = new JSONObject();
            ret.put("seatTable",passengerToSeat);
            userOrder.setOrderItems(orderItems);
            Integer newOrderId = orderDao.saveUserOrder(userOrder);
            ret.put("orderId",newOrderId);
            transactionManager.commit(status);//commit transaction

        }
        catch (Exception e){
            transactionManager.rollback(status);
            throw e;
        }
        lock.unlock();
        return Message.createMessage(200,"消费成功",ret);

    }


    @Override
    @Transactional
    public void changeStatus(Integer order_id, int status){
        orderDao.changeStatus(order_id, status);
    }
    @Override
    @Transactional
    public void cancelOrder(Integer orderId) {
            orderDao.changeStatus(orderId,0);
    }
}
