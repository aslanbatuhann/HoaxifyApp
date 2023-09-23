package com.hoaxify.ws.dto.user;

import com.hoaxify.ws.responses.FileType;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class UserUpdateVMDto {
    @NotNull
    @Size(min = 4, max = 255)
    private String displayName;
    @FileType(types = {"jpeg", "png"})
    private String image;
}
