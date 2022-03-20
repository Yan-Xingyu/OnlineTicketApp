package com.OnlineTickets.backend.controller;

import com.OnlineTickets.backend.entity.MyUser;
import com.OnlineTickets.backend.service.UserService;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.ObjectWriter;
import net.sf.json.JSONObject;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;

import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;

import static org.mockito.BDDMockito.given;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(UserController.class)
public class UserControllerUnitTest {
    @Autowired
    private MockMvc mvc;

    @MockBean
    private UserService userService;

    @Test
    public void testRegister() throws Exception{
        JSONObject result = new JSONObject();
        JSONObject body = new JSONObject();

        body.put("username", "ren");
        body.put("password", "1234");
        body.put("e_mail", "111@qq.com");
        body.put("real_name", "任浩天");
        body.put("card_id", "123444444444");
        body.put("tel_number", "123456");
        body.put("tourist_type", 1);
        result.put("user_id", "10");
        result.put("tel_number", "123456");

        ObjectMapper mapper = new ObjectMapper();
        ObjectWriter ow = mapper.writer().withDefaultPrettyPrinter();
        java.lang.String requestJson = ow.writeValueAsString(body);
        java.lang.String responseJson = ow.writeValueAsString(result);

        given(this.userService.addOne("ren","1234","111@qq.com", "任浩天", "123444444444", "123456",1))
                .willReturn(result);

        String got = mvc.perform(MockMvcRequestBuilders.post("/Register").accept(MediaType.APPLICATION_JSON).contentType(MediaType.APPLICATION_JSON).content(requestJson))
                .andExpect(status().isOk()).andExpect(content().string(result.toString())).andReturn().getResponse().getContentAsString();

        Assertions.assertEquals(result.toString(),got);
    }

    @Test
    public void testLogin() throws Exception{
        JSONObject result = new JSONObject();

        result.put("user_id", "10");
        result.put("tel_number", "123456");

        given(this.userService.Login("ren", "1234"))
                .willReturn(result);

        String got = mvc.perform(MockMvcRequestBuilders.get("/Login?username=ren&password=1234").accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk()).andExpect(content().string(result.toString())).andReturn().getResponse().getContentAsString();

        Assertions.assertEquals(result.toString(),got);
    }

    @Test
    public void testJudgeUsername() throws Exception{
        Integer result = 1;

        given(this.userService.JudgeUsername("ren"))
                .willReturn(result);

        String got = mvc.perform(MockMvcRequestBuilders.get("/JudgeUsername?username=ren").accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk()).andExpect(content().string(result.toString())).andReturn().getResponse().getContentAsString();

        Assertions.assertEquals(result.toString(),got);
    }

    @Test
    public void testGetUser() throws Exception{
        MyUser user = new MyUser();
        user.setUsername("ren");

        given(this.userService.getUser(0))
                .willReturn(user);

        String got = mvc.perform(MockMvcRequestBuilders.get("/getUser?id=0").accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk()).andReturn().getResponse().getContentAsString();
    }

    @Test
    public void testModify() throws Exception{
        Integer result = 0;
        JSONObject body = new JSONObject();
        body.put("username", "ren");
        body.put("e_mail", "111@qq.com");
        body.put("type", "1");

        given(this.userService.Modify(0, "ren", "111@qq.com", 1))
                .willReturn(result);

        ObjectMapper mapper = new ObjectMapper();
        ObjectWriter ow = mapper.writer().withDefaultPrettyPrinter();
        java.lang.String requestJson = ow.writeValueAsString(body);

        String got = mvc.perform(MockMvcRequestBuilders.post("/Modify?id=0").accept(MediaType.APPLICATION_JSON).contentType(MediaType.APPLICATION_JSON).content(requestJson))
                .andExpect(status().isOk()).andExpect(content().string(result.toString())).andReturn().getResponse().getContentAsString();

        Assertions.assertEquals(result.toString(), got);
    }
}
