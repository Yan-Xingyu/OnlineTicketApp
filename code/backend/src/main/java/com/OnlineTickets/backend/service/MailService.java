package com.OnlineTickets.backend.service;

public interface MailService {
    void sendSimpleMail(String to, String subject, String content);
}
