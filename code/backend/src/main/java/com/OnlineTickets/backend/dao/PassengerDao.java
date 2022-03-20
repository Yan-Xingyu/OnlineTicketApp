package com.OnlineTickets.backend.dao;

import com.OnlineTickets.backend.entity.Passenger;

import java.util.List;
import java.util.Set;

public interface PassengerDao {
    Passenger findById(Integer id);
    int PassengerAdd(String username, String card_id, String tel_number, int type, int user_id);
    Set<Passenger> PassengerGet(int user_id);
    int PassengerModify(String username, String card_id, String tel_number, int type, int user_id);
    List<Passenger> getPassengerById(List<Integer> passengerId);
}
