package com.OnlineTickets.backend.controller;


import com.OnlineTickets.backend.entity.MyUser;
import com.OnlineTickets.backend.repository.UserRepository;
import com.OnlineTickets.backend.service.UserService;
import net.sf.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.concurrent.TimeUnit;

@RestController
public class UserController {
    @Autowired
    private UserService userService;

    @Autowired
    private RedisTemplate redisTemplate;

    @Autowired
    UserRepository userRepository;

    private BCryptPasswordEncoder bCryptPasswordEncoder;

    public UserController(BCryptPasswordEncoder bCryptPasswordEncoder) {
        this.bCryptPasswordEncoder = bCryptPasswordEncoder;
    }

    @CrossOrigin
    @RequestMapping(value = "GetUserId")
    public JSONObject GetUserId(@RequestParam(value = "username") String username){
        return userService.GetUserId(username);
    }

    @CrossOrigin
    @RequestMapping(value = "/Register",method = RequestMethod.POST)
    public JSONObject Register(@RequestBody Map<String, String> map) {
        String username = map.get("username");
        String password = bCryptPasswordEncoder.encode(map.get("password"));
        String e_mail = map.get("e_mail");
        String real_name = map.get("real_name");
        String card_id = map.get("card_id");
        String tel_number = map.get("tel_number");
        int tourist_type = Integer.parseInt(map.get("tourist_type"));
        return userService.addOne(username, password, e_mail, real_name, card_id, tel_number, tourist_type);
    }

    @CrossOrigin
    @RequestMapping(value = "JudgeUsername", method = RequestMethod.POST)
    public int JudgeUsername(@RequestParam(value = "username") String username){
        return userService.JudgeUsername(username);
    }

    @CrossOrigin
    @RequestMapping(value = "/JudgeE_mail")
    public int JudgeE_mail(@RequestBody Map<String, String> map){
        List<MyUser> list = userRepository.findByEmail(map.get("e_mail"));
        if(list.size() == 0)
            return 0;
        return 1;
    }

    @CrossOrigin
    @RequestMapping(value = "/login", method = RequestMethod.POST)
    public JSONObject Login(@RequestBody Map<String, String> map){
        return userService.Login(map.get("username"), map.get("password"));
    }

    @CrossOrigin
    @RequestMapping(value = "/getUser", method = RequestMethod.POST)
    public MyUser getUser(@RequestParam(value = "id") int id){
        return userService.getUser(id);
    }

    @CrossOrigin
    @RequestMapping(value = "/Modify",method = RequestMethod.POST)
    public int Modify(@RequestParam(value = "id") int id, @RequestBody Map<String, String> map) {
        String username = map.get("username");
        String e_mail = map.get("e_mail");
        int tourist_type = Integer.parseInt(map.get("type"));
        return userService.Modify(id, username, e_mail, tourist_type);
    }

    @CrossOrigin
    @RequestMapping(value = "/PasswordModify")
    public int PasswordModify(@RequestBody Map<String, String> map){
        int id = Integer.parseInt(map.get("id"));
        MyUser user = userRepository.getById(id);
        String key = user.getUsername()+"p_modifySms";
        String Sms = map.get("Sms");
        Object Sms_judge = redisTemplate.opsForValue().get(key);
        if(Sms_judge == null)
            return 1;
        if(!Sms.equals(Sms_judge.toString()))
            return 0;
        String password = bCryptPasswordEncoder.encode(map.get("password"));
        return userService.ModifyPassword(id, password);
    }

    @CrossOrigin
    @RequestMapping(value = "/PasswordAsk")
    public int PasswordAsk(@RequestBody Map<String, String> map){
        List<MyUser> list = userRepository.findByUsername(map.get("username"));
        String key = list.get(0).getUsername()+"p_askSms";
        String Sms = map.get("Sms");
        Object Sms_judge = redisTemplate.opsForValue().get(key);
        if(Sms_judge == null)
            return 1;
        if(!Sms.equals(Sms_judge.toString()))
            return 0;
        String password = bCryptPasswordEncoder.encode(map.get("password"));
        return userService.ModifyPassword(list.get(0).getId(), password);
    }
}
