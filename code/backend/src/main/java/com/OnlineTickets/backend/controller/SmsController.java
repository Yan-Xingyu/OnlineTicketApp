package com.OnlineTickets.backend.controller;

import com.OnlineTickets.backend.annotation.AccessLimit;
import com.OnlineTickets.backend.utils.CodeUtil;
import com.OnlineTickets.backend.utils.SmsTool;
import com.aliyuncs.dysmsapi.model.v20170525.SendSmsResponse;
import com.aliyuncs.exceptions.ClientException;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import java.util.HashMap;
import java.util.Map;

@RestController
public class SmsController {

    /**
     * 发送短信
     * @return
     * @throws ClientException
     */
    @AccessLimit(seconds = 36000, maxCount = 10)
    @RequestMapping(value = "/smsXxs")
    public Map<String,Object> smsXxs(@RequestBody Map<String, String> map, HttpServletRequest request) throws ClientException {
        String phone = map.get("phone");
        Map<String,Object> result = new HashMap<>();
        // 验证码（指定长度的随机数）
        String code = CodeUtil.generateVerifyCode(6);
        String TemplateParam = "{\"code\":\""+code+"\"}";
        // 短信模板id
        String TemplateCode = "SMS_152440521";
        SendSmsResponse response = SmsTool.sendSms(phone,TemplateParam,TemplateCode);
        result.put("verifyCode",code);
        result.put("phone",phone);
        request.getSession().setAttribute("CodePhone",map);
        if( response.getCode().equals("OK")) {
            map.put("isOk","OK");
        }
        return result;
    }
}

