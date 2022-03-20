package com.OnlineTickets.backend.service;

import com.OnlineTickets.backend.utils.Message;
import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

import java.util.Date;
import java.util.List;
import java.util.Map;

public interface TicketService {
    JSONArray PtoPSearch(Date target, String startCity, String endCity);
    JSONArray ChangeTicketSearch(Date target, String startCity, String endCity);
    JSONObject searchStation(String start,String end);
    JSONObject getTicketInfo(Integer trainId,Integer start_no,Integer end_no);
    JSONObject searchStationChange(String start,String end);
    Message searchTimeTableInfoByTag(Date date, String trainTag);

    JSONArray neo4jPassBy(Date target, String startCity, String endCity);
}
