package com.OnlineTickets.backend.daoimpl;

import com.OnlineTickets.backend.dao.PassengerDao;
import com.OnlineTickets.backend.entity.Passenger;
import com.OnlineTickets.backend.entity.MyUser;
import com.OnlineTickets.backend.repository.PassengerRepository;
import com.OnlineTickets.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Set;

@Repository
public class PassengerDaoImpl implements PassengerDao {
    @Autowired
    PassengerRepository passengerRepository;
    @Autowired
    UserRepository userRepository;


    @Override
    public Passenger findById(Integer id){
        return passengerRepository.findById(id).orElse(null);
    }
    @Override
    public int PassengerAdd(String username, String card_id, String tel_number, int type, int user_id){
        MyUser user = userRepository.getOne(user_id);
        Set<Passenger> set = user.getPassengers();
        Passenger passenger = new Passenger();
        passenger.setCard_id(card_id);
        passenger.setCertificate_type(0);
        passenger.setType(type);
        passenger.setReal_name(username);
        passenger.setTel_number(tel_number);
        set.add(passenger);
        userRepository.save(user);
        return 0;
    }
    @Override
    public Set<Passenger> PassengerGet(int user_id){
        MyUser user = userRepository.getOne(user_id);
        Set<Passenger> set = user.getPassengers();
        return set;
    }
    @Override
    public int PassengerModify(String username, String card_id, String tel_number, int type, int id){
        Passenger passenger = passengerRepository.getOne(id);
        passenger.setTel_number(tel_number);
        passenger.setType(type);
        passenger.setReal_name(username);
        passenger.setCard_id(card_id);
        passengerRepository.save(passenger);
        return 0;
    }

    @Override
    public List<Passenger> getPassengerById(List<Integer> passengerId) {
        return passengerRepository.getPassengerById(passengerId);
    }
}
