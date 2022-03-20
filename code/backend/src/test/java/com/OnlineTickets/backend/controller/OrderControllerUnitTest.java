package com.OnlineTickets.backend.controller;

import com.OnlineTickets.backend.controller.OrderController;
import com.OnlineTickets.backend.entity.UserOrder;
import com.OnlineTickets.backend.service.OrderService;
import com.OnlineTickets.backend.utils.Message;
import com.alibaba.fastjson.JSON;
import net.sf.json.JSONArray;
import net.sf.json.JSONObject;
import org.junit.Assert;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.text.ParseException;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import static org.mockito.BDDMockito.given;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(OrderController.class)
public class OrderControllerUnitTest {
    @Autowired
    private MockMvc mvc;

    @MockBean
    private OrderService orderService;

    @MockBean
    private RedisTemplate<String, Object> redisTemplate;
    @Test
    public void testFindOrderById() throws Exception {

        UserOrder expect = new UserOrder();
        expect.setOrderId(1);
        given(this.orderService.findById(1)).willReturn(expect);

        String result = mvc.perform(MockMvcRequestBuilders.get("/findOrderById?orderId=1").accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk()).andReturn().getResponse().getContentAsString();
        Assertions.assertEquals(JSONObject.fromObject(expect),result);

    }
    @Test
    public void testGetUserOrder() throws Exception {
        // Define what you expect the mock to return
        List<UserOrder> expect = new ArrayList<>();
        for(int i =0;i<2;i++)
        {
            UserOrder userOrder = new UserOrder();
            userOrder.setUserId(1);
            userOrder.setStatus(1);
            userOrder.setTrainTag("G1");
            userOrder.setTrainId(1);
            expect.add(userOrder);
        }
        given(this.orderService.getUserOrder(1)).willReturn(expect);
        // Run test
        String result = mvc.perform(MockMvcRequestBuilders.get("/getUserOrder?userId=1").accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk()).andReturn().getResponse().getContentAsString();

        Assertions.assertEquals(JSONArray.fromObject(expect),result);
    }


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
