package com.OnlineTickets.backend.utils;

import net.sf.json.JSONObject;

public class Message {
    private int status;
    private String message;
    private JSONObject data;

    Message(int status, String message, JSONObject data) {
        this.status = status;
        this.message = message;
        this.data = data;
    }

    Message(int status, String message) {
        this.status = status;
        this.message = message;
        this.data = null;
    }

    public String getMessage() {
        return message;
    }

    public int getStatus() {
        return status;
    }

    public JSONObject getData() {
        return data;
    }

    public static Message createMessage(int statusCode, String message) {
        return new Message(statusCode, message);
    }

    public static Message createMessage(int statusCode, String message, JSONObject data) {
        return new Message(statusCode, message, data);
    }
}

