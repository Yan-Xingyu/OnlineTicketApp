package com.OnlineTickets.backend.dao;


import com.OnlineTickets.backend.entity.UserOrder;
import com.OnlineTickets.backend.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.Date;
import java.util.List;

public interface OrderDao {

    UserOrder findByOrderId(Integer orderId);

    List<UserOrder> findByUserId(Integer userId);

    List<UserOrder> findFutureOrder(Integer userId,Date tmpTime);

    List<UserOrder> findHistoryOrder(Integer userId,Date tmpTime);

    Integer saveUserOrder(UserOrder userOrder);

    void changeStatus(Integer orderId, int status);

}
