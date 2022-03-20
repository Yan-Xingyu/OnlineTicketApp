package com.OnlineTickets.backend.service;

import com.OnlineTickets.backend.dao.UserDao;
import com.OnlineTickets.backend.entity.MyUser;
import com.OnlineTickets.backend.serviceimpl.UserServiceImpl;
import net.sf.json.JSONObject;
import org.hamcrest.Matchers;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.MockitoAnnotations;

import java.text.ParseException;

public class UserServiceUnitTest {
    @Mock
    UserDao userDao;

    @InjectMocks
    UserServiceImpl userService;

    @Before
    public void setUp() throws ParseException{
        MockitoAnnotations.initMocks(this);
        JSONObject addOneResult = new JSONObject();
        addOneResult.put("id", 1);
        addOneResult.put("tel_number", "123");
        Mockito.when(userDao.addOne("ren","123","123","reb", "1234", "1234", 0))
                .thenReturn(addOneResult);
        Mockito.when(userDao.JudgeUsername("ren")).thenReturn(1);
        Mockito.when(userDao.Login("ren", "1234")).thenReturn(addOneResult);
        MyUser user = new MyUser();
        user.setUsername("test");
        Mockito.when(userDao.getUser(1)).thenReturn(user);
        Mockito.when(userDao.Modify(0,"ren", "1234", 0)).thenReturn(0);
    }

    @Test
    public void testAddOne(){
        JSONObject obj = userService.addOne("ren","123","123","reb", "1234", "1234", 0);
        Assert.assertThat(obj.get("id"), Matchers.is(1));
        Mockito.verify(userDao).addOne("ren","123","123","reb", "1234", "1234", 0);
    }

    @Test
    public void testJudgeUsername(){
        int result = userService.JudgeUsername("ren");
        Assert.assertThat(result, Matchers.is(1));
        Mockito.verify(userDao).JudgeUsername("ren");
    }

    @Test
    public void testGetUser(){
        MyUser user = userService.getUser(1);
        Assert.assertThat(user.getUsername(), Matchers.is("test"));
        Mockito.verify(userDao).getUser(1);
    }

    @Test
    public void testLogin(){
        JSONObject obj = userService.Login("ren", "1234");
        Assert.assertThat(obj.get("id"), Matchers.is(1));
        Mockito.verify(userDao).Login("ren", "1234");
    }

    @Test
    public void testModify(){
        int result = userService.Modify(0,"ren", "1234", 0);
        Assert.assertThat(result, Matchers.is(0));
        Mockito.verify(userDao).Modify(0,"ren", "1234", 0);
    }
}
