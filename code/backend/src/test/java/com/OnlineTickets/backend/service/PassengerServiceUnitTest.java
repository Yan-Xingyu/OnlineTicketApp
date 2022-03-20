package com.OnlineTickets.backend.service;

import com.OnlineTickets.backend.dao.PassengerDao;
import com.OnlineTickets.backend.entity.Passenger;
import com.OnlineTickets.backend.serviceimpl.PassengerServiceImpl;
import net.sf.json.JSONArray;
import org.hamcrest.Matchers;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.MockitoAnnotations;

import java.text.ParseException;
import java.util.*;

public class PassengerServiceUnitTest {
    @Mock
    PassengerDao passengerDao;

    @InjectMocks
    PassengerServiceImpl passengerService;

    @Before
    public void setUp() throws ParseException {
        MockitoAnnotations.initMocks(this);
        Passenger passenger1 = new Passenger();
        Passenger passenger2 = new Passenger();
        passenger1.setCard_id("123");
        passenger2.setCard_id("1234");
        Set<Passenger> set = new HashSet<>();
        List<Passenger> list = new LinkedList<>();
        set.add(passenger1);
        list.add(passenger1);
        list.add(passenger2);
        set.add(passenger2);
        List<Integer> params = new LinkedList<>();
        params.add(0);
        params.add(1);
        Mockito.when(passengerDao.PassengerAdd("ren","123","123",0, 1))
                .thenReturn(0);
        Mockito.when(passengerDao.PassengerGet(1)).thenReturn(set);
        Mockito.when(passengerDao.PassengerModify("ren", "123", "123", 0, 1))
                .thenReturn(0);
//        Mockito.when(passengerDao.findById(1)).thenReturn(passenger1);
        Mockito.when(passengerDao.getPassengerById(params)).thenReturn(list);
    }

    @Test
    public void testPassengerAdd(){
        int result = passengerService.PassengerAdd("ren","123","123",0, 1);
        Assert.assertThat(result, Matchers.is(0));
        Mockito.verify(passengerDao).PassengerAdd("ren","123","123",0, 1);
    }

    @Test
    public void testPassengerGet(){
        Set<Passenger> test = new HashSet<>();
        Passenger passenger1 = new Passenger();
        Passenger passenger2 = new Passenger();
        passenger1.setCard_id("123");
        passenger2.setCard_id("1234");
        test.add(passenger1);
        test.add(passenger2);
        Set<Passenger> set = passengerService.PassengerGet(1);
        JSONArray actual = JSONArray.fromObject(set);
        JSONArray expected = JSONArray.fromObject(test);
        Assert.assertThat(actual, Matchers.is(expected));
        Mockito.verify(passengerDao).PassengerGet(1);
    }

    @Test
    public void testPassengerModify(){
        int result = passengerService.PassengerModify("ren","123","1234",0, 1);
        Assert.assertThat(result, Matchers.is(0));
        Mockito.verify(passengerDao).PassengerModify("ren","123","1234",0, 1);
    }

    @Test
    public void testGetPassengerById(){
        List<Integer> params = new LinkedList<>();
        params.add(0);
        params.add(1);
        List<Passenger> result = passengerService.getPassengerById(params);
        JSONArray output = JSONArray.fromObject(result);

        Passenger passenger1 = new Passenger();
        Passenger passenger2 = new Passenger();
        passenger1.setCard_id("123");
        passenger2.setCard_id("1234");
        List<Passenger> list = new LinkedList<>();
        list.add(passenger1);
        list.add(passenger2);
        JSONArray test = JSONArray.fromObject(list);

        Assert.assertThat(output, Matchers.is(test));
        Mockito.verify(passengerDao).getPassengerById(params);
    }
}
