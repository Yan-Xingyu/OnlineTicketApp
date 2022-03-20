package com.OnlineTickets.backend.serviceimpl;

import com.OnlineTickets.backend.dao.UserDao;
import com.OnlineTickets.backend.entity.TrainStationInfo;
import com.OnlineTickets.backend.entity.MyUser;
import com.OnlineTickets.backend.service.UserService;
import net.sf.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserServiceImpl implements UserService {
    @Autowired
    UserDao userDao;

    @Override
    public JSONObject addOne(String username, String password, String e_mail, String real_name, String card_id, String tel_number, int tourist_type){
        return userDao.addOne(username, password, e_mail, real_name, card_id, tel_number, tourist_type);
    }

    @Override
    public int JudgeUsername(String username){
        return userDao.JudgeUsername(username);
    }

    @Override
    public JSONObject Login(String username, String password){ return userDao.Login(username, password); }

    @Override
    public MyUser getUser(int id){
        return userDao.getUser(id);
    }

    @Override
    public int Modify(int id, String username, String e_mail, int tourist_type){
        return userDao.Modify(id, username, e_mail, tourist_type);
    }

    @Override
    public JSONObject GetUserId(String username){
        return userDao.GetUserId(username);
    }

    @Override
    public int ModifyPassword(int id, String password){
        return userDao.ModifyPassword(id, password);
    }
}
