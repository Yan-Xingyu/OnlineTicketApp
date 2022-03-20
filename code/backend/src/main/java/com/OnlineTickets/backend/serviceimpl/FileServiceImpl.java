package com.OnlineTickets.backend.serviceimpl;

import com.OnlineTickets.backend.service.FileService;
import org.springframework.stereotype.Service;

import javax.servlet.http.HttpServletResponse;
import java.io.BufferedInputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.OutputStream;
@Service
public class FileServiceImpl implements FileService {
    @Override
    public void logDownload( HttpServletResponse response) throws Exception{
        String rootDir =System.getProperty("user.dir");
        File file = new File(rootDir+"/app-release.apk");
        response.setContentType("application/force-download");
        response.addHeader("Content-Disposition", "attachment;fileName=app-release.apk");
        byte[] buffer = new byte[1024];
        try (FileInputStream fis = new FileInputStream(file);
             BufferedInputStream bis = new BufferedInputStream(fis)) {

            OutputStream os = response.getOutputStream();

            int i = bis.read(buffer);
            while (i != -1) {
                os.write(buffer, 0, i);
                i = bis.read(buffer);
            }
        }
    }


}
