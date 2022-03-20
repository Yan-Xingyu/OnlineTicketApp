package com.OnlineTickets.backend.daoimpl;

import com.OnlineTickets.backend.dao.UserDao;
import com.OnlineTickets.backend.entity.MyUser;
import com.OnlineTickets.backend.entity.User_authority;
import com.OnlineTickets.backend.repository.UserRepository;
import com.OnlineTickets.backend.repository.User_authorityRepository;
import net.sf.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Repository;

import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.util.Date;
import java.util.List;

@Repository
public class UserDaoImpl implements UserDao {
    @Autowired
    UserRepository userRepository;
    @Autowired
    User_authorityRepository user_authorityRepository;

    @Override
    public JSONObject GetUserId(String username){
        MyUser user = userRepository.findByUsername(username).get(0);
        JSONObject obj = new JSONObject();
        obj.put("id", user.getId());
        obj.put("tel_number", user.getTel_number());
        return obj;
    }

    @Override
    public JSONObject addOne(String username, String password, String e_mail, String real_name, String card_id, String tel_number, int tourist_type){
        try {
            byte key[] = "1234567890ABCDEF1234567890ABCDEf".getBytes("utf-8");
            Date date = new Date();
            MyUser user = new MyUser();
            JSONObject obj = new JSONObject();
            user.setLast_login_time(date);
            user.setAddress("中国");
            user.setCertificate_type(card_id);
            user.setEmail(e_mail);
            user.setUsername(username);
            user.setReal_name(real_name);
            user.setRegion("中国");
            user.setState(1);
            user.setPassword(password);
            user.setTel_number(tel_number);
            user.setTourist_type(tourist_type);
            userRepository.save(user);
            obj.put("id", user.getId());
            obj.put("tel_number", user.getTel_number());
            return obj;
        } catch (Exception e){
            e.printStackTrace();
        }
        return null;
    }

    @Override
    public int JudgeUsername(String username){
        List<MyUser> list = userRepository.findByUsername(username);
        if(list.size() == 0)    return 0;
        return 1;
    }

    @Override
    public JSONObject Login(String username, String password){
        try {
            Date date = new Date();
            byte key[] = "1234567890ABCDEF1234567890ABCDEf".getBytes("utf-8");
            List<MyUser> list = userRepository.findByUsername(username);
            JSONObject obj = new JSONObject();
            if(list.size() == 0) {
                obj.put("id", 0);
                obj.put("tel_number", "");
                return obj;
            }
            MyUser user = list.get(0);
            User_authority user_authority = user_authorityRepository.getOne(user.getId());
            user.setLast_login_time(date);

            //String judge = new String(AesSecurity.decrypt(user_authority.getPassword(), key), "utf-8");
//            if(password.equals(judge)){
//                obj.put("id", user.getId());
//                obj.put("tel_number", user.getTel_number());
//                return obj;
//            }
            obj.put("id", 0);
            obj.put("tel_number", "");
            return obj;
//        } catch (InvalidKeyException e) {
//            e.printStackTrace();
//        } catch (NoSuchAlgorithmException e){
//            e.printStackTrace();
        } catch (Exception e){
            e.printStackTrace();
        }
        return null;
    }

    @Override
    public MyUser getUser(int id){
        MyUser user = userRepository.getOne(id);
        return user;
    }

    @Override
    public int Modify(int id, String username, String e_mail, int tourist_type){
        MyUser user = userRepository.getOne(id);
        user.setUsername(username);
        user.setEmail(e_mail);
        user.setTourist_type(tourist_type);
        userRepository.save(user);
        return 0;
    }

    @Override
    public int ModifyPassword(int id, String password){
        MyUser user = userRepository.getById(id);
        user.setPassword(password);
        userRepository.save(user);
        return 2;
    }
}
