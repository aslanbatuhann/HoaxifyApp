package com.hoaxify.ws.dto.hoax;


import com.hoaxify.ws.dto.file.FileAttachmentVMDto;
import com.hoaxify.ws.dto.user.UserVMDto;
import com.hoaxify.ws.model.Hoax;
import lombok.Data;

@Data
public class HoaxVMDto {

    private Long id;
    private String content;
    private long timestamp;
    private UserVMDto userVMDto;
    private FileAttachmentVMDto fileAttachment;

    public HoaxVMDto(Hoax hoax) {
        this.setId(hoax.getId());
        this.setContent(hoax.getContent());
        this.setTimestamp(hoax.getTimestamp().getTime());
        this.setUserVMDto(new UserVMDto(hoax.getUser()));
        if (hoax.getFileAttachment() != null) {
            this.fileAttachment = new FileAttachmentVMDto(hoax.getFileAttachment());
        }
    }
}
