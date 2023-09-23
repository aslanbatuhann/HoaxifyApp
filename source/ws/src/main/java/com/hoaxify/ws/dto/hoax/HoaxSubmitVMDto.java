package com.hoaxify.ws.dto.hoax;

import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class HoaxSubmitVMDto {

    @Size(min = 1, max = 1000)
    private String content;

    private long attachmentId;
}
