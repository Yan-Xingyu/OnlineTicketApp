package com.OnlineTickets.backend.serviceimpl;

import com.OnlineTickets.backend.dao.PassengerDao;
import com.OnlineTickets.backend.entity.Passenger;
import com.OnlineTickets.backend.service.PassengerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Set;

@Service
public class PassengerServiceImpl implements PassengerService {
    @Autowired
    private PassengerDao passengerDao;

    @Override
    public int PassengerAdd(String username, String card_id, String tel_number, int type, int user_id){
        return passengerDao.PassengerAdd(username, card_id, tel_number, type, user_id);
    }

    @Override
    public Set<Passenger> PassengerGet(int user_id){
        return passengerDao.PassengerGet(user_id);
    }

    @Override
    public int PassengerModify(String username, String card_id, String tel_number, int type, int user_id){
        return passengerDao.PassengerModify(username, card_id, tel_number, type, user_id);
    }

    @Override
    public List<Passenger> getPassengerById(List<Integer> passengerId) {
        return passengerDao.getPassengerById(passengerId);
    }
}
