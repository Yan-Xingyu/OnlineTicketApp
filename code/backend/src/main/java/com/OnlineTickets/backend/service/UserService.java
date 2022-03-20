package com.OnlineTickets.backend.service;

import com.OnlineTickets.backend.entity.TrainStationInfo;
import com.OnlineTickets.backend.entity.MyUser;
import net.sf.json.JSONObject;


import java.util.List;

public interface UserService {
    JSONObject addOne(String username, String password, String e_mail, String real_name, String card_id, String tel_number, int tourist_type);

    int JudgeUsername(String username);

    JSONObject Login(String username, String password);

    MyUser getUser(int id);

    int Modify(int id, String username, String e_mail, int tourist_type);

    JSONObject GetUserId(String username);

    int ModifyPassword(int id, String password);
}
