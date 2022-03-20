package com.OnlineTickets.backend.controller;

import com.OnlineTickets.backend.annotation.AccessLimit;
import com.OnlineTickets.backend.entity.MyUser;
import com.OnlineTickets.backend.repository.UserRepository;
import com.OnlineTickets.backend.service.MailService;
import com.OnlineTickets.backend.utils.CodeUtil;
import com.fasterxml.jackson.annotation.JsonIgnore;
import net.sf.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;
import java.util.concurrent.TimeUnit;

@RestController
public class MailController {
    @Autowired
    MailService mailService;

    @Autowired
    UserRepository userRepository;

    @Autowired
    private RedisTemplate redisTemplate;

    @AccessLimit(seconds = 180, maxCount = 1)
    @RequestMapping("/getSms")
    public JSONObject ModifyPasswordSms(@RequestBody Map<String, String> map){
        int id = Integer.parseInt(map.get("id"));
        MyUser user = userRepository.getById(id);
        String e_mail = user.getEmail();
        String subject = "验证码";
        String content = CodeUtil.generateVerifyCode(6);
        String key = user.getUsername()+"p_modifySms";
        redisTemplate.opsForValue().set(key, content,180, TimeUnit.SECONDS);
        mailService.sendSimpleMail(e_mail, subject, content);
        JSONObject obj = new JSONObject();
        obj.put("msg", "success!");
        obj.put("Sms", content);
        return obj;
    }

    @AccessLimit(seconds = 180, maxCount = 1)
    @RequestMapping("/getSmsAsk")
    public int PasswordAskSms(@RequestBody Map<String, String> map){
        List<MyUser> list2 = userRepository.findByUsername(map.get("username"));
        String e_mail = map.get("e_mail");
        List<MyUser> list1 = userRepository.findByEmail(e_mail);
        if(list1.size() == 0)
            return 0;
        if(list2.size() == 0)
            return 1;
        if(!list2.get(0).getEmail().equals(e_mail))
            return 2;
        String subject = "验证码";
        String content = CodeUtil.generateVerifyCode(6);
        String key = list2.get(0).getUsername()+"p_askSms";
        redisTemplate.opsForValue().set(key, content,180, TimeUnit.SECONDS);
        mailService.sendSimpleMail(e_mail, subject, content);
        return 3;
    }
}
