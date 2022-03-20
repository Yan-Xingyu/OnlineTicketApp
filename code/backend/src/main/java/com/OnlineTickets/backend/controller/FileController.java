package com.OnlineTickets.backend.controller;

import com.OnlineTickets.backend.service.FileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletResponse;

@RestController
public class FileController {

    @Autowired
    FileService fileService;

    @RequestMapping("/download")
    public void downLoad(HttpServletResponse response) throws Exception {
        fileService.logDownload(response);
    }


}
