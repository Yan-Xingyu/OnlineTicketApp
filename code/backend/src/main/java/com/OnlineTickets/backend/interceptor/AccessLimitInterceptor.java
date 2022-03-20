package com.OnlineTickets.backend.interceptor;

import com.OnlineTickets.backend.annotation.AccessLimit;
import com.alibaba.fastjson.JSONObject;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.method.HandlerMethod;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.handler.HandlerInterceptorAdapter;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.sql.Time;
import java.util.concurrent.TimeUnit;

@Component
public class AccessLimitInterceptor implements HandlerInterceptor {

        @Autowired
        private RedisTemplate redisTemplate;

        @Override
        public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
            HandlerMethod hm = (HandlerMethod) handler;
            //获取方法中的注解,看是否有该注解
            AccessLimit accessLimit = hm.getMethodAnnotation(AccessLimit.class);
            if(accessLimit != null){
                int seconds = accessLimit.seconds();
                int maxCount = accessLimit.maxCount();

                //从redis中获取用户访问的次数

                String ip = request.getHeader("x-forwarded-for");      // 有可能ip是代理的
                if(ip ==null || ip.length() ==0 || "unknown".equalsIgnoreCase(ip)) {
                    ip = request.getHeader("Proxy-Client-IP");
                }
                if(ip ==null || ip.length() ==0 || "unknown".equalsIgnoreCase(ip)) {
                    ip = request.getHeader("WL-Proxy-Client-IP");
                }
                if(ip ==null || ip.length() ==0 || "unknown".equalsIgnoreCase(ip)) {
                    ip = request.getRemoteAddr();
                }
                String key = request.getServletPath() + ":" + ip ;
                Integer count = (Integer) redisTemplate.opsForValue().get(key);

                if (null == count || -1 == count) {
                    redisTemplate.opsForValue().set(key, 1,seconds, TimeUnit.SECONDS);
                    return true;
                }
                if (count < maxCount) {
                    count = count+1;
                    redisTemplate.opsForValue().set(key, count,seconds, TimeUnit.SECONDS);
                    return true;
                }
                if (count >= maxCount) {
                    response.setCharacterEncoding("UTF-8");
                    response.setContentType("application/json; charset=utf-8");
                    JSONObject obj = new JSONObject();
                    obj.put("code", "9999");
                    obj.put("msg", "操作过于频繁，请稍后再试");
                    response.getWriter().write(JSONObject.toJSONString(obj));
                    System.out.println("操作太过频繁错误出现");
                    return false;
                }
            }
            return true;
        }
}
