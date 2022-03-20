package com.OnlineTickets.backend.controller;
import com.OnlineTickets.backend.annotation.AccessLimit;
import com.OnlineTickets.backend.entity.TrainInfo;
import com.OnlineTickets.backend.service.TicketService;

import net.sf.json.JSONArray;
import com.OnlineTickets.backend.utils.Message;
import net.sf.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

@RestController
public class TicketController {
    @Autowired
    TicketService ticketService;



//    @AccessLimit(seconds = 5, maxCount = 5)
    @RequestMapping("/PtoPSearch")
    JSONArray PtoPSearch(@RequestBody JSONObject obj) throws ParseException {
        String start = obj.getString("start");
        String end =obj.getString("end");
        String dateTime = obj.getString("datetime");
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
        Date targetDate = sdf.parse(dateTime);
       return ticketService.PtoPSearch(targetDate,start,end);

    }

    @AccessLimit(seconds = 5, maxCount = 5)
    @RequestMapping("/PassBySearch")
    JSONArray PassBySearch(@RequestBody JSONObject obj) throws ParseException {
        String start = obj.getString("start");
        String end =obj.getString("end");
        String dateTime = obj.getString("datetime");
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
        Date targetDate = sdf.parse(dateTime);
        return ticketService.neo4jPassBy(targetDate,start,end);

    }


    @RequestMapping("/PtoPSearchChangeTicket")
    List<TrainInfo> ChangeTicketSearch(@RequestBody JSONObject obj) throws ParseException {
        String start = obj.getString("start");
        String end =obj.getString("end");
        String dateTime = obj.getString("datetime");
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
        Date targetDate = sdf.parse(dateTime);

        return ticketService.ChangeTicketSearch(targetDate,start,end);

    }

    @AccessLimit(seconds = 5, maxCount = 5)
    @RequestMapping("/searchStation")
    JSONObject searchStation(@RequestBody JSONObject obj){
        String start = obj.getString("start");
        String end =obj.getString("end");

        return ticketService.searchStation(start,end);
    }

    @RequestMapping("/searchStationWhenChange")
    JSONObject searchStationChange(@RequestBody JSONObject obj){
        String start = obj.getString("start");
        String end =obj.getString("end");

        return ticketService.searchStationChange(start,end);
    }



    @RequestMapping("/getTicketInfo")
    JSONObject getTicketInfo(@RequestBody JSONObject obj){
        Integer trainId = obj.getInt("train_id");
        Integer start_no = obj.getInt("start_no");
        Integer end_no =obj.getInt("end_no");
        return ticketService.getTicketInfo(trainId,start_no,end_no);
    }

    @RequestMapping("/getTicketInfoTwice")
    JSONObject getTicketInfoTwice(@RequestBody JSONObject obj){
        Integer trainId = obj.getInt("first_train_id");
        Integer start_no = obj.getInt("first_start_no");
        Integer end_no =obj.getInt("first_end_no");
        JSONObject firstInfo =ticketService.getTicketInfo(trainId,start_no,end_no);
        trainId = obj.getInt("second_train_id");
        start_no = obj.getInt("second_start_no");
        end_no =obj.getInt("second_end_no");
        JSONObject secondInfo =ticketService.getTicketInfo(trainId,start_no,end_no);
        JSONObject ret =new JSONObject();
        ret.put("firstInfo",firstInfo);
        ret.put("secondInfo",secondInfo);
        return ret;
    }



    @RequestMapping("/trainNoSearch")
    public Message searchTimeTableInfoByTag(@RequestParam("dateStamp") Long dateStamp, @RequestParam("trainTag") String trainTag){
        return ticketService.searchTimeTableInfoByTag(new Date(dateStamp), trainTag);
    }



}
