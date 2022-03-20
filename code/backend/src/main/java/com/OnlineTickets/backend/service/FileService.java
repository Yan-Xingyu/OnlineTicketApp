package com.OnlineTickets.backend.service;

import javax.servlet.http.HttpServletResponse;

public interface FileService {

    void logDownload( HttpServletResponse response) throws Exception;

}
