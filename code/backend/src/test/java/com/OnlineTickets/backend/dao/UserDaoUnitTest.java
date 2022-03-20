package com.OnlineTickets.backend.dao;

import com.OnlineTickets.backend.daoimpl.UserDaoImpl;
import com.OnlineTickets.backend.entity.MyUser;
import com.OnlineTickets.backend.entity.User_authority;
import com.OnlineTickets.backend.repository.UserRepository;
import com.OnlineTickets.backend.repository.User_authorityRepository;
import net.sf.json.JSONObject;
import org.hamcrest.Matchers;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.MockitoAnnotations;
import org.springframework.ui.ModelExtensionsKt;

import javax.crypto.Mac;
import java.util.LinkedList;
import java.util.List;

public class UserDaoUnitTest {
    @Mock
    UserRepository userRepository;

    @Mock
    User_authorityRepository user_authorityRepository;

    @InjectMocks
    UserDaoImpl userDao;

    @Before
    public void setup() throws Exception{
        MockitoAnnotations.initMocks(this);

        List<MyUser> list = new LinkedList<>();
        List<MyUser> list1 = new LinkedList<>();
        MyUser user = new MyUser();
        user.setId(1);
        user.setTel_number(":)");
        User_authority user_authority = new User_authority();
        user_authority.setUsername("ren");
        user_authority.setPassword("1234");
        list.add(user);


        Mockito.when(userRepository.save(user)).thenReturn(user);
        Mockito.when(user_authorityRepository.save(user_authority)).thenReturn(user_authority);

        Mockito.when(userRepository.findByUsername("ren")).thenReturn(list);
        Mockito.when(userRepository.findByUsername("error")).thenReturn(list1);

        Mockito.when(user_authorityRepository.getOne(1)).thenReturn(user_authority);

        Mockito.when(userRepository.getOne(1)).thenReturn(user);

    }

    @Test
    public void testAddOne(){
        JSONObject result = userDao.addOne("ren","1234", "1234", "ren", "1234", "1234", 0);
        Assert.assertThat(result.get("tel_number"), Matchers.is("1234"));
    }

    @Test
    public void testJudgeUsername(){
        int result1 = userDao.JudgeUsername("ren");
        int result2 = userDao.JudgeUsername("error");
        Assert.assertThat(result1, Matchers.is(1));
        Assert.assertThat(result2, Matchers.is(0));
    }

    @Test
    public void testLogin(){
        JSONObject result1 = userDao.Login("ren", "1234");
        JSONObject result2 = userDao.Login("error", "1234");
        JSONObject result3 = userDao.Login("ren", "123");
        Assert.assertThat(result1.get("id"), Matchers.is(1));
        Assert.assertThat(result1.get("tel_number"), Matchers.is(":)"));
        Assert.assertThat(result2.get("id"), Matchers.is(0));
        Assert.assertThat(result2.get("tel_number"), Matchers.is(""));
        Assert.assertThat(result3.get("id"), Matchers.is(0));
        Assert.assertThat(result3.get("tel_number"), Matchers.is(""));
    }

    @Test
    public void testGetUser(){
        JSONObject result = JSONObject.fromObject(userDao.getUser(1));
        Assert.assertThat(result.get("tel_number"), Matchers.is(":)"));
    }

    @Test
    public void testModify(){
        int result = userDao.Modify(1,"ren","1234",0);
        Assert.assertThat(result, Matchers.is(0));
    }
}
