package com.OnlineTickets.backend.controller;

import com.OnlineTickets.backend.entity.Passenger;;
import com.OnlineTickets.backend.service.PassengerService;

import net.sf.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Set;

@RestController
public class PassengerController {
    @Autowired
    PassengerService passengerService;

    @CrossOrigin
    @RequestMapping("/PassengerGet")
    public Set<Passenger> PassengerGet(@RequestParam(value="userId") int user_id){
        return passengerService.PassengerGet(user_id);
    }

    @RequestMapping("/PassengerGetByPid")
    public List<Passenger> getPassengerById(@RequestBody JSONObject map){
        List<Integer> passengerId = (List<Integer>) map.get("passenger_id");
        return passengerService.getPassengerById(passengerId);
    }

    @CrossOrigin
    @RequestMapping("/PassengerAdd")
    public int PassengerAdd(@RequestParam(value = "id") int id, @RequestBody Map<String, String> map){
        String username = map.get("username");
        String card_id = map.get("card_id");
        String tel_number = map.get("tel_number");
        int type = Integer.parseInt(map.get("type"));
        return passengerService.PassengerAdd(username,card_id,tel_number,type, id);
    }

    @CrossOrigin
    @RequestMapping("/PassengerModify")
    public int PassengerModify(@RequestParam(value = "id") int id, @RequestBody Map<String, String> map){
        String username = map.get("username");
        String card_id = map.get("card_id");
        String tel_number = map.get("tel_number");
        int type = Integer.parseInt(map.get("type"));
        return passengerService.PassengerModify(username,card_id,tel_number,type, id);
    }
}
