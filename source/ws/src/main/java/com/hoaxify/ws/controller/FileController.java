package com.hoaxify.ws.controller;

import com.hoaxify.ws.model.FileAttachment;
import com.hoaxify.ws.service.implementation.FileServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
public class FileController {
    @Autowired
    FileServiceImpl fileService;

    @PostMapping("/api/1.0/hoax-attachments")
    public FileAttachment saveHoaxAttachment(MultipartFile file) {
        return fileService.saveHoaxAttachment(file);
    }
}
