package com.OnlineTickets.backend.controller;

import com.OnlineTickets.backend.entity.Passenger;
import com.OnlineTickets.backend.service.PassengerService;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.ObjectWriter;
import net.sf.json.JSONArray;
import net.sf.json.JSONObject;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;

import java.util.HashSet;
import java.util.LinkedList;
import java.util.List;
import java.util.Set;

import static org.mockito.BDDMockito.given;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(PassengerController.class)
public class PassengerControllerUnitTest {
    @Autowired
    private MockMvc mvc;

    @MockBean
    private PassengerService passengerService;

    @Test
    public void testPassengerGet() throws Exception{
        Set<Passenger> result = new HashSet<>();

        Passenger passenger1 = new Passenger();
        passenger1.setCard_id("1111");
        passenger1.setType(0);
        passenger1.setReal_name("rht");
        passenger1.setTel_number("123414");
        passenger1.setCertificate_type(0);
        Passenger passenger2 = new Passenger();
        passenger2.setCard_id("111");
        passenger2.setType(0);
        passenger2.setReal_name("rh");
        passenger2.setTel_number("123414");
        passenger2.setCertificate_type(0);

        result.add(passenger1);
        result.add(passenger2);

        JSONArray jsonArray = JSONArray.fromObject(result);

        given(this.passengerService.PassengerGet(0))
                .willReturn(result);

        String got = mvc.perform(MockMvcRequestBuilders.get("/PassengerGet?userId=0").accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk()).andReturn().getResponse().getContentAsString();

        Assertions.assertEquals(jsonArray, JSONArray.fromObject(got));
    }

    @Test
    public void testGetPassengerById() throws Exception{
        List<Passenger> result = new LinkedList<>();

        Passenger passenger1 = new Passenger();
        passenger1.setCard_id("1111");
        passenger1.setType(0);
        passenger1.setReal_name("rht");
        passenger1.setTel_number("123414");
        passenger1.setCertificate_type(0);
        Passenger passenger2 = new Passenger();
        passenger2.setCard_id("111");
        passenger2.setType(0);
        passenger2.setReal_name("rh");
        passenger2.setTel_number("123414");
        passenger2.setCertificate_type(0);

        result.add(passenger1);
        result.add(passenger2);

        JSONArray jsonArray = JSONArray.fromObject(result);

        List<Integer> params = new LinkedList<>();

        params.add(0);
        params.add(1);

        JSONObject body = new JSONObject();
        body.put("passenger_id", params);

        given(this.passengerService.getPassengerById(params))
                .willReturn(result);

        ObjectMapper mapper = new ObjectMapper();
        ObjectWriter ow = mapper.writer().withDefaultPrettyPrinter();
        java.lang.String requestJson = ow.writeValueAsString(body);

        String got = mvc.perform(MockMvcRequestBuilders.post("/PassengerGetByPid").accept(MediaType.APPLICATION_JSON).contentType(MediaType.APPLICATION_JSON).content(requestJson))
                .andExpect(status().isOk()).andReturn().getResponse().getContentAsString();

        Assertions.assertEquals(jsonArray, JSONArray.fromObject(got));
    }

    @Test
    public void testPassengerAdd() throws Exception{
        Integer result = 0;
        JSONObject body = new JSONObject();

        body.put("username", "rht");
        body.put("card_id", "12341421");
        body.put("tel_number", "12414141");
        body.put("type", 0);

        given(this.passengerService.PassengerAdd("rht", "12341421", "12414141", 0, 1))
                .willReturn(result);

        ObjectMapper mapper = new ObjectMapper();
        ObjectWriter ow = mapper.writer().withDefaultPrettyPrinter();
        java.lang.String requestJson = ow.writeValueAsString(body);

        String got = mvc.perform(MockMvcRequestBuilders.post("/PassengerAdd?id=1").accept(MediaType.APPLICATION_JSON).contentType(MediaType.APPLICATION_JSON).content(requestJson))
                .andExpect(status().isOk()).andReturn().getResponse().getContentAsString();

        Assertions.assertEquals(result.toString(), got);
    }

    @Test
    public void testPassengerModify() throws Exception{
        Integer result = 0;
        JSONObject body = new JSONObject();

        body.put("username", "rht");
        body.put("card_id", "12341421");
        body.put("tel_number", "12414141");
        body.put("type", 0);

        given(this.passengerService.PassengerModify("rht", "12341421", "12414141", 0, 1))
                .willReturn(result);

        ObjectMapper mapper = new ObjectMapper();
        ObjectWriter ow = mapper.writer().withDefaultPrettyPrinter();
        java.lang.String requestJson = ow.writeValueAsString(body);

        String got = mvc.perform(MockMvcRequestBuilders.post("/PassengerModify?id=1").accept(MediaType.APPLICATION_JSON).contentType(MediaType.APPLICATION_JSON).content(requestJson))
                .andExpect(status().isOk()).andReturn().getResponse().getContentAsString();

        Assertions.assertEquals(result.toString(), got);
    }
}
