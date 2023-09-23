package com.hoaxify.ws.dto.file;

import com.hoaxify.ws.model.FileAttachment;
import lombok.Data;

@Data
public class FileAttachmentVMDto {
    private String name;

    private String FileType;

    public FileAttachmentVMDto(FileAttachment fileAttachment) {
        this.setName(fileAttachment.getName());
        this.setFileType(fileAttachment.getFileType());
    }
}
