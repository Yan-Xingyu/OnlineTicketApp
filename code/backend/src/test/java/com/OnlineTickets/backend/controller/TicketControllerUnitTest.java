package com.OnlineTickets.backend.controller;

import com.OnlineTickets.backend.service.TicketService;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.web.servlet.MockMvc;

@WebMvcTest(TicketController.class)
public class TicketControllerUnitTest {
    @Autowired
    private MockMvc mvc;

    @MockBean
    TicketService ticketService;




}
