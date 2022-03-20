package com.OnlineTickets.backend.service;


import com.OnlineTickets.backend.entity.UserOrder;
import com.OnlineTickets.backend.utils.Message;
import net.sf.json.JSONObject;

import java.text.ParseException;
import java.util.List;

public interface OrderService {

    UserOrder findById(Integer orderId);

    List<UserOrder> getUserOrder(Integer userId);

    List<UserOrder> getOrderByTime(JSONObject requestBody) throws ParseException;

    Message saveOrder(JSONObject userOrder, Integer modify_id) throws NoSuchMethodException;

    void cancelOrder(Integer orderId);

    void changeStatus(Integer order_id, int status);
}
