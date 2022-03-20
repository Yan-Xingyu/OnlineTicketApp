package com.OnlineTickets.backend.controller;

import com.OnlineTickets.backend.entity.UserOrder;
import com.OnlineTickets.backend.service.OrderService;
import com.OnlineTickets.backend.utils.Message;
import com.alibaba.fastjson.JSON;
import net.sf.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.text.ParseException;
import java.util.List;

@RestController
public class OrderController {
    @Autowired
    OrderService orderService;
    //TODO:sort the result
    @RequestMapping("/findOrderById")
    UserOrder findOrderById(@RequestParam Integer orderId){
        return orderService.findById(orderId);
    }

    @RequestMapping("/getUserOrder")
    List<UserOrder> getUserOrder(@RequestParam Integer userId) {
        return orderService.getUserOrder(userId);
    }

    @RequestMapping("/getOrderByTime")
    List<UserOrder> getOrderByTime(@RequestBody JSONObject params) throws ParseException {
        return orderService.getOrderByTime(params);
    }

    @RequestMapping("/commitOrder")
    Message commitOrder(@RequestBody JSONObject order) throws NoSuchMethodException {
        return orderService.saveOrder(order,-1);
    }

    @RequestMapping("/commitOrderTwice")
    Message commitOrderTwice(@RequestBody JSONObject order) throws NoSuchMethodException {

        JSONObject firstOrder = order.getJSONObject("first_order");
        JSONObject secondOrder =order.getJSONObject("second_order");
        Message firstMessage= orderService.saveOrder(firstOrder,-1);
        Message secondMessage= orderService.saveOrder(secondOrder,-1);
        JSONObject ret = new JSONObject();
        ret.put("first",firstMessage);
        ret.put("second",secondMessage);
        if (firstMessage.getStatus()<0||secondMessage.getStatus()<0){
            if(firstMessage.getStatus()>0)
                return Message.createMessage(-200,"第二程购票失败",ret);
            if (secondMessage.getStatus()>0)
                return Message.createMessage(-200,"第一程购票失败",ret);
            return Message.createMessage(-200,"两次购票均失败");
        }
        else return Message.createMessage(200,"购票成功",ret);

    }


    @RequestMapping("/cancelOrder")
    Message cancelOrder(@RequestParam Integer orderId){

        orderService.cancelOrder(orderId);
        return Message.createMessage(200,"ok");
    }

    @RequestMapping("/modifyOrder")
    Message modifyOrder(@RequestBody JSONObject params) throws NoSuchMethodException {
        Integer order_id = params.getInt("order_id");
        orderService.changeStatus(order_id, 2);
        Message purchaseResult =orderService.saveOrder(params, order_id);
        if(purchaseResult.getStatus()>0)
            return Message.createMessage(200,"改签成功",purchaseResult.getData());
        else return Message.createMessage(200,"改签失败");
    }
}
