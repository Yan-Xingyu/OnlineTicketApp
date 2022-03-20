package com.OnlineTickets.backend.controller;

import com.OnlineTickets.backend.dao.MapSaveDao;
import com.OnlineTickets.backend.dao.SearchDao;

import com.OnlineTickets.backend.service.TicketService;
import net.sf.json.JSONArray;
import net.sf.json.JSONObject;
import com.OnlineTickets.backend.repository.MapStationRepository;
import com.OnlineTickets.backend.utils.MapPath;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;

import java.util.List;



@RestController
public class TestController {
    @Autowired
    SearchDao searchDao;

    @Autowired
    MapSaveDao mapSaveDao;

    @Autowired
    MapStationRepository mapStationRepository;

    @Autowired
    TicketService ticketService;

    @RequestMapping("testConnection")
    JSONObject testConnection(){
        JSONObject obj = new JSONObject();
        obj.put("hello", "hello");
        return obj;
    }

//    @RequestMapping("testMySqlPassBy")
//    JSONArray testPassBy(@RequestBody JSONObject obj) throws ParseException {
//        String start = obj.getString("start");
//        String end =obj.getString("end");
//        String dateTime = obj.getString("datetime");
//        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
//        Date targetDate = sdf.parse(dateTime);
//        return ticketService.mysqlPassBy(targetDate,start,end);
//    }


    @RequestMapping("/saveMapToNeo4j")
    void saveMapToNeo4j(){
        if(mapStationRepository.count() == 0){
            mapSaveDao.saveStationNode();
            mapSaveDao.saveLineNode();
            mapSaveDao.saveTravelMinute();
            mapSaveDao.saveDayDifFromStart();
        }
    }

    @RequestMapping("/testOrderByJava")
    void testOrderByJava(){
        List<MapPath> tmp = searchDao.getOneTransitSortByJava("赤峰", "上海", 0, 100000, 10);
        for(MapPath p : tmp){
            System.out.println(p.getDayDifOfFirstLine());
            System.out.println(p.getDayDifOfSecondLine());
            System.out.println(p);
        }
        System.out.println(tmp.size());
    }
}
