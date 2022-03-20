package com.OnlineTickets.backend.dao;

import com.OnlineTickets.backend.daoimpl.PassengerDaoImpl;
import com.OnlineTickets.backend.entity.Passenger;
import com.OnlineTickets.backend.entity.MyUser;
import com.OnlineTickets.backend.repository.PassengerRepository;
import com.OnlineTickets.backend.repository.UserRepository;
import net.sf.json.JSONArray;
import net.sf.json.JSONObject;
import org.hamcrest.Matchers;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.MockitoAnnotations;

import java.util.*;

public class PassengerDaoUnitTest {
    @Mock
    PassengerRepository passengerRepository;

    @Mock
    UserRepository userRepository;

    @InjectMocks
    PassengerDaoImpl passengerDao;

    @Before
    public void setup() throws Exception{
        MockitoAnnotations.initMocks(this);
        Passenger passenger = new Passenger();
        passenger.setId(1);
        MyUser user = new MyUser();
        Set<Passenger> set = new HashSet<>();
        set.add(passenger);
        user.setPassengers(set);

        List<Integer> params = new LinkedList<>();
        params.add(0);
        params.add(1);
        Passenger passenger1 = new Passenger();
        Passenger passenger2 = new Passenger();
        passenger1.setId(2);
        passenger2.setId(3);
        List<Passenger> result = new LinkedList<>();
        result.add(passenger1);
        result.add(passenger2);

        Mockito.when(passengerRepository.findById(1)).thenReturn(Optional.of(passenger));

        Mockito.when(userRepository.getOne(1)).thenReturn(user);
        Mockito.when(userRepository.save(user)).thenReturn(user);

        Mockito.when(passengerRepository.getOne(1)).thenReturn(passenger);
        Mockito.when(passengerRepository.save(passenger)).thenReturn(passenger);

        Mockito.when(passengerRepository.getPassengerById(params)).thenReturn(result);
    }

    @Test
    public void TestFindById(){
        Passenger result = passengerDao.findById(1);
        JSONObject out = JSONObject.fromObject(result);
        Passenger passenger = new Passenger();
        passenger.setId(1);
        JSONObject test = JSONObject.fromObject(passenger);
        Assert.assertThat(out, Matchers.is(test));
    }

    @Test
    public void TestPassengerGet(){
        Set<Passenger> result = passengerDao.PassengerGet(1);

        Passenger passenger = new Passenger();
        passenger.setId(1);
        Set<Passenger> set = new HashSet<>();
        set.add(passenger);

        JSONArray out = JSONArray.fromObject(result);
        JSONArray test = JSONArray.fromObject(set);
        Assert.assertThat(out, Matchers.is(test));
    }

    @Test
    public void TestPassengerAdd(){
        int result = passengerDao.PassengerAdd("ren", "1234", "1234", 0, 1);
        Assert.assertThat(result, Matchers.is(0));
    }

    @Test
    public void TestPassengerModify(){
        int result = passengerDao.PassengerModify("ren", "1234", "1234", 0, 1);
        Assert.assertThat(result, Matchers.is(0));
    }

    @Test
    public void TestGetPassengerById(){
        List<Integer> params = new LinkedList<>();
        params.add(0);
        params.add(1);
        Passenger passenger1 = new Passenger();
        Passenger passenger2 = new Passenger();
        passenger1.setId(2);
        passenger2.setId(3);
        List<Passenger> result = new LinkedList<>();
        result.add(passenger1);
        result.add(passenger2);

        List<Passenger> get = passengerDao.getPassengerById(params);
        JSONArray output = JSONArray.fromObject(get);
        JSONArray test = JSONArray.fromObject(result);
        Assert.assertThat(output, Matchers.is(test));
    }
}
